import { useState, useEffect } from "react";
import axios from "axios";

function Flights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/flights/")
      .then(response => setFlights(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Available Flights</h2>
      {flights.map(flight => (
        <div key={flight.id}>
          <h3>{flight.origin} to {flight.destination}</h3>
          <p>Departure: {flight.departure_time}</p>
          <p>Price: ${flight.price}</p>
          <button>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default Flights;
