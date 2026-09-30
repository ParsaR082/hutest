from rest_framework.permissions import BasePermission


class IsStaffRole(BasePermission):
    STAFF_ROLES = {"staff", "manager", "admin", "super_admin"}

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in self.STAFF_ROLES
        )


class IsManagerRole(BasePermission):
    MANAGER_ROLES = {"manager", "admin", "super_admin"}

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in self.MANAGER_ROLES
        )


class IsAdminRole(BasePermission):
    ADMIN_ROLES = {"admin", "super_admin"}

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in self.ADMIN_ROLES
        )


class IsSuperAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "super_admin"
        )
