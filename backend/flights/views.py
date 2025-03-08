from rest_framework import generics
from .models import Flight
from .serializers import FlightSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission


# Custom permission to allow only superusers to create flights
class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class FlightListCreateView(generics.ListCreateAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]  # Any logged-in user can view flights
        return [IsSuperUser()]  # Only superusers can add flights


class FlightRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]  # Only admins can update/delete flights
