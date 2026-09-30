from rest_framework.response import Response


class APIResponse:
    @staticmethod
    def success(data=None, meta=None, status=200):
        payload = {"success": True, "data": data}
        if meta is not None:
            payload["meta"] = meta
        return Response(payload, status=status)

    @staticmethod
    def error(code, message, details=None, status=400):
        return Response(
            {
                "success": False,
                "error": {"code": code, "message": message, "details": details},
            },
            status=status,
        )
