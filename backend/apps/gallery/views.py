from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse
from apps.gallery.models import GalleryItem
from apps.gallery.serializers import GalleryItemAdminSerializer, GalleryItemPublicSerializer


class PublicGalleryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = GalleryItem.objects.filter(is_visible=True)
        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return APIResponse.success(GalleryItemPublicSerializer(qs, many=True).data)


class AdminGalleryListCreateView(ListCreateAPIView):
    permission_classes = [IsManagerRole]
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemAdminSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return APIResponse.success(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return APIResponse.success(serializer.data, status=201)


class AdminGalleryDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsManagerRole]
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemAdminSerializer

    def retrieve(self, request, *args, **kwargs):
        return APIResponse.success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return APIResponse.success(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return APIResponse.success({"deleted": True})
