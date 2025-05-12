import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListEntre.css";
import { BASE_URL } from "../helper";
import { getFromBackend } from "../store/fetchdata.jsx";

export default function EntrepreneurProfile() {
  const navigate = useNavigate();
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEntrepreneurs();
  }, []); // Fetch all entrepreneurs on mount

  async function fetchEntrepreneurs(filter = "") {
    try {
     
         const url=filter?`${BASE_URL}/search/entre/${filter}`:`${BASE_URL}/search/entre`;

      const response = await getFromBackend(url);
      console.log("Fetched Entrepreneurs:", response);

      setEntrepreneurs(response.data.result || []);
    } catch (err) {
      console.error("Error fetching entrepreneurs:", err);
      setEntrepreneurs([]); // Set empty state if there's an error
    }
  }

  const handleSearch = () => {
    fetchEntrepreneurs(searchTerm.trim().toLowerCase());
  };

  return (
    <div className="entrepreneur-container">
      {/* Header */}
      <div className="entrepreneur-header">
        <h1>Discover Entrepreneurs Seeking Funding</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search Entrepreneurs by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Entrepreneur List */}
      <div className="entrepreneur-list-container">
        <table className="entrepreneur-table">
          <thead>
            <tr>
              {["Name", "Email", "Phone", "Funding Needed", "Actions"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entrepreneurs.length > 0 ? (
              entrepreneurs.map((entrepreneur) => (
                <tr key={entrepreneur.emailid}>
                  <td>{entrepreneur.username}</td>
                  <td>{entrepreneur.emailid}</td>
                  <td>{entrepreneur.number}</td>
                  <td>{entrepreneur.needFunding ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="contact-button"
                      onClick={() => navigate(`/chatbox/${entrepreneur.emailid}`)}
                    >
                      Contact
                    </button>
                    <button
                      className="profile-button"
                      onClick={() => navigate(`/profileEn/?email=${entrepreneur.emailid}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-entrepreneurs">No entrepreneurs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
