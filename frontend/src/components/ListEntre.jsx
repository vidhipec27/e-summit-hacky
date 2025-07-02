"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./ListEntre.css"
import { BASE_URL } from "../helper"
import { getFromBackend } from "../store/fetchdata.jsx"
import Navbar from "./Navbar.jsx"

export default function EntrepreneurProfile() {
  const navigate = useNavigate()
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [fundingFilter, setFundingFilter] = useState("")

  useEffect(() => {
    fetchEntrepreneurs()
  }, [])

  async function fetchEntrepreneurs(filter = "") {
    setIsLoading(true)
    try {
      const url = filter ? `${BASE_URL}/search/entre/` : `${BASE_URL}/search/entre`
      const response = await getFromBackend(url)
      console.log("Fetched Entrepreneurs:", response)
      setEntrepreneurs(response.data.result || [])
    } catch (err) {
      console.error("Error fetching entrepreneurs:", err)
      setEntrepreneurs([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchEntrepreneurs(searchTerm.trim().toLowerCase())
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    fetchEntrepreneurs("")
  }

  return (
    <div className="entrepreneur-container">
      <Navbar />

      <div className="entrepreneur-content">
        {/* Header */}
        <div className="entrepreneur-header">
          <div className="header-content">
            <h1 className="entrepreneur-title">
              Top Emerging Entrepreneurs
            </h1>
            <p className="entrepreneur-subtitle">Discover and connect with innovative startup founders</p>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="advanced-search-section">
          <div className="search-header">
          </div>

          <div className="search-controls-grid">
            {/* Main Search Bar */}
            <div className="main-search-container">
              <div className="search-input-group">
                <div className="search-input-wrapper">
                  <div className="search-prefix-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="advanced-search-input"
                    placeholder="Search by name, email, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  {searchTerm && (
                    <button className="clear-input-btn" onClick={clearSearch}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Search Suggestions */}
                {searchTerm && (
                  <div className="search-suggestions-dropdown">
                    <div className="suggestion-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                      </svg>
                      Search for "{searchTerm}"
                    </div>
                    <div className="suggestion-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Find entrepreneurs named "{searchTerm}"
                    </div>
                  </div>
                )}
              </div>

              {/* Search Actions */}
              <div className="search-action-buttons">
                <button
                  className={`primary-search-btn ${isLoading ? "loading" : ""}`}
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="search-spinner"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <span>Search</span>
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {entrepreneurs.length > 0 && (
          <div className="results-info">
            <p>
              Showing {entrepreneurs.length} entrepreneur{entrepreneurs.length !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Entrepreneur Table */}
        <div className="table-section">
          <div className="table-container">
            <table className="entrepreneur-table">
              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Phone
                  </th>
                  <th>
                    Funding Needed
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entrepreneurs.length > 0 ? (
                  entrepreneurs.map((entrepreneur, index) => (
                    <tr key={entrepreneur.emailid} className="entrepreneur-row">
                      <td className="name-cell">
                        <div className="entrepreneur-info">
                          <div className="entrepreneur-avatar">{entrepreneur.username.charAt(0).toUpperCase()}</div>
                          <span className="entrepreneur-name">{entrepreneur.username}</span>
                        </div>
                      </td>
                      <td className="phone-cell">{entrepreneur.number}</td>
                      <td className="funding-cell">
                        <span className={`funding-badge ${entrepreneur.needFunding ? "needed" : "not-needed"}`}>
                          {entrepreneur.needFunding ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="contact-button"
                            onClick={() => navigate(`/chatbox/${entrepreneur.emailid}`)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Contact
                          </button>
                          <button
                            className="profile-button"
                            onClick={() => navigate(`/profileE/${entrepreneur.emailid}`)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-entrepreneurs">
                      <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No entrepreneurs found</h3>
                        <p>Try adjusting your search criteria or check back later.</p>
                        {searchTerm && (
                          <button className="clear-search-button" onClick={clearSearch}>
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
