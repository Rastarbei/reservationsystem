import { useEffect, useState } from "react"; 
import FlightSearch from "../components/flightsearch";

const Home = () => {
  const [recentBooking, setRecentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:8000/api/latest-reservation/";

  useEffect(() => {
    const fetchLatestBooking = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch latest booking");
        }

        const data = await response.json();
        console.log("Fetched Latest Booking:", data); // Debugging log

        if (data && data.flight) {
          setRecentBooking(data);
        } else {
          setRecentBooking(null);
        }
      } catch (error) {
        console.error("Error fetching latest booking:", error);
        setRecentBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooking();
  }, []);

  return (
    <div className="main-container">
      <div className="main-content">
        <header className="hero">
          <h1>BOOK YOUR AIR TICKET EASY & FAST</h1>
          <p>Find the best deals and book your flights in seconds.</p>
        </header>

        <FlightSearch />

        {/* Upcoming Flights Section */}
        <section className="flights">
          <h2 className="section-title">Upcoming Flights</h2>

          <div className="flight-list">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : recentBooking ? (
              <div key={recentBooking.flight} className="flight-card booked-flight">
                <h4 className="flight-id">Flight ID: {recentBooking.flight}</h4>
                <p className="passenger-name">Passenger: {recentBooking.passenger_name}</p>
                <p className="seat-count">Seats Booked: {recentBooking.seat_count}</p>
                <p className="payment-status">
                  <span className="status-label">Payment Status:</span> {recentBooking.payment_status ? <span className="paid">Paid ✅</span> : <span className="pending">Pending ❌</span>}
                </p>
                <p className="booking-date">
                  <span className="date-label">Booking Date:</span> {new Date(recentBooking.booking_date).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="no-flights">No recent bookings found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
