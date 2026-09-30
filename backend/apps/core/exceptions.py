from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        error_data = {
            "code": _get_error_code(exc),
            "message": _get_error_message(response.data),
            "details": response.data if isinstance(response.data, dict) else None,
        }
        return Response(
            {"success": False, "error": error_data},
            status=response.status_code,
        )
    return response


def _get_error_code(exc):
    if isinstance(exc, APIException):
        return exc.__class__.__name__
    return "SERVER_ERROR"


def _get_error_message(data):
    if isinstance(data, dict):
        if "detail" in data:
            return str(data["detail"])
        first_key = next(iter(data), None)
        if first_key:
            val = data[first_key]
            if isinstance(val, list):
                return str(val[0])
            return str(val)
    if isinstance(data, list) and data:
        return str(data[0])
    return "An error occurred"
