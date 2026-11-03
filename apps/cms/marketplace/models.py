from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from rest_framework import serializers
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.models import Orderable, Page
from wagtail.snippets.models import register_snippet


# --- Serializadores para la API REST ---
class ImageRenditionField(serializers.Field):
    """Serializa una imagen de Wagtail a una URL utilizable por el frontend Next.js."""

    def __init__(self, spec="max-1600x1600", **kwargs):
        self.spec = spec
        super().__init__(**kwargs)

    def to_representation(self, image):
        if not image:
            return None
        try:
            rendition = image.get_rendition(self.spec)
            return {
                "id": image.id,
                "title": image.title,
                "url": rendition.url,
                "width": rendition.width,
                "height": rendition.height,
            }
        except Exception:
            return {
                "id": image.id,
                "title": image.title,
                "url": image.file.url if image.file else None,
            }


class DocumentUrlField(serializers.Field):
    """Serializa un documento PDF de Wagtail devolviendo su URL."""

    def to_representation(self, doc):
        if not doc:
            return None
        return {
            "id": doc.id,
            "title": doc.title,
            "url": doc.url,
        }


# --- CATEGORÍAS (Snippet administrable en Wagtail) ---
@register_snippet
class CategorySnippet(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre de categoría")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Identificador (slug)")

    panels = [
        FieldPanel("name"),
        FieldPanel("slug"),
    ]

    class Meta:
        verbose_name = "Categoría de producto"
        verbose_name_plural = "Categorías de productos"
        ordering = ["name"]

    def __str__(self):
        return self.name


# --- PÁGINA PRINCIPAL / HOME ---
class HomePage(Page):
    max_count = 1

    editorial_title = models.CharField(
        max_length=255,
        default="Centro Comercial Virtual · Diseño y Vestuario",
        verbose_name="Título editorial",
    )
    editorial_intro = models.TextField(
        default="Plataforma editorial y vitrina comercial que reúne los proyectos de marca desarrollados por estudiantes de la UPB.",
        verbose_name="Introducción editorial",
    )
    editorial_body = models.TextField(
        default="Cada marca representa una exploración rigurosa que articula investigación de usuario, moldería experimental y fichas técnicas.",
        verbose_name="Cuerpo del manifiesto",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("editorial_title"),
                FieldPanel("editorial_intro"),
                FieldPanel("editorial_body"),
            ],
            heading="Presentación Editorial",
        ),
    ]

    api_fields = [
        APIField("editorial_title"),
        APIField("editorial_intro"),
        APIField("editorial_body"),
    ]

    subpage_types = ["marketplace.BrandPage"]

    class Meta:
        verbose_name = "Página de Inicio (Home)"


# --- MARCAS (BrandPage) ---
class BrandPage(Page):
    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Logo de la marca",
    )
    cover_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Imagen de identidad / Portada",
    )
    description = models.TextField(
        verbose_name="Presentación o descripción de la marca",
        help_text="Explica el concepto estético, universo visual y propuesta de valor de la marca.",
    )
    entry_banner = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Banner de entrada (Gran formato superior)",
    )
    exit_banner = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Banner de salida (Gran formato inferior)",
    )
    promo_banner = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Banner promocional para el Slider del Home",
    )
    instagram_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="URL de Instagram Oficial",
    )
    revista_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="URL de Revista Digital (ej. Issuu / Calameo)",
    )
    fichas_tecnicas_doc = models.ForeignKey(
        "wagtaildocs.Document",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Fichas técnicas en archivo PDF",
    )
    fichas_tecnicas_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="Enlace alternativo a Fichas Técnicas (Drive/Notion)",
    )
    is_featured_home = models.BooleanField(
        default=True,
        verbose_name="Destacar en Home",
        help_text="Activa esta casilla para mostrar esta marca en la sección de marcas destacadas de la página principal.",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("logo"),
                FieldPanel("cover_image"),
                FieldPanel("description"),
                FieldPanel("is_featured_home"),
            ],
            heading="Identidad de Marca",
        ),
        MultiFieldPanel(
            [
                FieldPanel("entry_banner"),
                FieldPanel("exit_banner"),
                FieldPanel("promo_banner"),
            ],
            heading="Banners Administrables",
        ),
        MultiFieldPanel(
            [
                FieldPanel("revista_url"),
                FieldPanel("instagram_url"),
                FieldPanel("fichas_tecnicas_doc"),
                FieldPanel("fichas_tecnicas_url"),
            ],
            heading="Botones de Acceso Externo",
        ),
    ]

    api_fields = [
        APIField("description"),
        APIField("is_featured_home"),
        APIField("instagram_url"),
        APIField("revista_url"),
        APIField("fichas_tecnicas_url"),
        APIField("logo", serializer=ImageRenditionField("max-400x400")),
        APIField("cover_image", serializer=ImageRenditionField("max-1600x1200")),
        APIField("entry_banner", serializer=ImageRenditionField("max-2000x1000")),
        APIField("exit_banner", serializer=ImageRenditionField("max-2000x1000")),
        APIField("promo_banner", serializer=ImageRenditionField("max-2000x1000")),
        APIField("fichas_tecnicas_doc", serializer=DocumentUrlField()),
    ]

    parent_page_types = ["marketplace.HomePage"]
    subpage_types = ["marketplace.ProductPage"]

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"


# --- PRODUCTOS (ProductPage) ---
class ProductPage(Page):
    category = models.ForeignKey(
        CategorySnippet,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="products",
        verbose_name="Categoría de producto",
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        verbose_name="Precio (COP)",
    )
    description = models.TextField(
        verbose_name="Descripción de la prenda",
        help_text="Detalles de diseño, textiles, patronaje y cuidados.",
    )
    model_photo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Fotografía 1: Prenda puesta sobre modelo",
    )
    floating_photo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Fotografía 2: Prenda flotante (sin modelo)",
    )

    content_panels = Page.content_panels + [
        FieldPanel("category"),
        FieldPanel("price"),
        FieldPanel("description"),
        MultiFieldPanel(
            [
                FieldPanel("model_photo"),
                FieldPanel("floating_photo"),
            ],
            heading="Fotografías para Carrusel de Tarjeta (Puesta vs Flotante)",
        ),
        InlinePanel("gallery_images", label="Fotografías adicionales de galería"),
    ]

    api_fields = [
        APIField("price"),
        APIField("description"),
        APIField("category", serializer=serializers.SerializerMethodField("get_category_data")),
        APIField("brand", serializer=serializers.SerializerMethodField("get_brand_data")),
        APIField("model_photo", serializer=ImageRenditionField("max-1200x1600")),
        APIField("floating_photo", serializer=ImageRenditionField("max-1200x1600")),
        APIField("gallery", serializer=serializers.SerializerMethodField("get_gallery_data")),
    ]

    def get_category_data(self, page):
        if not page.category:
            return None
        return {
            "id": page.category.id,
            "name": page.category.name,
            "slug": page.category.slug,
        }

    def get_brand_data(self, page):
        parent = page.get_parent().specific
        if isinstance(parent, BrandPage):
            return {
                "id": parent.id,
                "title": parent.title,
                "slug": parent.slug,
            }
        return None

    def get_gallery_data(self, page):
        items = []
        for item in page.gallery_images.all():
            if item.image:
                rendition = item.image.get_rendition("max-1400x1400")
                items.append({
                    "id": item.image.id,
                    "url": rendition.url,
                    "caption": item.caption,
                })
        return items

    parent_page_types = ["marketplace.BrandPage"]
    subpage_types = []

    class Meta:
        verbose_name = "Producto / Prenda"
        verbose_name_plural = "Productos / Prendas"


class ProductGalleryImage(Orderable):
    page = ParentalKey(ProductPage, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name="Fotografía adicional",
    )
    caption = models.CharField(blank=True, max_length=250, verbose_name="Pie de foto / detalle")

    panels = [
        FieldPanel("image"),
        FieldPanel("caption"),
    ]
