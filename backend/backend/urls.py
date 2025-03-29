from django.contrib import admin
from django.urls import path, include
from backend.views import check_session, get_csrf_token, login_view, logout_view, user_view, register_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('flights.urls')),  # Include flights app API
    path('api/', include('reservations.urls')),  # Reservations API included once
    path("api/login/", login_view),
    path("api/logout/", logout_view),
    path("api/check-session/", check_session),
    path("api/csrf/", get_csrf_token, name="csrf-token"),  
    path('api/user/', user_view, name='user'),
    path("api/register/", register_view, name="register"),
]

# ✅ Ensure media files are served during development
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
