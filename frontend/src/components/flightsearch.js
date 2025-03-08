import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

const FlightSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch flights
  const handleSearch = async () => {
    if (!from || !to || !date) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/flights/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch flights");

      const data = await response.json();
      setFlights(data.length > 0 ? data : []);
      setError(data.length > 0 ? null : "No flights found.");
    } catch (err) {
      console.error("Search Error:", err);
      setError("No flights found or an error occurred.");
      setFlights([]);
    }
  };

  // Navigate to Booking page with flight details
  const handleBooking = (flight) => {
    navigate("/booking", { state: { flight } });
  };

  return (
    <div className="search-container">
      <h2 className="title">Find Your Flight</h2>
      <div className="search-box">
        <input type="text" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="text" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {flights.length > 0 && (
        <div className="flights-grid">
          {flights.map((flight) => (
            <div key={flight.id} className="flight-card">
              <h3>{flight.flight_number}</h3>
              <p><strong>From:</strong> {flight.origin} → <strong>To:</strong> {flight.destination}</p>
              <p><strong>Departure:</strong> {new Date(flight.departure_time).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleString()}</p>
              <p><strong>Seats Available:</strong> {flight.available_seats}</p>
              <p><strong>Price:</strong> ${flight.price}</p>
              <button className="book-btn" onClick={() => handleBooking(flight)}>Book Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
