from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator

@ensure_csrf_cookie
def get_csrf_token(request):
    """Sets and returns a CSRF token"""
    return JsonResponse({"csrfToken": get_token(request)})

@csrf_exempt
def login_view(request):
    """Handles login requests"""
    if request.method == "POST":
        import json
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({
                "message": "Login successful",
                "username": user.username,
                "is_staff": user.is_staff,  # True if the user is an admin
                "is_superuser": user.is_superuser,  # True if the user is a superuser
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

@csrf_exempt
def logout_view(request):
    """Handles logout requests"""
    logout(request)
    return JsonResponse({"message": "Logout successful"}, status=200)

def check_session(request):
    """Checks if the user is authenticated and returns their role"""
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username": request.user.username,
            "is_staff": request.user.is_staff,  # Admin users
            "is_superuser": request.user.is_superuser,  # Superusers
        })
    else:
        return JsonResponse({"authenticated": False})
