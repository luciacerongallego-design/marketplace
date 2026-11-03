import hashlib
import hmac
import json
import logging
import threading
import requests
from django.conf import settings
from django.db import transaction
from django.dispatch import receiver
from wagtail.signals import page_published, page_unpublished, page_slug_changed

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 5
ATTEMPTS = 3

def notify_frontend(payload: dict) -> bool:
    secret = getattr(settings, "REVALIDATE_SECRET", "")
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    if not secret:
        logger.info("REVALIDATE_SECRET vacío: no se notifica al frontend")
        return False

    url = f"{frontend_url}/api/revalidate"
    body = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    headers = {
        "Content-Type": "application/json",
        "X-Revalidate-Signature": signature,
    }

    for attempt in range(1, ATTEMPTS + 1):
        try:
            response = requests.post(url, data=body, headers=headers, timeout=TIMEOUT_SECONDS)
            if response.ok:
                logger.info("Frontend revalidado con éxito: %s tags=%s", payload.get("event"), payload.get("tags"))
                return True
            logger.warning("Revalidación ISR respondió %s (intento %s/%s)", response.status_code, attempt, ATTEMPTS)
        except requests.RequestException as exc:
            logger.warning("Revalidación ISR falló (intento %s/%s): %s", attempt, ATTEMPTS, exc)
    return False

def schedule_notification(payload: dict) -> None:
    def run():
        threading.Thread(target=notify_frontend, args=(payload,), daemon=True).start()
    transaction.on_commit(run)

def page_payload(event: str, page) -> dict:
    page_type = page.specific_class._meta.label if page.specific_class else "page"
    tags = ["cms"]
    if "BrandPage" in page_type:
        tags.extend(["brands", "type:brand", f"brand:{page.slug}"])
    elif "ProductPage" in page_type:
        tags.extend(["products", "type:product", f"product:{page.slug}"])
    elif "HomePage" in page_type:
        tags.append("home")

    return {
        "event": event,
        "page_id": page.pk,
        "type": page_type,
        "slug": page.slug,
        "tags": tags,
    }

@receiver(page_published)
def on_page_published(sender, instance, **kwargs):
    schedule_notification(page_payload("page_published", instance))

@receiver(page_unpublished)
def on_page_unpublished(sender, instance, **kwargs):
    schedule_notification(page_payload("page_unpublished", instance))

@receiver(page_slug_changed)
def on_page_slug_changed(sender, instance, **kwargs):
    schedule_notification(page_payload("page_slug_changed", instance))
