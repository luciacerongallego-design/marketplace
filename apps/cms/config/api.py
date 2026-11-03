from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet
from wagtail.models import Page

class CustomPagesAPIViewSet(PagesAPIViewSet):
    known_query_parameters = PagesAPIViewSet.known_query_parameters.union([
        "brand_slug",
        "category_slug",
    ])

    def get_queryset(self):
        qs = super().get_queryset()
        brand_slug = self.request.GET.get("brand_slug")
        category_slug = self.request.GET.get("category_slug")

        if brand_slug:
            # Buscar la ruta de la página de la marca (BrandPage)
            brand_path = Page.objects.filter(slug__iexact=brand_slug).values_list("path", flat=True).first()
            if brand_path:
                # Filtrar páginas que sean hijas/descendientes de dicha marca
                qs = qs.filter(path__startswith=brand_path).exclude(path=brand_path)
            else:
                qs = qs.none()

        if category_slug:
            if hasattr(qs.model, "category"):
                qs = qs.filter(category__slug__iexact=category_slug)
            elif hasattr(qs.model, "productpage"):
                qs = qs.filter(productpage__category__slug__iexact=category_slug)

        return qs

api_router = WagtailAPIRouter("wagtailapi")
api_router.register_endpoint("pages", CustomPagesAPIViewSet)
api_router.register_endpoint("images", ImagesAPIViewSet)
api_router.register_endpoint("documents", DocumentsAPIViewSet)
