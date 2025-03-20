
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { BASE_URL } from "../helper";
import { getFromBackend } from "../store/fetchdata";
import Navbar from "./Navbar";

const HomeEntre = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getFromBackend(`${BASE_URL}/auth/details`);
        setUsername(response.data.username);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () =>{
    //localStorage.removeItem("token");//
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* Navbar at the top */}
      <Navbar handleLogout={handleLogout} />

      <div className="content">
        {loading ? (
          <p>Loading user details...</p>
        ) : error ? (
          <>
            <p className="error-message">{error}</p>
            <button className="home-btn" onClick={() => navigate("/login/entre")}>Go to Login</button>
          </>
        ) : (
          <>
            <h1>Welcome, {username}!</h1>
            <p>You are successfully logged in.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeEntre;
