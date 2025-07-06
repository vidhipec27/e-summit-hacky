import { useEffect, useState } from "react"
import { FaUser, FaEnvelope, FaPhone, FaDollarSign, FaRocket, FaUsers, FaClock, FaSave, FaTimes, FaEdit } from "react-icons/fa"
import { BASE_URL } from "../helper"
import { jwtDecode } from "jwt-decode"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import "./EditProfile.css"

const EditProfileEntre = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const jwtToken = localStorage.getItem("token")
  const token = jwtDecode(jwtToken)
  const navigate = useNavigate()

  const startupStages = {
    0: "Idea Stage",
    1: "MVP Development", 
    2: "Early Traction",
    3: "Growth Stage",
    4: "Scale Up"
  }

  const teamSizes = {
    1: "1 person",
    2: "2-5 people", 
    3: "6-10 people",
    4: "11-25 people",
    5: "25+ people"
  }

  const experienceLevels = {
    0: "Beginner (0-2 years)",
    1: "Intermediate (3-5 years)",
    2: "Advanced (6-10 years)", 
    3: "Expert (10+ years)"
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/entre/profile`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        })

        const data = await response.json()
        if (response.ok) {
          setUserProfile(data.user)
          setEditForm({
            username: data.user.username || "",
            number: data.user.number || "",
            needFunding: data.user.needFunding || false,
            startupStage: data.user.startupStage || 0,
            teamSize: data.user.teamSize || 1,
            experience: data.user.experience || 0
          })
        } else {
          setError("Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [jwtToken])

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError("")
      
      const response = await fetch(`${BASE_URL}/auth/entre/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()
      if (response.ok) {
        setUserProfile(data.user)
        setIsEditing(false)
        // alert("Profile updated successfully!")
      } else {
        setError(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: userProfile.username || "",
      number: userProfile.number || "",
      needFunding: userProfile.needFunding || false,
      startupStage: userProfile.startupStage || 0,
      teamSize: userProfile.teamSize || 1,
      experience: userProfile.experience || 0
    })
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  if (loading) {
    return (
      <div className="edit-profile-container">
        <Navbar />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="edit-profile-container">
        <Navbar />
        <div className="error-state">
          <p className="error-text">{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-profile-container">
      <Navbar />
      
      <div className="edit-profile-content">
        <div className="edit-profile-card">
          <div className="edit-profile-header">
            <h1 className="edit-profile-title">Profile</h1>
            <p className="edit-profile-subtitle">Entrepreneur Profile</p>
            {!isEditing && (
              <button 
                className="edit-profile-button"
                onClick={handleStartEdit}
              >
                <FaEdit size={14} />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Form
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaUser size={12} />
                  </span>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaEnvelope size={12} />
                  </span>
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile?.emailid || ""}
                  className="form-input disabled"
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaPhone size={12} />
                  </span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="number"
                  value={editForm.number}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaDollarSign size={12} />
                  </span>
                  Funding Status
                </label>
                <select
                  name="needFunding"
                  value={editForm.needFunding ? "true" : "false"}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="false">Not Seeking Funding</option>
                  <option value="true">Seeking Investment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaRocket size={12} />
                  </span>
                  Startup Stage
                </label>
                <select
                  name="startupStage"
                  value={editForm.startupStage}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="0">Idea Stage</option>
                  <option value="1">MVP Development</option>
                  <option value="2">Early Traction</option>
                  <option value="3">Growth Stage</option>
                  <option value="4">Scale Up</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaUsers size={12} />
                  </span>
                  Team Size
                </label>
                <select
                  name="teamSize"
                  value={editForm.teamSize}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="1">1 person</option>
                  <option value="2">2-5 people</option>
                  <option value="3">6-10 people</option>
                  <option value="4">11-25 people</option>
                  <option value="5">25+ people</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaClock size={12} />
                  </span>
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={editForm.experience}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="0">Beginner (0-2 years)</option>
                  <option value="1">Intermediate (3-5 years)</option>
                  <option value="2">Advanced (6-10 years)</option>
                  <option value="3">Expert (10+ years)</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  className="cancel-button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <FaTimes size={14} />
                  Cancel
                </button>
                <button 
                  className="save-button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  <FaSave size={14} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="profile-view">
              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaUser size={12} />
                  </span>
                  Username
                </label>
                <p className="profile-info-value">{userProfile?.username || "Not available"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaEnvelope size={12} />
                  </span>
                  Email
                </label>
                <p className="profile-info-value">{userProfile?.emailid || "Not available"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaPhone size={12} />
                  </span>
                  Phone Number
                </label>
                <p className="profile-info-value">{userProfile?.number || "Not available"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaDollarSign size={12} />
                  </span>
                  Funding Status
                </label>
                <div className="profile-info-value">
                  <span>{userProfile?.needFunding ? "Seeking Investment" : "Not Seeking Funding"}</span>
                  <span className={`status-badge ${userProfile?.needFunding ? "status-active" : "status-inactive"}`}>
                    {userProfile?.needFunding ? "OPEN" : "CLOSED"}
                  </span>
                </div>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaRocket size={12} />
                  </span>
                  Startup Stage
                </label>
                <p className="profile-info-value">{startupStages[userProfile?.startupStage] || "Not specified"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaUsers size={12} />
                  </span>
                  Team Size
                </label>
                <p className="profile-info-value">{teamSizes[userProfile?.teamSize] || "Not specified"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaClock size={12} />
                  </span>
                  Experience Level
                </label>
                <p className="profile-info-value">{experienceLevels[userProfile?.experience] || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfileEntre 