from django.db import models
from flights.models import Flight

class Reservation(models.Model):
    passenger_name = models.CharField(max_length=255)  
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    seat_count = models.PositiveIntegerField(default=1)  # Number of seats booked
    payment_status = models.BooleanField(default=False)
    booking_date = models.DateTimeField(auto_now_add=True)  # Timestamp for the booking

    def __str__(self):
        return f"{self.passenger_name} - {self.flight.flight_number} ({self.seat_count} seats)"
