from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

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
            # Filter child products of this brand
            qs = qs.filter(path__startswith=qs.model.objects.filter(slug=brand_slug).values_list("path", flat=True).first() or "none")

        if category_slug:
            qs = qs.filter(productpage__category__slug=category_slug)

        return qs

api_router = WagtailAPIRouter("wagtailapi")
api_router.register_endpoint("pages", CustomPagesAPIViewSet)
api_router.register_endpoint("images", ImagesAPIViewSet)
api_router.register_endpoint("documents", DocumentsAPIViewSet)
