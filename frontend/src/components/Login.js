import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Adjust the path if needed

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowRegisterButton(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures cookies (session ID) are sent
        }
      );

      if (response.status === 200) {
        console.log("✅ Login successful!", response.data);

        // Store the authentication token
        localStorage.setItem("token", response.data.token);
        console.log("📌 Token stored:", localStorage.getItem("token"));

        // Redirect based on role
        const { is_admin } = response.data;
        if (is_admin) {
          window.location.href = "/dashboard";
        } else {
          navigate("/booking", { state: { username: response.data.username } });
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response || err);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
      setShowRegisterButton(true); // Show Register button if login fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-wrapper">
        <h2 className="login-title">Sign in</h2>

        {error && <div className="error-message animate-shake">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              required
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              required
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        {/* Show Register button if login fails */}
        {showRegisterButton && (
          <div className="register-section">
            <p>Don't have an account?</p>
            <button className="register-button" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
