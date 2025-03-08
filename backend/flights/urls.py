from django.urls import path
from .views import FlightListCreateView, FlightRetrieveUpdateDestroyView

urlpatterns = [
    path('flights/', FlightListCreateView.as_view(), name='flight-list-create'),
    path('flights/<int:pk>/', FlightRetrieveUpdateDestroyView.as_view(), name='flight-detail'),
]
