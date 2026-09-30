from django.db.models import ProtectedError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse
from apps.menu.models import MenuItem
from apps.menu.serializers import MenuItemAdminListSerializer, MenuItemAdminSerializer


class AdminMenuListCreateView(ListCreateAPIView):
    permission_classes = [IsManagerRole]
    queryset = MenuItem.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MenuItemAdminListSerializer
        return MenuItemAdminSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return APIResponse.success(serializer.data, status=201)


class AdminMenuDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsManagerRole]
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemAdminSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return APIResponse.success(self.get_serializer(instance).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return APIResponse.success(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
        except ProtectedError as exc:
            blockers = sorted({obj._meta.verbose_name for obj in exc.protected_objects})
            return APIResponse.error(
                "MENU_ITEM_IN_USE",
                "این آیتم منو به دلیل وجود رکوردهای مرتبط قابل حذف نیست.",
                details={"blocked_by": blockers},
                status=409,
            )
        return APIResponse.success({"deleted": True})
