import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Ensure this path is correct

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔍 Fetching user data...");

        const response = await axios.get("http://127.0.0.1:8000/api/user/", {
          withCredentials: true, // Ensures session cookie is sent
        });

        console.log("✅ User data retrieved:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);

        if (err.response?.status === 401) {
          console.warn("🚨 Unauthorized request (401). Redirecting to login.");
          navigate("/login");
        } else {
          setError("Failed to load user data.");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout/", {}, { withCredentials: true });

      console.log("✅ Logout successful");
      navigate("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      setError("Failed to log out. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <>
          <h1 className="dashboard-title">Welcome, Administrator!</h1>
          

          {/* Admin Button */}
          <button
            className="admin-button"
            onClick={() => window.location.href = "http://127.0.0.1:8000/admin/"}
          >
            Go to Admin Panel
          </button>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p className="loading-message">Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
