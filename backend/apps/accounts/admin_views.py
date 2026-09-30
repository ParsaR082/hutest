from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView

from apps.accounts.serializers import StaffCreateSerializer, UserProfileSerializer
from apps.core.permissions import IsAdminRole, IsManagerRole
from apps.core.responses import APIResponse

User = get_user_model()


class CustomerListView(ListAPIView):
    permission_classes = [IsManagerRole]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return User.objects.filter(role=User.Role.CUSTOMER).order_by("-date_joined")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return APIResponse.success(serializer.data)


class CustomerDetailView(RetrieveAPIView):
    permission_classes = [IsManagerRole]
    serializer_class = UserProfileSerializer
    queryset = User.objects.filter(role=User.Role.CUSTOMER)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return APIResponse.success(self.get_serializer(instance).data)


class CustomerTierUpdateView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        user = User.objects.get(pk=pk, role=User.Role.CUSTOMER)
        tier = request.data.get("tier")
        if tier not in dict(User.Tier.choices):
            return APIResponse.error("INVALID_TIER", "Invalid tier value.", status=400)
        user.tier = tier
        user.save(update_fields=["tier"])
        return APIResponse.success(UserProfileSerializer(user).data)


class StaffListCreateView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        staff = User.objects.exclude(role=User.Role.CUSTOMER).order_by("-date_joined")
        return APIResponse.success(UserProfileSerializer(staff, many=True).data)

    def post(self, request):
        serializer = StaffCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return APIResponse.success(UserProfileSerializer(user).data, status=201)
