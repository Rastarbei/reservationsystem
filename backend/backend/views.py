from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json

User = get_user_model()


@ensure_csrf_cookie
def get_csrf_token(request):
    """Sets and returns a CSRF token"""
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_exempt
def register_view(request):
    """Handles user registration"""
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return JsonResponse({"error": "All fields are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({
            "message": "Registration successful",
            "username": user.username,
            "email": user.email,
        }, status=201)


@csrf_exempt
def login_view(request):
    """Handles login and redirects users based on their role"""
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            response_data = {
                "message": "Login successful",
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff,  # Check if user is admin
            }
            return JsonResponse(response_data, status=200)
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
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
        })
    else:
        return JsonResponse({"authenticated": False})


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def user_view(request):
    """Returns the currently authenticated user's data"""
    user = request.user
    return Response({
        "username": user.username,
    }, status=200)
