import React, { useState } from "react";
import { loginUser } from "../api/auth"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"; // Redirect after login

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
