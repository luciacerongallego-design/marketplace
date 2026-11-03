# -*- coding: utf-8 -*-
"""
Comando: seed_marketplace
Inicializa la estructura base de páginas, marcas, productos y usuario administrador en Wagtail.

Uso:
    python manage.py seed_marketplace
"""

import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from wagtail.models import Page, Site
from marketplace.models import HomePage, BrandPage, ProductPage, CategorySnippet


class Command(BaseCommand):
    help = "Crea la estructura inicial de páginas, marcas y productos para Producto Comercial UPB"

    def handle(self, *args, **options):
        # 1. Crear superusuario administrador si no existe
        User = get_user_model()
        admin_pass = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "Upb2026*Market")
        admin_user, user_created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@productocomercial.upb.edu.co",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if user_created:
            admin_user.set_password(admin_pass)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"[OK] Superusuario 'admin' creado con contraseña: {admin_pass}"))
        else:
            self.stdout.write("[INFO] Superusuario 'admin' ya existe.")

        # 2. Configurar la página Raíz y HomePage
        root = Page.objects.filter(depth=1).first()
        if not root:
            self.stdout.write(self.style.ERROR("[ERROR] No existe página raíz. Ejecuta migrate primero."))
            return

        home = HomePage.objects.first()
        if not home:
            home = HomePage(
                title="Producto Comercial",
                slug="marketplace-home",
                editorial_title="Centro Comercial Virtual Diseño y Vestuario",
                editorial_intro=(
                    "Plataforma editorial y vitrina comercial que reúne los proyectos de marca, "
                    "propuestas de vestuario y conceptos de diseño desarrollados por los estudiantes "
                    "de la asignatura Producto Comercial en la Facultad de Diseño de Vestuario de la UPB."
                ),
                editorial_body=(
                    "Cada marca representa una exploración rigurosa que articula investigación de usuario, "
                    "conceptualización estética, moldería experimental, fichas técnicas y viabilidad de producción."
                ),
            )
            root.add_child(instance=home)
            home.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("[OK] HomePage creada y publicada."))

        # Configurar sitio Wagtail
        site = Site.objects.filter(is_default_site=True).first()
        if not site:
            site = Site.objects.create(
                hostname="localhost",
                port=80,
                site_name="PRODUCTO COMERCIAL · UPB",
                root_page=home,
                is_default_site=True,
            )
            self.stdout.write(self.style.SUCCESS("[OK] Sitio Wagtail configurado."))
        elif site.root_page != home:
            site.root_page = home
            site.save()

        # Eliminar página de bienvenida inicial 'home' si existe
        default_welcome = Page.objects.filter(slug="home", depth=2).first()
        if default_welcome:
            try:
                default_welcome.delete()
            except Exception:
                pass

        # 3. Crear Categorías
        categories_data = [
            ("Prendas Superiores", "prendas-superiores"),
            ("Prendas Inferiores", "prendas-inferiores"),
            ("Vestidos", "vestidos"),
            ("Abrigos y Chaquetas", "abrigos-chaquetas"),
            ("Calzado", "calzado"),
            ("Accesorios", "accesorios"),
        ]
        for name, slug in categories_data:
            CategorySnippet.objects.get_or_create(slug=slug, defaults={"name": name})
        self.stdout.write(self.style.SUCCESS(f"[OK] Categorías listas."))

        # 4. Crear Marcas
        brands_data = [
            {
                "title": "134340",
                "slug": "134340",
                "description": (
                    "134340 explora la deconstrucción formal y la sastrería experimental. "
                    "Una narrativa visual que cuestiona la funcionalidad y la silueta tradicional "
                    "del vestuario a través de pliegues arquitectónicos, cortes láser y superposiciones táctiles."
                ),
                "instagram_url": "https://instagram.com/134340_brand",
                "product": {
                    "title": "Blusa Hydra",
                    "slug": "blusa-hydra",
                    "category_slug": "prendas-superiores",
                    "price": Decimal("185000"),
                    "description": (
                        "Blusa asimétrica confeccionada en popelina técnica de algodón con tratamiento hidrofóbico. "
                        "Destaca por su cuello desestructurado con cierre magnético oculto."
                    ),
                },
            },
            {
                "title": "Brio",
                "slug": "brio",
                "description": "Colección Producto Comercial de vestuario contemporáneo y accesorios.",
                "instagram_url": None,
                "product": {
                    "title": "producto 1",
                    "slug": "producto-1",
                    "category_slug": "accesorios",
                    "price": Decimal("5228"),
                    "description": "Diseño funcional con exploración matérica.",
                },
            },
            {
                "title": "Chiara",
                "slug": "chiara",
                "description": "Propuesta de indumentaria y patronaje experimental UPB.",
                "instagram_url": None,
                "product": {
                    "title": "pantalon",
                    "slug": "pantalon",
                    "category_slug": "prendas-inferiores",
                    "price": Decimal("500000"),
                    "description": "Pantalón de corte editorial en fibras naturales.",
                },
            },
        ]

        for b_data in brands_data:
            brand = BrandPage.objects.filter(slug=b_data["slug"]).first()
            if not brand:
                brand = BrandPage(
                    title=b_data["title"],
                    slug=b_data["slug"],
                    description=b_data["description"],
                    instagram_url=b_data["instagram_url"],
                    is_featured_home=True,
                )
                home.add_child(instance=brand)
                brand.save_revision().publish()
                self.stdout.write(self.style.SUCCESS(f"[OK] Marca '{brand.title}' creada."))

            # Crear producto si no existe
            p_data = b_data.get("product")
            if p_data:
                prod = ProductPage.objects.filter(slug=p_data["slug"]).first()
                if not prod:
                    cat = CategorySnippet.objects.filter(slug=p_data["category_slug"]).first()
                    prod = ProductPage(
                        title=p_data["title"],
                        slug=p_data["slug"],
                        category=cat,
                        price=p_data["price"],
                        description=p_data["description"],
                    )
                    brand.add_child(instance=prod)
                    prod.save_revision().publish()
                    self.stdout.write(self.style.SUCCESS(f"[OK] Producto '{prod.title}' creado bajo '{brand.title}'."))

        self.stdout.write(self.style.SUCCESS("\n[SUCCESS] Marketplace y datos iniciales listos para producción.\n"))
