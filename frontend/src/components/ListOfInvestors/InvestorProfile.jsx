"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./InvestorProfile.css"
import { BASE_URL } from "../../helper.js"
import { getFromBackend } from "../../store/fetchdata.jsx"

export default function InvestorProfile() {
  const navigate = useNavigate()
  const [investors, setInvestors] = useState([])
  const [domain, setDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [domainFilter, setDomainFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")

  useEffect(() => {
    fetchInvestors()
  }, []) // Fetch all investors on mount

  async function fetchInvestors(searchDomain = "", filterDomain = "", filterExperience = "") {
    setIsLoading(true)
    try {
      // Build query parameters based on active filters
      let url = `${BASE_URL}/search/investor`
      const params = new URLSearchParams()

      if (searchDomain) params.append("search", searchDomain)
      if (filterDomain) params.append("domain", filterDomain)
      if (filterExperience) params.append("experience", filterExperience)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await getFromBackend(url)
      console.log("Fetched Investors:", response)
      setInvestors(response.data.result || [])
    } catch (err) {
      console.error("Error fetching investors:", err)
      setInvestors([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchInvestors(domain.trim().toLowerCase(), domainFilter, experienceFilter)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleDomainFilter = (e) => {
    const newDomainFilter = e.target.value
    setDomainFilter(newDomainFilter)
    // Apply filter immediately
    fetchInvestors(domain.trim().toLowerCase(), newDomainFilter, experienceFilter)
  }

  const handleExperienceFilter = (e) => {
    const newExperienceFilter = e.target.value
    setExperienceFilter(newExperienceFilter)
    // Apply filter immediately
    fetchInvestors(domain.trim().toLowerCase(), domainFilter, newExperienceFilter)
  }

  const clearAllFilters = () => {
    setDomain("")
    setDomainFilter("")
    setExperienceFilter("")
    fetchInvestors("", "", "")
  }

  const getExperienceBadge = (experience) => {
    if (!experience || experience === "N/A") return "experience-badge default"
    if (experience.toLowerCase().includes("beginner")) return "experience-badge beginner"
    if (experience.includes("years")) {
      const years = Number.parseInt(experience)
      if (years < 5) return "experience-badge junior"
      if (years < 15) return "experience-badge senior"
      return "experience-badge expert"
    }
    return "experience-badge default"
  }

  return (
    <div className="investor-container">
      <div className="investor-content">
        {/* Header */}
        <div className="investor-header">
          <h1 className="investor-title">Connect with Investors</h1>
          <p className="investor-subtitle">Discover and connect with investors in your domain</p>
        </div>

        {/* NEW SEARCH AND FILTER SECTION */}
        <div className="search-filter-section">
          <div className="search-controls">
            {/* Search Bar */}
            <div className="search-field">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input
                type="text"
                className="search-input-field"
                placeholder="Search investors by name..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {domain && (
                <button className="clear-search" onClick={() => setDomain("")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-controls">
              <div className="filter-dropdown">
                <select className="filter-select-field" value={domainFilter} onChange={handleDomainFilter}>
                  <option value="">All Domains</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
                <div className="dropdown-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>

              <div className="filter-dropdown">
                <select className="filter-select-field" value={experienceFilter} onChange={handleExperienceFilter}>
                  <option value="">All Experience</option>
                  <option value="Beginner">Beginner (0-2 years)</option>
                  <option value="Intermediate">Intermediate (3-5 years)</option>
                  <option value="Advanced">Advanced (6-10 years)</option>
                  <option value="Expert">Expert (10+ years)</option>
                </select>
                <div className="dropdown-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="search-actions">
              <button
                className={`search-btn ${isLoading ? "loading" : ""}`}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Search
                  </>
                )}
              </button>

              {/* {(domain || domainFilter || experienceFilter) && (
                <button className="reset-btn" onClick={clearAllFilters}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  Clear
                </button>
              )} */}
            </div>
          </div>

          {/* Active Filters Display */}
          {(domain || domainFilter || experienceFilter) && (
            <div className="active-filters">
              <span className="filters-label">Active filters:</span>
              {domain && <span className="filter-tag">Name: "{domain}"</span>}
              {domainFilter && <span className="filter-tag">Domain: {domainFilter}</span>}
              {experienceFilter && <span className="filter-tag">Experience: {experienceFilter}</span>}
            </div>
          )}
        </div>

        {/* Investor Cards */}
        <div className="investor-cards-container">
          {investors.length > 0 ? (
            investors.map((investor) => (
              <div key={investor.emailid} className="investor-card">
                <div className="investor-card-header">
                  <div className="investor-avatar">
                    <span>{investor.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="investor-info">
                    <h3 className="investor-name">{investor.username}</h3>
                    <p className="investor-domain">{investor.domain}</p>
                  </div>
                </div>

                <div className="investor-details">
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <span className={getExperienceBadge(investor.experience)}>{investor.experience || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expertise:</span>
                    <p className="expertise-text">{investor.expertise || "N/A"}</p>
                  </div>
                </div>

                <div className="investor-actions">
                  <button className="contact-button" onClick={() => navigate(`/chatpage/${investor.emailid}`)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Contact
                  </button>
                  <button className="profile-button" onClick={() => navigate(`/profileIn/${investor.emailid}`)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-investors-card">
              <div className="no-investors-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>No investors found</h3>
              <p>Try adjusting your search criteria or check back later.</p>
              <button
                className="reset-button"
                onClick={() => {
                  setDomain("")
                  setDomainFilter("")
                  setExperienceFilter("")
                  fetchInvestors("", "", "")
                }}
              >
                Show All Investors
              </button>
            </div>
          )}
        </div>

        {/* Results Footer */}
        {investors.length > 0 && (
          <div className="results-footer">
            <p>
              Showing {investors.length} investor{investors.length !== 1 ? "s" : ""}
              {domain && ` matching "${domain}"`}
              {domainFilter && ` in ${domainFilter}`}
              {experienceFilter && ` with ${experienceFilter} experience`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
