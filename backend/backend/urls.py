from django.contrib import admin
from django.urls import path, include
from backend.views import check_session, get_csrf_token, login_view, logout_view
from backend.views import check_session, login_view, logout_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('flights.urls')),  # Include flights app API
    path('api/', include('reservations.urls')),
    path("api/login/", login_view),
    path("api/logout/", logout_view),
    path("api/check-session/", check_session),
    path("api/csrf/", get_csrf_token, name="csrf-token"),  # ✅ New CSRF Token API
    path("api/reservations/", include("reservations.urls")),
    path("api/users/", include("users.urls")),
]
