import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import update_last_login
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt


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




@api_view(["POST"])
@permission_classes([])
def logout_view(request):
    """ Logs out the user and deletes their token """
    user = request.user
    logout(request)
    
    # Remove the authentication token
    Token.objects.filter(user=user).delete()

    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([])  # Require authentication
def user_view(request):
    """ Returns the logged-in user's data """
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        "username": user.username,
        "email": user.email,
        "date_joined": user.date_joined.isoformat(),
    }, status=status.HTTP_200_OK)