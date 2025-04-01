from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
import csv
import os
from io import BytesIO
from reportlab.pdfgen import canvas
from django.conf import settings

from .models import Reservation
from .serializers import ReservationSerializer
from flights.models import Flight  # Ensure Flight model is imported

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from .models import Reservation
from .serializers import ReservationSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes  # Ensure this is imported


@api_view(["GET"])
@permission_classes([AllowAny])
def latest_reservation(request):
    """Returns the latest reservation"""
    latest_booking = Reservation.objects.order_by("-id").first()
    if latest_booking:
        serializer = ReservationSerializer(latest_booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "No reservations found"}, status=status.HTTP_404_NOT_FOUND)


# Ensure MEDIA settings are configured
BOARDING_PASS_DIR = os.path.join(settings.MEDIA_ROOT, "boarding_passes")
if not os.path.exists(BOARDING_PASS_DIR):
    os.makedirs(BOARDING_PASS_DIR)


class ReservationListCreateView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        data = self.request.data
        flight_id = data.get("flight")
        passenger_name = data.get("passenger_name")
        email = data.get("email")

        if not flight_id or not passenger_name or not email:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Invalid flight ID"}, status=status.HTTP_400_BAD_REQUEST)

        reservation = serializer.save(passenger_name=passenger_name, flight=flight)

        # Generate boarding pass
        boarding_pass_url = generate_boarding_pass(reservation)
        if boarding_pass_url:
            reservation.boarding_pass_url = boarding_pass_url
            reservation.save()
        else:
            return Response({"error": "Failed to generate boarding pass."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Full URL to send in email
        full_boarding_pass_url = f"{self.request.build_absolute_uri(settings.MEDIA_URL)}{boarding_pass_url}"

        # Send confirmation email with boarding pass link
        subject = "Flight Booking Confirmation"
        message = (
            f"Dear {passenger_name},\n\n"
            f"Your booking for flight {flight.flight_number} from {flight.origin} to {flight.destination} is confirmed.\n\n"
            f"You can download your boarding pass here: {full_boarding_pass_url}\n\n"
            f"Thank you for choosing our airline!"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=True)

        return Response(
            {
                "message": "Booking successful! Boarding pass generated and email sent.",
                "boarding_pass": full_boarding_pass_url,
            },
            status=status.HTTP_201_CREATED,
        )


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
        writer.writerow(
            [
                reservation.passenger_name,
                reservation.flight.flight_number,
                "Paid" if reservation.payment_status else "Pending",
            ]
        )

    return response


def send_test_email(request):
    """
    Simulates sending an email for demo purposes.
    """
    email = request.GET.get("email")

    if not email:
        return JsonResponse({"error": "Email parameter is missing"}, status=400)

    try:
        send_mail(
            "Demo Email from Airline Reservation System",
            "This is a test email. No actual email was sent, but check the console!",
            settings.DEFAULT_FROM_EMAIL,  # Use the real sender from Django settings
            [email],
            fail_silently=False,
        )
        return JsonResponse({"message": "Test email sent successfully! (Check console)"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def generate_boarding_pass(reservation):
    """
    Generates a PDF boarding pass for the given reservation.
    """
    try:
        # Define the PDF filename and path
        pdf_name = f"boarding_pass_{reservation.id}.pdf"
        pdf_path = os.path.join(BOARDING_PASS_DIR, pdf_name)

        # Generate the PDF
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        p.setFont("Helvetica", 12)

        # Boarding pass details
        p.drawString(100, 800, "BOARDING PASS")
        p.drawString(100, 780, f"Passenger: {reservation.passenger_name}")
        p.drawString(100, 760, f"Flight: {reservation.flight.flight_number}")
        p.drawString(100, 740, f"From: {reservation.flight.origin}")
        p.drawString(100, 720, f"To: {reservation.flight.destination}")
        p.drawString(100, 700, f"Departure: {reservation.flight.departure_time}")
        p.drawString(100, 680, f"Arrival: {reservation.flight.arrival_time}")

        p.showPage()
        p.save()

        # Save the file
        with open(pdf_path, "wb") as f:
            f.write(buffer.getvalue())

        print(f"Boarding pass generated at: {pdf_path}")  # Debugging log

        return f"boarding_passes/{pdf_name}"  # This URL should match Django's MEDIA_URL
    except Exception as e:
        print(f"Error generating boarding pass: {str(e)}")
        return None


class CreateBookingView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        booking = serializer.save()

        # Generate Boarding Pass
        boarding_pass_url = generate_boarding_pass(booking)
        if boarding_pass_url:
            booking.boarding_pass_url = boarding_pass_url
            booking.save()

        full_boarding_pass_url = f"{self.request.build_absolute_uri(settings.MEDIA_URL)}{boarding_pass_url}"

        return Response(
            {"message": "Booking completed!", "boarding_pass": full_boarding_pass_url},
            status=status.HTTP_201_CREATED,
        )
