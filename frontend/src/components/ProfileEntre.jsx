// "use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { BASE_URL } from "../helper"
import { FaUser, FaEnvelope, FaPhone, FaDollarSign, FaRocket, FaUsers, FaClock } from "react-icons/fa"
import "./ProfileEntre.css"
import { getFromBackend, postToBackend } from "../store/fetchdata"
import { jwtDecode } from "jwt-decode"
import Navbar from "../components/Navbar";

const ProfileEntre = () => {
  const { emailid } = useParams() // Extract email from route params
  const [userProfile, setUserProfile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rating, setRating] = useState(0)
  const [isRated, setIsRated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hoverRating, setHoverRating] = useState(0)

  const jwtToken = localStorage.getItem("token")
  const token = jwtDecode(jwtToken)

  // Startup stage mapping with more descriptive labels
  const startupStages = ["Idea Stage", "MVP Development", "Market Launch", "Revenue Generating"]

  // Team size mapping
  const teamSizes = ["Less than 10", "10-25 members", "25-50 members", "50-100 members", "100+ members"]

  // Experience mapping
  const experienceLevels = ["Less than 3", "3-6", "6-12", "12+"]

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(emailid)
        const response = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`)
        console.log("Profile data:", response)
        setUserProfile(response.data.result[0])
        setIsRated(response.data.result[0].feedback.some((feedback) => feedback.investorId === token.emailid))
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUserProfile({
          username: "Guest",
          emailid: "guest@example.com",
          number: "0000000000",
          needFunding: 0,
          startupStage: 0,
          experience: 0,
          teamSize: 0,
          averageRating: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [emailid, token.emailid])

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating!")
      return
    }

    const feedbackData = {
      investorId: token.emailid,
      rating,
    }

    try {
      const resp = await postToBackend(`${BASE_URL}/addFeedback/${emailid}`, feedbackData)
      alert("Thank you for your rating!")
      console.log(resp.data)
      const updatedProfile = resp.data.entre
      setUserProfile(updatedProfile)
      setIsRated(true)
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Failed to submit your rating.")
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="loading-state">
        <FaUser size={50} color="#00e5ff" />
        <p className="loading-text">Profile not found</p>
      </div>
    )
  }

  return (
     <><Navbar />
     <div className="profile-container">
          <div className="profile-card">
              <div className="profile-header">
                  <h1 className="profile-title">{userProfile.username || "Entrepreneur"}</h1>
                  <p className="profile-subtitle">Entrepreneur Profile</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaUser size={10} />
                      </span>
                      Username
                  </label>
                  <p className="profile-value">{userProfile.username || "Not available"}</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaEnvelope size={10} />
                      </span>
                      Email
                  </label>
                  <p className="profile-value">{userProfile.emailid || "Not available"}</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaPhone size={10} />
                      </span>
                      Phone Number
                  </label>
                  <p className="profile-value">{userProfile.number || "Not available"}</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaDollarSign size={10} />
                      </span>
                      Funding Status
                  </label>
                  <div className="profile-value value-with-badge">
                      <span>{userProfile.needFunding === 1 ? "Seeking Investment" : "Not Seeking Funding"}</span>
                      <span className={`badge ${userProfile.needFunding === 1 ? "badge-success" : "badge-warning"}`}>
                          {userProfile.needFunding === 1 ? "OPEN" : "CLOSED"}
                      </span>
                  </div>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaRocket size={10} />
                      </span>
                      Startup Stage
                  </label>
                  <p className="profile-value">{startupStages[userProfile.startupStage] || "Not specified"}</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaUsers size={10} />
                      </span>
                      Team Size
                  </label>
                  <p className="profile-value">{teamSizes[userProfile.teamSize] || "Not specified"}</p>
              </div>

              <div className="profile-form-group">
                  <label className="profile-label">
                      <span className="info-icon">
                          <FaClock size={10} />
                      </span>
                      Experience
                  </label>
                  <p className="profile-value">{experienceLevels[userProfile.experience] || "Not specified"} months</p>
              </div>

              <div className="rating-section">
                  <div className="rating-header">
                      <h3 className="rating-title">Entrepreneur Rating</h3>
                      <div className="current-rating">
                          {userProfile.averageRating > 0 ? (
                              <>
                                  <span className="rating-value">{userProfile.averageRating.toFixed(1)}</span>
                                  <span className="rating-max">/ 5.0</span>
                              </>
                          ) : (
                              <span className="rating-value">New</span>
                          )}
                      </div>
                  </div>

                  {!isRated && (
                      <div className="rating-container">
                          <div className="rating-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                      key={star}
                                      className={`star ${rating >= star ? "filled" : ""} 
                                                  ${hoverRating >= star ? "filled" : ""}`}
                                      onClick={() => setRating(star)}
                                      onMouseEnter={() => setHoverRating(star)}
                                      onMouseLeave={() => setHoverRating(0)}
                                  >
                                      ★
                                  </span>
                              ))}
                          </div>
                          <button onClick={handleRatingSubmit}>Rate</button>
                      </div>
                  )}
              </div>
          </div>
      </div></>
  )
}

export default ProfileEntre
