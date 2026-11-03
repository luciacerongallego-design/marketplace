# -*- coding: utf-8 -*-
"""
Comando: seed_marketplace
Inicializa la estructura base de paginas en Wagtail para el Marketplace UPB.

Uso:
    python manage.py seed_marketplace
    python manage.py seed_marketplace --clear
"""

from django.core.management.base import BaseCommand
from wagtail.models import Page, Site
from marketplace.models import HomePage, BrandPage, ProductPage, CategorySnippet


class Command(BaseCommand):
    help = "Crea la estructura inicial de paginas para el Marketplace de Producto Comercial UPB"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Elimina las paginas de marketplace existentes antes de crear nuevas",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            HomePage.objects.all().delete()
            self.stdout.write(self.style.WARNING("[CLEAR] Paginas eliminadas."))

        if HomePage.objects.exists():
            self.stdout.write(self.style.WARNING("[INFO] Ya existe una HomePage. Usa --clear para recrear."))
            return

        root = Page.objects.filter(depth=1).first()
        if not root:
            self.stdout.write(self.style.ERROR("[ERROR] No existe pagina raiz. Ejecuta migrate primero."))
            return

        # Eliminar pagina de bienvenida por defecto (slug "home")
        existing = Page.objects.filter(slug="home", depth=2).first()

        # Crear HomePage con slug diferente para evitar conflicto
        home = HomePage(
            title="Producto Comercial",
            slug="marketplace-home",
            editorial_title="Centro Comercial Virtual Diseno y Vestuario",
            editorial_intro=(
                "Plataforma editorial y vitrina comercial que reune los proyectos de marca, "
                "propuestas de vestuario y conceptos de diseno desarrollados por los estudiantes "
                "de la asignatura Producto Comercial en la Facultad de Diseno de Vestuario de la UPB."
            ),
            editorial_body=(
                "Cada marca representa una exploracion rigurosa que articula investigacion de usuario, "
                "conceptualizacion estetica, molderia experimental, fichas tecnicas y viabilidad de produccion."
            ),
        )
        root.add_child(instance=home)
        home.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("[OK] HomePage creada y publicada."))

        # Configurar sitio Wagtail
        site, created = Site.objects.update_or_create(
            is_default_site=True,
            defaults={
                "hostname": "localhost",
                "port": 8000,
                "site_name": "PRODUCTO COMERCIAL UPB",
                "root_page": home,
            },
        )
        if not created:
            site.root_page = home
            site.site_name = "PRODUCTO COMERCIAL UPB"
            site.save()
        self.stdout.write(self.style.SUCCESS("[OK] Sitio Wagtail configurado."))

        # Eliminar pagina de bienvenida obsoleta
        if existing:
            try:
                existing.delete()
                self.stdout.write(self.style.WARNING("[OK] Pagina de bienvenida por defecto eliminada."))
            except Exception:
                pass

        # Crear categorias
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
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(categories_data)} categorias creadas."))

        # Crear marca de ejemplo
        brand_page = BrandPage(
            title="134340",
            slug="134340",
            description=(
                "134340 explora la deconstruccion formal y la sastreria experimental. "
                "Una narrativa visual que cuestiona la funcionalidad y la silueta tradicional "
                "del vestuario a traves de pliegues arquitectonicos, cortes laser y superposiciones tactiles."
            ),
            instagram_url="https://instagram.com/134340_brand",
            is_featured_home=True,
        )
        home.add_child(instance=brand_page)
        brand_page.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("[OK] Marca '134340' creada y publicada."))

        # Crear producto de ejemplo
        cat = CategorySnippet.objects.filter(slug="prendas-superiores").first()
        product = ProductPage(
            title="Blusa Hydra",
            slug="blusa-hydra",
            category=cat,
            price=185000,
            description=(
                "Blusa asimetrica confeccionada en popelina tecnica de algodon con tratamiento hidrofobico. "
                "Destaca por su cuello desestructurado con cierre magnetico oculto y abertura longitudinal en espalda."
            ),
        )
        brand_page.add_child(instance=product)
        product.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("[OK] Producto de ejemplo 'Blusa Hydra' creado."))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 55))
        self.stdout.write(self.style.SUCCESS(" MARKETPLACE INICIALIZADO"))
        self.stdout.write(self.style.SUCCESS("=" * 55))
        self.stdout.write("  Panel admin:    http://localhost:8000/admin/")
        self.stdout.write("  API paginas:    http://localhost:8000/api/v2/pages/")
        self.stdout.write("  API categorias: http://localhost:8000/api/v2/categories/")
        self.stdout.write("")
        self.stdout.write("  Siguiente paso: python manage.py createsuperuser")
        self.stdout.write("")
