from django.contrib import admin

from apps.accounts.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "username", "role", "tier", "is_active", "date_joined")
    list_filter = ("role", "tier", "is_active")
    search_fields = ("email", "username", "phone", "first_name", "last_name")
