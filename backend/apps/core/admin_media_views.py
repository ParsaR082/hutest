import os

from PIL import Image
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from apps.core.media_usage import find_usage
from apps.core.models import Media
from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse

ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB


def serialize_media(media: Media, include_usage: bool = False) -> dict:
    data = {
        "id": media.id,
        "name": media.original_filename,
        "path": media.file.name,
        "url": media.file.url,
        "alt_text": media.alt_text,
        "description": media.description,
        "content_type": media.content_type,
        "size": media.size,
        "width": media.width,
        "height": media.height,
        "uploaded_at": media.created_at,
    }
    if include_usage:
        data["usage"] = find_usage(media)
    return data


class MediaUploadView(APIView):
    permission_classes = [IsManagerRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return APIResponse.error("NO_FILE", "No file provided.", status=400)

        extension = os.path.splitext(file.name)[1].lower()
        if extension not in ALLOWED_UPLOAD_EXTENSIONS:
            return APIResponse.error(
                "INVALID_FILE_TYPE",
                "فقط تصاویر با فرمت jpg، jpeg، png، webp یا gif مجاز هستند.",
                status=400,
            )
        if file.size > MAX_UPLOAD_SIZE_BYTES:
            return APIResponse.error(
                "FILE_TOO_LARGE", "حجم فایل نباید بیشتر از ۸ مگابایت باشد.", status=400
            )

        width = height = None
        try:
            with Image.open(file) as img:
                width, height = img.size
        except Exception:
            pass
        file.seek(0)

        media = Media.objects.create(
            file=file,
            original_filename=file.name,
            alt_text=request.data.get("alt_text", ""),
            description=request.data.get("description", ""),
            content_type=getattr(file, "content_type", "") or "",
            size=file.size,
            width=width,
            height=height,
            uploaded_by=request.user if request.user.is_authenticated else None,
        )
        return APIResponse.success(serialize_media(media), status=201)


class MediaLibraryView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        qs = Media.objects.all()
        query = request.query_params.get("q")
        if query:
            qs = qs.filter(original_filename__icontains=query)
        files = [serialize_media(m, include_usage=True) for m in qs]
        return APIResponse.success(files)

    def patch(self, request):
        media_id = request.data.get("id")
        if not media_id:
            return APIResponse.error("NO_ID", "شناسه تصویر لازم است.", status=400)
        try:
            media = Media.objects.get(pk=media_id)
        except Media.DoesNotExist:
            return APIResponse.error("NOT_FOUND", "تصویر یافت نشد.", status=404)
        if "alt_text" in request.data:
            media.alt_text = request.data["alt_text"]
        if "description" in request.data:
            media.description = request.data["description"]
        media.save(update_fields=["alt_text", "description"])
        return APIResponse.success(serialize_media(media, include_usage=True))

    def delete(self, request):
        media_id = request.data.get("id") or request.query_params.get("id")
        if not media_id:
            return APIResponse.error("NO_ID", "شناسه تصویر لازم است.", status=400)
        try:
            media = Media.objects.get(pk=media_id)
        except Media.DoesNotExist:
            return APIResponse.error("NOT_FOUND", "تصویر یافت نشد.", status=404)

        usage = find_usage(media)
        force = str(request.data.get("force") or request.query_params.get("force") or "").lower() == "true"
        if usage and not force:
            return APIResponse.error(
                "IN_USE",
                "این تصویر در حال استفاده است. حذف آن ممکن است بخش‌هایی از وب‌سایت را خراب کند.",
                details={"usage": usage},
                status=409,
            )

        media.file.delete(save=False)
        media.delete()
        return APIResponse.success({"deleted": True})
