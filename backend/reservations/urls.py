from django.urls import path
from .views import ReservationListCreateView, ReservationRetrieveUpdateDestroyView, export_reservations

urlpatterns = [
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationRetrieveUpdateDestroyView.as_view(), name='reservation-detail'),
    path('export-reservations/', export_reservations, name='export-reservations'),
]
