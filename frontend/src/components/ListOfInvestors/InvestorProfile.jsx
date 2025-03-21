import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InvestorProfile.css";
import { BASE_URL } from "../../helper.js";
import { getFromBackend } from "../../store/fetchdata.jsx";

export default function InvestorProfile() {
  const navigate = useNavigate();
  const [investors, setInvestors] = useState([]);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    fetchInvestors();
  }, []); // Fetch all investors on mount

  async function fetchInvestors(domainFilter = "") {
    try {
      const url = domainFilter
        ? `${BASE_URL}/search/investor/${domainFilter}`
        : `${BASE_URL}/search/investor`;

      const response = await getFromBackend(url);
      console.log("Fetched Investors:", response);

      setInvestors(response.data.result || []);
    } catch (err) {
      console.error("Error fetching investors:", err);
      setInvestors([]); // Set empty state if there's an error
    }
  }

  const handleSearch = () => {
    fetchInvestors(domain.trim().toLowerCase());
  };

  return (
    <div className="investor-container">
      {/* Header */}
      <div className="investor-header">
        <h1>Connect with investors</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search for Investors by Domain..."
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Investor List */}
      <div className="investor-list-container">
        <table className="investor-table">
          <thead>
            <tr>
              {["Name", "Email", "Domain", "Experience", "Expertise", "Actions"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {investors.length > 0 ? (
              investors.map((investor) => (
                <tr key={investor.emailid}>
                  <td>{investor.username}</td>
                  <td>{investor.emailid}</td>
                  <td>{investor.domain}</td>
                  <td>{investor.experience ? `${investor.experience}` : "N/A"}</td>
                  <td>{investor.expertise || "N/A"}</td>
                  <td>
                    <button
                      className="contact-button"
                      onClick={() => navigate(`/chatbox/${investor.emailid}`)}
                    >
                      Contact
                    </button>
                    <button
                      className="profile-button"
                      onClick={() => navigate(`/investor_profile?email=${investor.emailid}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-investors">No investors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
