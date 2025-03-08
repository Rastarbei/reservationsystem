import { useEffect, useState } from "react";
import FlightSearch from "../components/flightsearch";

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:8000/api/flights/";

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include credentials in request
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }
  
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFlights();
  }, []);
    

  return (
    <div className="main-container">
      <div className="main-content">
        <header className="hero">
          <h1>BOOK YOUR AIR TICKET EASY & FAST</h1>
          <p>Find the best deals and book your flights in seconds.</p>
        </header>

        <FlightSearch />

        <section className="flights">
          <h2 className="section-title">Upcoming Flights</h2>

          <div className="flight-list">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : flights.length > 0 ? (
              flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <h4 className="flight-price">From ${flight.price}</h4>
                  <p className="flight-route">
                    {flight.origin} → {flight.destination}
                  </p>
                  <p className="flight-time">
                    🛫 {flight.departure_time} | 🛬 {flight.arrival_time}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-flights">No available flights at the moment.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
