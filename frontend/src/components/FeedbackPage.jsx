"use client"

import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import { getFromBackend, postToBackend } from "../store/fetchdata"
import { BASE_URL } from "../helper"
import { jwtDecode } from "jwt-decode"
import "./FeedbackPage.css"

const Feedback = () => {
  const [entre, setEntre] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [file, setfile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const jwtToken = localStorage.getItem("token")
  const token = jwtDecode(jwtToken)
  const emailid = token.emailid
  const [videoVersion, setVideoVersion] = useState(0)

  const fetchEntre = async () => {
    try {
      const res = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`)
      setEntre(res.data.result)
    } catch (err) {
      console.error("Failed to fetch entrepreneur:", err)
    }
  }

  useEffect(() => {
    fetchEntre()
  }, [emailid])

  const handleVideoUpload = async () => {
    if (!file) return alert("Please select a video first.")

    const formData = new FormData()
    formData.append("videopath", file)
    formData.append("emailid", emailid)

    try {
      setUploading(true)
      const res = await fetch(`${BASE_URL}/auth/entre/uploadVideo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      })

      if (res.ok) {
        setfile(null)
        await fetchEntre()
        setVideoVersion(prev => prev + 1)
      } else {
        console.error("Upload failed:", data)
        alert("Upload failed.")
      }

      window.location.reload();
      console.log("reloaded!");
    } catch (err) {
      console.log("Upload error:", err.message)
    } finally {
      setUploading(false)
    }
  }

  const getFeedback = async () => {
    if (!entre[0]?.transcript) return alert("Transcript missing")

    setLoading(true)
    setFeedback("")

    try {
      const res = await postToBackend(`${BASE_URL}/feedback/getFeedbackOnTranscript`, {
        messages: [
          {
            role: "user",
            content: `Analyze the following startup pitch transcript and provide exactly 3 bullet points, at least 2 lines each:

- Key Strength  
- Major Weakness  
- One Actionable Suggestion

Avoid introductions or phrases like "as requested" or "here's your feedback". Just provide the three points directly.:\n\n${entre[0].transcript}`,
          },
        ],
      })

      setFeedback(res.data.response || "No feedback returned.")
    } catch (err) {
      console.error("Error:", err)
      setFeedback("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (!entre)
    return (
      <div className="feedback-container">
        <Navbar />
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-message">Loading entrepreneur data...</div>
        </div>
      </div>
    )

  return (
    <div className="feedback-container">
      <Navbar />

      <div className="feedback-content">
        <div className="feedback-header">
          <h1 className="feedback-title">
            Pitch Feedback Analysis
          </h1>
          <p className="feedback-subtitle">Get AI-powered insights on your startup pitch</p>
        </div>

        {/* Transcript Section */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">
              Pitch Transcript
            </h3>
            <button className="toggle-button" onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? (
                <>
                  <span>Hide Transcript</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show Transcript</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {showTranscript && (
            <div className="transcript-content">
              <div className="transcript-text">{entre[0].transcript || "No transcript found."}</div>
            </div>
          )}
        </div>

        {/* Video Section */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">
              Pitch Video
            </h3>
          </div>

          {entre[0]?.videopath ? (
            <div className="video-container">
              <video key={`${entre[0].videopath}-${videoVersion}`} controls className="pitch-video">
                <source src={entre[0].videopath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="no-video-placeholder">
              <div className="placeholder-icon">🎬</div>
              <p>No pitch video available</p>
              <span>Upload your video below to get started</span>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">
              {entre[0]?.videopath ? "Replace Video" : "Upload Pitch Video"}
            </h3>
          </div>

          <div className="upload-area">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setfile(e.target.files[0])}
                className="file-input"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="file-input-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{file ? file.name : "Choose video file"}</span>
              </label>
            </div>

            <button
              onClick={handleVideoUpload}
              className={`upload-button ${uploading || !file ? "disabled" : ""}`}
              disabled={uploading || !file}
            >
              {uploading ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{entre[0]?.videopath ? "Replace Video" : "Upload Video"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">
              AI Feedback Analysis
            </h3>
          </div>

          <div className="feedback-actions">
            <button
              onClick={getFeedback}
              disabled={loading || !entre?.[0]?.transcript}
              className={`feedback-button ${loading || !entre?.[0]?.transcript ? "disabled" : ""}`}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                    <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                  </svg>
                  <span>Get AI Feedback</span>
                </>
              )}
            </button>
          </div>

          {feedback && (
            <div className="feedback-result">
              <div className="feedback-header-result">
                <h4>
                  Analysis Results
                </h4>
              </div>
              <div className="feedback-content-result">
                <pre>{feedback.replace(/\*\*/g, "").replace(/\*/g, "")}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback
