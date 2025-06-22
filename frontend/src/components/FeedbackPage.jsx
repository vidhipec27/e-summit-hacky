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
  const jwtToken=localStorage.getItem("token");
    const token=jwtDecode(jwtToken);
    console.log(token);
    const emailid=token.emailid;
  
    useEffect(() => {
    const fetchEntre = async () => {
      try {
        const res = await getFromBackend(`${BASE_URL}/search/entre/details/${emailid}`);
        //const data = await res.json();
        setEntre(res.data.result);
      } catch (err) {
        console.error("Failed to fetch entrepreneur:", err);
      }
    };
    fetchEntre();
  }, [emailid]);
  console.log("what is entre? in feedback frontend",entre);
  console.log("transcript?",entre?.[0]?.transcript);
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
              content: `Please give feedback on this startup pitch. Limit your response to 3 main points only, covering:
            1. Key Strength
            2. Major Weakness
            3. One Actionable Suggestion:\n\n${entre[0].transcript}`
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

        <div className="transcript-box">
          <h4>Transcript:</h4>
          <p>{entre[0].transcript}</p>
        </div>

        <div className="feedback-button-container">
          <button
            onClick={Feedback}
            disabled={loading || !entre?.[0]?.transcript}
            className="feedback-button"
          >
            {loading ? "Getting Feedback..." : "Submit for Feedback"}
          </button>
        </div>

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
