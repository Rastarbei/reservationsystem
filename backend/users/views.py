from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import update_last_login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    login(request, user)
    update_last_login(None, user)

    # Generate or retrieve token
    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Login successful",
        "user_id": user.id,
        "token": token.key  # Ensure token is returned
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
