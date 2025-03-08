from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import HttpResponse
import csv

from .models import Reservation
from .serializers import ReservationSerializer
from flights.models import Flight  # Ensure Flight model is imported


class ReservationListCreateView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]  # Allow anyone to book

    def perform_create(self, serializer):
        """
        Override to fetch the flight and create a reservation with passenger_name.
        """
        data = self.request.data  # Get the request data

        # Retrieve flight object
        try:
            flight = Flight.objects.get(id=data.get("flight"))
        except Flight.DoesNotExist:
            raise Response({"error": "Invalid flight ID"}, status=status.HTTP_400_BAD_REQUEST)

        passenger_name = data.get("passenger_name")
        if not passenger_name:
            raise Response({"error": "Passenger name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the reservation with passenger_name instead of user
        serializer.save(passenger_name=passenger_name, flight=flight)


class ReservationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]  # Allow updates/deletes for all (adjust if needed)


def export_reservations(request):
    """
    Exports all reservations as a CSV file.
    """
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="reservations.csv"'

    writer = csv.writer(response)
    writer.writerow(["Passenger Name", "Flight", "Payment Status"])  # Updated headers

    reservations = Reservation.objects.all()
    for reservation in reservations:
        writer.writerow([
            reservation.passenger_name,  # Updated from reservation.passenger.username
            reservation.flight.flight_number,
            "Paid" if reservation.payment_status else "Pending"
        ])

    return response
