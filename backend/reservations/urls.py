from django.urls import path
from .views import ReservationListCreateView, ReservationRetrieveUpdateDestroyView, export_reservations, send_test_email, latest_reservation
from django.conf import settings
from django.conf.urls.static import static
from .views import CreateBookingView

urlpatterns = [
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationRetrieveUpdateDestroyView.as_view(), name='reservation-detail'),
    path('export-reservations/', export_reservations, name='export-reservations'),
    path('send-test-email/', send_test_email, name='send-test-email'),
    path("bookings/", CreateBookingView.as_view(), name="create-booking"),
    path("latest-reservation/", latest_reservation, name="latest-reservation"),

]

# ✅ Append static files handling correctly
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
