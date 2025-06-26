import React, { useEffect, useState } from "react";
//import { useParams } from "react-router-dom"; // to get the :id from URL
import { getFromBackend,postToBackend } from "../store/fetchdata";
import { BASE_URL } from "../helper";
import {jwtDecode} from "jwt-decode";
import "./FeedbackPage.css"
const Feedback = () => {
  //const { id } = useParams(); // e.g., /feedback/123 → id = 123
  const [entre, setEntre] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [file, setfile] = useState(null);
const [uploading, setUploading] = useState(false);


  const jwtToken=localStorage.getItem("token");
    const token=jwtDecode(jwtToken);
    console.log(token);
    const emailid=token.emailid;
  
   const fetchEntre = async () => {
  try {
    const res = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`);
    setEntre(res.data.result);
  } catch (err) {
    console.error("Failed to fetch entrepreneur:", err);
  }
};

useEffect(() => {
  fetchEntre();
}, [emailid]);

  console.log("what is entre? in feedback frontend",entre);
  console.log("transcript?",entre?.[0]?.transcript);

  const handleVideoUpload = async () => {
  if (!file) return alert("Please select a video first.");

  const formData = new FormData();
  formData.append("videopath", file); // Key must match multer's `.single("videopath")`
  formData.append("emailid", emailid);
  // formData.append("number", entre?.[0]?.number);
  // formData.append("needFunding", entre?.[0]?.needFunding);
  // formData.append("startupStage", entre?.[0]?.startupStage);
  // formData.append("teamSize", entre?.[0]?.teamSize);
  // formData.append("experience", entre?.[0]?.experience);
            
  try {
    setUploading(true);
    const res = await fetch(`${BASE_URL}/auth/entre/uploadVideo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`, // if protected route
        // Do not set Content-Type! Browser handles boundary automatically
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Video uploaded successfully!");
      setfile(null);
      await fetchEntre(); // call the same function you used in useEffect
; // update locally
    } else {
      console.error("Upload failed:", data);
      alert("Upload failed.");
    }
  } catch (err) {
    console.log("Upload error:", err.message);
    // alert("Something went wrong while uploading.");
  } finally {
    setUploading(false);
  }
};

  const Feedback = async () => {
    //const entre=fetchEntre();
    if (!entre[0]?.transcript) return alert("Transcript missing");

    setLoading(true);
    setFeedback("");

     try {
      const res = await postToBackend(
        `${BASE_URL}/feedback/getFeedbackOnTranscript`,
        {
          messages: [
            {
              role: "user",
              content: `Analyze the following startup pitch transcript and provide exactly 3 bullet points, at least 2 lines each:

- Key Strength  
- Major Weakness  
- One Actionable Suggestion

Avoid introductions or phrases like "as requested" or "here's your feedback". Just provide the three points directly.:\n\n${entre[0].transcript}`
            }
          ]
        }
      );
      //const data=await res.json();
      //console.log(data);
      //console.log("res?", res);
      setFeedback(res.data.response || "No feedback returned.");
    } catch (err) {
      console.error("Error:", err);
      setFeedback("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!entre) return <div className="feedback-container"><div className="loading-message">Loading entrepreneur...</div></div>;

 return (
  <div className="feedback-container">
    <div className="feedback-content">
      <h2 className="feedback-title">Pitch Feedback</h2>

      {/* ✅ Transcript Toggle as Button */}
      <div className="feedback-button-container" style={{ marginBottom: '1.5rem' }}>
        <button
          className="feedback-button"
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
        >
          {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
        </button>
      </div>

      {/* ✅ Conditionally show transcript */}
      {showTranscript && (
        <div className="transcript-box">
          <h4>Transcript:</h4>
          <p>{entre[0].transcript || "No transcript found."}</p>
        </div>
      )}

      {/* ✅ Video player */}
      {entre[0]?.videopath ? (
        <div className="video-box">
          <h4>Pitch Video:</h4>
          <video width="640" height="360" controls>
            <source src={entre[0].videopath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p>No pitch video available.</p>
      )}

      {/* ✅ Upload or Replace Video */}
      <div className="upload-section">
        <h4>{entre[0]?.videopath ? "Replace Video:" : "Upload Your Pitch Video:"}</h4>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setfile(e.target.files[0])}
          style={{ marginBottom: "0.5rem" }}
        />
        <button
          onClick={handleVideoUpload}
          className="feedback-button"
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : entre[0]?.videopath ? "Replace Video" : "Upload Video"}
        </button>
      </div>

      {/* ✅ Submit Feedback */}
      <div className="feedback-button-container">
        <button
          onClick={Feedback}
          disabled={loading || !entre?.[0]?.transcript}
          className="feedback-button"
        >
          {loading ? "Getting Feedback..." : "Submit for Feedback"}
        </button>
      </div>

      {/* ✅ Show feedback result */}
      {feedback && (
        <div className="feedback-result">
          <h3>AI Feedback:</h3>
          <p>{feedback.replace(/\*\*/g, '').replace(/\*/g, '')}</p>
        </div>
      )}
    </div>
  </div>
);

}
export default Feedback;
