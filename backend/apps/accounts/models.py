import secrets
import string

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.SUPER_ADMIN)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        STAFF = "staff", "Staff"
        MANAGER = "manager", "Manager"
        ADMIN = "admin", "Admin"
        SUPER_ADMIN = "super_admin", "Super Admin"

    class Tier(models.TextChoices):
        STANDARD = "standard", "Standard"
        SILVER = "silver", "Silver"
        GOLD = "gold", "Gold"
        VIP = "vip", "VIP"

    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )
    tier = models.CharField(
        max_length=20,
        choices=Tier.choices,
        default=Tier.STANDARD,
    )
    phone_verified = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["role"]),
        ]

    @property
    def is_staff_member(self):
        return self.role in {
            self.Role.STAFF,
            self.Role.MANAGER,
            self.Role.ADMIN,
            self.Role.SUPER_ADMIN,
        }

    @property
    def tier_label(self):
        labels = {
            "standard": "عضو",
            "silver": "عضو نقره‌ای",
            "gold": "عضو طلایی",
            "vip": "عضو VIP",
        }
        return labels.get(self.tier, self.tier)


class OTPCode(models.Model):
    OTP_LENGTH = 5
    OTP_TTL_SECONDS = 120
    RESEND_COOLDOWN_SECONDS = 60
    MAX_ATTEMPTS = 5

    phone = models.CharField(max_length=20, db_index=True)
    code = models.CharField(max_length=8)
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [models.Index(fields=["phone", "is_used"])]

    @classmethod
    def generate(cls, phone: str) -> "OTPCode":
        code = "".join(secrets.choice(string.digits) for _ in range(cls.OTP_LENGTH))
        return cls.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timezone.timedelta(seconds=cls.OTP_TTL_SECONDS),
        )

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at
