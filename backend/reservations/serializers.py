from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ["passenger_name", "flight", "seat_count", "payment_status", "booking_date"]
