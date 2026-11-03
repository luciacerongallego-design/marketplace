from django.http import JsonResponse
from .models import CategorySnippet

def categories_api_view(request):
    categories = CategorySnippet.objects.all()
    data = [
        {"id": cat.id, "name": cat.name, "slug": cat.slug}
        for cat in categories
    ]
    return JsonResponse({"items": data})
