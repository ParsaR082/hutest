from django.db import models


class Media(models.Model):
    """A real, queryable record for every uploaded image.

    `file` stores the same `uploads/...` path the old disk-listing endpoint
    used, so existing CharField URL fields elsewhere (MenuItem.image,
    GalleryItem.image, BlogPost.cover_image, etc.) keep storing plain URL
    strings -- but now every one of those strings can be traced back to a
    Media row by exact URL match (see apps.core.media_usage.find_usage),
    instead of being an untracked hand-typed path.
    """

    file = models.FileField(upload_to="uploads/")
    original_filename = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=100, blank=True)
    size = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    uploaded_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="uploaded_media"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.original_filename or self.file.name


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditLog(models.Model):
    actor = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=50)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.action} on {self.entity_type}:{self.entity_id}"
