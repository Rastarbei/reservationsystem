import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000"; // Ensure this matches your backend

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const flightDetails = location.state?.flight ?? {}; // Ensure it's an object

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    mobile: "",
    email: "",
    flight: flightDetails.id || "", // Pre-fill flight ID if available
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update flight ID dynamically when flight details change
  useEffect(() => {
    if (flightDetails.id) {
      setFormData((prev) => ({
        ...prev,
        flight: flightDetails.id,
      }));
    }
  }, [flightDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to book a flight.");
      }

      const response = await fetch(`${BASE_URL}/api/reservations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit booking.");
      }

      alert("Your booking request has been submitted!");

      // Redirect to bookings page
      navigate("/booking");
    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book Your Flight</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Display flight details if available */}
        {flightDetails.id && (
          <div className="flight-info">
            <p><strong>Flight:</strong> {flightDetails.flight_number || "N/A"}</p>
            <p><strong>From:</strong> {flightDetails.origin || "Unknown"} → <strong>To:</strong> {flightDetails.destination || "Unknown"}</p>
            <p><strong>Price:</strong> ${flightDetails.price || "N/A"}</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Proceed"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
