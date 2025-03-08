from django.contrib import admin
from .models import Flight

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'origin', 'destination', 'departure_time', 'arrival_time', 'available_seats', 'price')
    search_fields = ('flight_number', 'origin', 'destination')
    list_filter = ('origin', 'destination')

