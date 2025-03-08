import React from "react";
import { logoutUser } from "../api/auth";

function Logout({ onLogout }) {
    const handleLogout = async () => {
        await logoutUser();
        onLogout(); // Notify parent component
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
