import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Make sure this is linked

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        console.log("✅ Registration successful!", response.data);
        navigate("/login");
      } else {
        throw new Error("Registration failed.");
      }
    } catch (err) {
      console.error("❌ Registration error:", err.response || err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create an Account</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="register-form" onSubmit={handleRegister}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="register-input" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="register-input" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="register-input" 
          />
        </div>

        <button type="submit" disabled={loading} className="register-button">
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
      </p>
    </div>
  );
};

export default Register;
