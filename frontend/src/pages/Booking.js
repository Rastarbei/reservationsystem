import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api/reservations/";

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight; // Retrieve flight details

  const [passengerName, setPassengerName] = useState("");
  const [seats, setSeats] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);

  // If no flight details are passed, show an error message
  if (!flight) {
    return <p className="error">No flight selected. Please go back and choose a flight.</p>;
  }

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault(); // Prevent form refresh
    try {
      const response = await fetch(BASE_URL, {  // ✅ Fixed API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flight: flight.id,
          passenger_name: passengerName, // ✅ Send passenger name directly
          seat_count: seats, // ✅ Correct field
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      setBookingStatus("Booking successful!");
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (err) {
      console.error("Booking Error:", err);
      setBookingStatus(err.message || "Booking failed. Try again.");
    }
  };

  return (
    <div className="booking-page">
      <h1 className="booking-title">Book Your Flight</h1>

      {/* Show Selected Flight Details */}
      <div className="flight-details">
        <h3>{flight.flight_number}</h3>
        <p><strong>From:</strong> {flight.origin} → <strong>To:</strong> {flight.destination}</p>
        <p><strong>Departure:</strong> {new Date(flight.departure_time).toLocaleString()}</p>
        <p><strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleString()}</p>
        <p><strong>Price:</strong> ${flight.price}</p>
      </div>

      {/* Booking Form */}
      <form className="booking-form" onSubmit={handleBooking}>
        <input 
          type="text" 
          placeholder="Passenger Name" 
          value={passengerName} 
          onChange={(e) => setPassengerName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          min="1" 
          value={seats} 
          onChange={(e) => setSeats(e.target.value)} 
          required 
        />
        <button type="submit">Confirm Booking</button>
      </form>

      {/* Booking Status */}
      {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
    </div>
  );
};

export default Bookings;
