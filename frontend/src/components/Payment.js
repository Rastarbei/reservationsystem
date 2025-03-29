import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api/reservations/";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedFlight, passengerName } = location.state || {};
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Simple card validation
    if (cardNumber.length !== 16 || !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) || cvv.length !== 3) {
      return setPaymentStatus("❌ Invalid card details. Try again.");
    }

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight: selectedFlight.id,
          passenger_name: passengerName,
          seat_count: 1,
          payment_status: true,
        }),
      });

      if (!response.ok) throw new Error("Booking failed. Try again.");

      setPaymentStatus("✅ Payment Successful!");
      setShowNotification(true); // Show notification
      
      // Hide notification after 2.5s and redirect
      setTimeout(() => {
        setShowNotification(false);
        navigate("/");
      }, 2500);
    } catch (err) {
      setPaymentStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment Details</h1>
      <p>Flight: {selectedFlight.flight_number}</p>
      <p>Passenger: {passengerName}</p>
      <p>Price: ${selectedFlight.price}</p>

      <form onSubmit={handlePayment}>
        <input 
          type="text" 
          placeholder="Card Number (16 digits)" 
          value={cardNumber} 
          onChange={(e) => setCardNumber(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Expiry Date (MM/YY)" 
          value={expiryDate} 
          onChange={(e) => setExpiryDate(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="CVV (3 digits)" 
          value={cvv} 
          onChange={(e) => setCvv(e.target.value)} 
          required 
        />
        <button type="submit">Confirm Payment</button>
      </form>

      {paymentStatus && <p className="payment-status">{paymentStatus}</p>}

      {/* Notification Popup */}
      {showNotification && (
        <div className="notification">
          ✅ Payment Successful! Redirecting...
        </div>
      )}
    </div>
  );
};

export default Payment;
