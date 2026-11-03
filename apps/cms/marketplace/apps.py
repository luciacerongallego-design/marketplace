from django.apps import AppConfig

class MarketplaceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "marketplace"
    verbose_name = "Producto Comercial · Marketplace"

    def ready(self):
        import marketplace.signals  # Registra las señales para ISR
