const BASE_URL = "http://127.0.0.1:8000";

// Function to fetch CSRF token
export async function getCsrfToken() {
    try {
        const response = await fetch(`${BASE_URL}/api/csrf/`, { credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch CSRF token");

        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error("CSRF Token Error:", error);
        return null;
    }
}

// Login function
export async function loginUser(username, password) {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) throw new Error("CSRF token is missing, login aborted.");

    try {
        const response = await fetch(`${BASE_URL}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Invalid credentials");
        }

        const userData = await response.json();

        // Store user data safely
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

// Logout function
export async function logoutUser() {
    try {
        await fetch(`${BASE_URL}/api/logout/`, { method: "GET", credentials: "include" });
    } catch (error) {
        console.error("Logout Error:", error);
    } finally {
        localStorage.removeItem("user"); // Ensure user data is removed
    }
}

// Function to get user details
export function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
        console.error("User Data Parsing Error:", error);
        return null;
    }
}

// Function to check if user is authenticated and role
export function isAuthenticated() {
    const user = getUser();
    return {
        authenticated: !!user,
        isSuperUser: user?.is_superuser || false,
        isStaff: user?.is_staff || false,
    };
}

// Fetch flights (ensures authentication)
export async function fetchFlights() {
    const user = isAuthenticated();
    if (!user.authenticated) throw new Error("User not authenticated");

    try {
        const response = await fetch(`${BASE_URL}/api/flights/`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch flights");

        return response.json();
    } catch (error) {
        console.error("Fetch Flights Error:", error);
        return [];
    }
}
