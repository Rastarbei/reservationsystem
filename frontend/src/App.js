import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./styles.css"
import Login from "./components/Login";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} /> {/* Ensure this exists */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
