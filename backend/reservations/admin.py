from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("passenger_name", "flight", "seat_count", "payment_status", "booking_date")  # Use passenger_name
    search_fields = ("passenger_name", "flight__flight_number")  # Update search fields
    list_filter = ("payment_status", "booking_date")
