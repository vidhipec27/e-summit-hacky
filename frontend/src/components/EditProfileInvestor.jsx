import { useEffect, useState } from "react"
import { FaUser, FaEnvelope, FaPhone, FaDollarSign, FaBriefcase, FaGraduationCap, FaSave, FaTimes, FaEdit } from "react-icons/fa"
import { BASE_URL } from "../helper"
import { jwtDecode } from "jwt-decode"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import "./EditProfile.css"

const EditProfileInvestor = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const jwtToken = localStorage.getItem("token")
  const token = jwtDecode(jwtToken)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/investor/profile`, {
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
            willFund: data.user.willFund || false,
            domain: data.user.domain || "",
            experience: data.user.experience || "",
            expertise: data.user.expertise || ""
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
      
      const response = await fetch(`${BASE_URL}/auth/investor/profile`, {
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
      willFund: userProfile.willFund || false,
      domain: userProfile.domain || "",
      experience: userProfile.experience || "",
      expertise: userProfile.expertise || ""
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
            <p className="edit-profile-subtitle">Investor Profile</p>
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
                  Willing to Fund
                </label>
                <select
                  name="willFund"
                  value={editForm.willFund ? "true" : "false"}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="false">Not Currently Investing</option>
                  <option value="true">Actively Investing</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaBriefcase size={12} />
                  </span>
                  Investment Domain
                </label>
                <input
                  type="text"
                  name="domain"
                  value={editForm.domain}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaGraduationCap size={12} />
                  </span>
                  Investment Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={editForm.experience}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="e.g., 5+ years in venture capital"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="info-icon">
                    <FaUser size={12} />
                  </span>
                  Areas of Expertise
                </label>
                <textarea
                  name="expertise"
                  value={editForm.expertise}
                  onChange={handleEditChange}
                  className="form-textarea"
                  placeholder="Describe your areas of expertise and investment focus"
                  rows="3"
                />
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
                  Investment Status
                </label>
                <div className="profile-info-value">
                  <span>{userProfile?.willFund ? "Actively Investing" : "Not Currently Investing"}</span>
                  <span className={`status-badge ${userProfile?.willFund ? "status-active" : "status-inactive"}`}>
                    {userProfile?.willFund ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaBriefcase size={12} />
                  </span>
                  Investment Domain
                </label>
                <p className="profile-info-value">{userProfile?.domain || "Not specified"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaGraduationCap size={12} />
                  </span>
                  Investment Experience
                </label>
                <p className="profile-info-value">{userProfile?.experience || "Not specified"}</p>
              </div>

              <div className="profile-info-group">
                <label className="profile-info-label">
                  <span className="info-icon">
                    <FaUser size={12} />
                  </span>
                  Areas of Expertise
                </label>
                <p className="profile-info-value">{userProfile?.expertise || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfileInvestor