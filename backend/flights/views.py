from rest_framework import generics
from .models import Flight
from .serializers import FlightSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission

# Custom permission to allow only superusers to create flights
class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class FlightListCreateView(generics.ListCreateAPIView):
    serializer_class = FlightSerializer

    def get_queryset(self):
        queryset = Flight.objects.all()
        flight_number = self.request.query_params.get("flight_number", None)
        origin = self.request.query_params.get("origin", None)
        destination = self.request.query_params.get("destination", None)

        if flight_number:
            queryset = queryset.filter(flight_number__icontains=flight_number)
        if origin:
            queryset = queryset.filter(origin__icontains=origin)
        if destination:
            queryset = queryset.filter(destination__icontains=destination)

        return queryset  # Return the filtered queryset

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Any logged-in user can view flights
        return [IsSuperUser()]  # Only superusers can add flights

class FlightRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]  # Only admins can update/delete flights
