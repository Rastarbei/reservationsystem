import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Converts token existence to boolean
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">Built in Airways</div>

        {/* Hamburger Menu for Mobile */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/booking" onClick={() => setMenuOpen(false)}>Book Now</Link></li>

          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          ) : (
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
