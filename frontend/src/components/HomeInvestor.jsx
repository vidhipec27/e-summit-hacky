import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomeInvestor.css";
import { BASE_URL } from "../helper";
import { getFromBackend } from "../store/fetchdata";
import { useRegistrationCheck } from "../hooks/useRegistrationCheck";
import Navbar from "./Navbar";
import HelpButton from "./Chatbot/HelpButton";
import HelpChat from "./Chatbot/HelpChat";

const HomeInvestor = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check registration completion status
  const { isComplete: isRegistrationComplete, loading: registrationLoading } = useRegistrationCheck("investor");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getFromBackend(`${BASE_URL}/auth/detailsIn`);
        setUsername(response.data.username);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  // Handle feature access with registration check
  const handleExploreEntrepreneurs = () => {
    if (isRegistrationComplete) {
      navigate("/investor/ListOfEntre");
    } else {
      navigate("/complete-registration/investor");
    }
  };

  return (
    <div className="home-container">
      <Navbar handleLogout={handleLogout} />

      <div className="content">
        {loading ? (
          <p>Loading user details...</p>
        ) : error ? (
          <>
            <p className="error-message">{error}</p>
            <button className="home-btn" onClick={() => navigate("/login/investor")}>
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1>Welcome, {username}!</h1>
            <p>You are successfully logged in.</p>
          </>
        )}
      </div>

      {/* Single Offer Card */}
      <div className="offers-section">
        <h2 className="offers-title">WHAT WE OFFER?</h2>
        <div className="offer-card">
          <h3>Look for Eligible Entrepreneurs</h3>
          <p>Invest your funds in promising startups and grow your portfolio.</p>
          <button className="offer-btn" onClick={handleExploreEntrepreneurs}>
            Explore Now
          </button>
        </div>
      </div>

      {/* Interactive Chatbot Button */}
      {!isChatOpen && <HelpButton onClick={() => setIsChatOpen(true)} />}
      {isChatOpen && <HelpChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default HomeInvestor;
