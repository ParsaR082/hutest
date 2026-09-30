from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "password_confirm", "first_name", "last_name", "phone")

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    tier_label = serializers.CharField(read_only=True)
    member_since = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "phone",
            "avatar",
            "role",
            "tier",
            "tier_label",
            "member_since",
            "date_joined",
        )
        read_only_fields = ("id", "email", "role", "tier", "date_joined")

    def get_member_since(self, obj):
        return obj.date_joined.strftime("%Y")


class StaffCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "username", "password", "first_name", "last_name", "phone", "role")

    def validate_role(self, value):
        allowed = {User.Role.STAFF, User.Role.MANAGER, User.Role.ADMIN}
        if value not in allowed:
            raise serializers.ValidationError("Invalid staff role.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
