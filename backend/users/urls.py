from django.urls import path
from .views import register, login_view, logout_view, user_view

urlpatterns = [
    path("api/register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("api/user/", user_view, name="user"),
]
