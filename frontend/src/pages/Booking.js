import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FLIGHTS_URL = "http://127.0.0.1:8000/api/flights/";
const RESERVATION_URL = "http://127.0.0.1:8000/api/reservations/";

const Bookings = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ flightNumber: "", origin: "", destination: "" });
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  // Handle Flight Search
  const handleSearch = async () => {
    setFlights([]);
    setSearchError(null);
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (searchQuery.flightNumber.trim()) queryParams.append("flight_number", searchQuery.flightNumber);
    if (searchQuery.origin.trim()) queryParams.append("origin", searchQuery.origin);
    if (searchQuery.destination.trim()) queryParams.append("destination", searchQuery.destination);

    if (!queryParams.toString()) {
      setSearchError("Please enter a flight number, origin, or destination.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${FLIGHTS_URL}?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Error fetching flights.");

      const flightData = await response.json();
      if (flightData.length === 0) throw new Error("No flights found.");

      setFlights(flightData);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Booking Submission
  const handleProceedToPayment = async () => {
    if (!selectedFlight) {
      alert("Please select a flight.");
      return;
    }
    if (!passengerName.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    const bookingData = {
      flight: selectedFlight.id,
      passenger_name: passengerName,
      email: email,
    };

    try {
      const response = await fetch(RESERVATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        setBookingStatus(`Booking failed: ${result.error || "Unknown error"}`);
      } else {
        const boardingPassURL = result.boarding_pass
          ? `http://127.0.0.1:8000/media/${result.boarding_pass}`
          : null;

        alert(
          `Booking successful! Check your email for confirmation.\n\n` +
          (boardingPassURL ? `Download your boarding pass here: ${boardingPassURL}` : "Boarding pass not available.")
        );

        navigate("/payment", { state: { selectedFlight, passengerName } });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="booking-page">
      <h1 className="booking-title">Book Your Flight</h1>

      {/* Search Bar */}
      <div className="flight-search-card">
        <h2>Search for Available Flights</h2>
        <input 
          type="text" 
          placeholder="Flight Number" 
          value={searchQuery.flightNumber} 
          onChange={(e) => setSearchQuery({ ...searchQuery, flightNumber: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Origin" 
          value={searchQuery.origin} 
          onChange={(e) => setSearchQuery({ ...searchQuery, origin: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Destination" 
          value={searchQuery.destination} 
          onChange={(e) => setSearchQuery({ ...searchQuery, destination: e.target.value })} 
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
        {searchError && <p className="error">{searchError}</p>}
      </div>

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="flight-results">
          <h2>Available Flights</h2>
          {flights.map((flight) => (
            <div
              key={flight.id}
              className={`flight-item ${selectedFlight?.id === flight.id ? "selected-flight" : ""}`}
              onClick={() => setSelectedFlight(flight)}
            >
              <h3>{flight.flight_number}</h3>
              <p><strong>From:</strong> {flight.origin} → <strong>To:</strong> {flight.destination}</p>
              <p><strong>Departure:</strong> {new Date(flight.departure_time).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleString()}</p>
              <p><strong>Price:</strong> ${flight.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form */}
      {selectedFlight && (
        <div className="booking-form">
          <h2>Passenger Details</h2>
          <input 
            type="text" 
            placeholder="Passenger Name" 
            value={passengerName} 
            onChange={(e) => setPassengerName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Enter your Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button onClick={handleProceedToPayment}>Proceed to Payment</button>
          {bookingStatus && <p className="status">{bookingStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default Bookings;
