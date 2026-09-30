from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.core.responses import APIResponse
from apps.menu.models import MenuItem
from apps.menu.serializers import MenuItemDetailSerializer, MenuItemListSerializer


class MenuListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category")
        qs = MenuItem.objects.filter(is_available=True)
        if category and category != "all":
            qs = qs.filter(category=category)
        serializer = MenuItemListSerializer(qs, many=True)
        return APIResponse.success(serializer.data)


class MenuFeaturedView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = MenuItem.objects.filter(is_available=True, is_featured=True)
        serializer = MenuItemListSerializer(qs, many=True)
        return APIResponse.success(serializer.data)


class MenuDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        item = get_object_or_404(
            MenuItem.objects.prefetch_related(
                "hotspots", "process_steps", "gallery_images", "pairings"
            ),
            slug=slug,
            is_available=True,
        )
        return APIResponse.success(MenuItemDetailSerializer(item).data)
