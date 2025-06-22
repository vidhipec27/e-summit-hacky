import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../../helper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/storetoken";

const CompleteEntreRegister = () => {
  const [formData, setFormData] = useState({
    number: "",
    needFunding: false,
    startupStage: "",
    teamSize: "",
    experience: "",
    videopath: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (name === "needFunding") {
      setFormData({
        ...formData,
        [name]: value === "yes",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const navigate = useNavigate();
  const { getTokenFromLS } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.number || !formData.startupStage || !formData.teamSize || !formData.experience) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("number", formData.number);
    data.append("needFunding", formData.needFunding);
    data.append("startupStage", formData.startupStage);
    data.append("teamSize", formData.teamSize);
    data.append("experience", formData.experience);

    if (formData.videopath) {
      data.append("videopath", formData.videopath);
    }

    try {
      const token = getTokenFromLS();
      const response = await axios.post(`${BASE_URL}/auth/entre/register2`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log(response.data);
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/Home/entrepreneur");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration completion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Complete Registration</h2>
        <p className="form-subtitle">Please provide additional details to complete your entrepreneur profile</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Registration completed successfully! Redirecting...</p>}

        <label>Phone Number</label>
        <input 
          type="tel" 
          name="number" 
          placeholder="Enter your phone number" 
          value={formData.number} 
          onChange={handleChange} 
        />

        <label>Do you need funding?</label>
        <select name="needFunding" value={formData.needFunding ? "yes" : "no"} onChange={handleChange}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        <label>Startup Stage</label>
        <select name="startupStage" value={formData.startupStage} onChange={handleChange}>
          <option value="">Select startup stage</option>
          <option value="0">Idea Stage</option>
          <option value="1">MVP Development</option>
          <option value="2">Early Traction</option>
          <option value="3">Growth Stage</option>
          <option value="4">Scale Up</option>
        </select>

        <label>Team Size</label>
        <select name="teamSize" value={formData.teamSize} onChange={handleChange}>
          <option value="">Select team size</option>
          <option value="1">1 person</option>
          <option value="2">2-5 people</option>
          <option value="3">6-10 people</option>
          <option value="4">11-25 people</option>
          <option value="5">25+ people</option>
        </select>

        <label>Experience Level</label>
        <select name="experience" value={formData.experience} onChange={handleChange}>
          <option value="">Select experience level</option>
          <option value="0">Beginner (0-2 years)</option>
          <option value="1">Intermediate (3-5 years)</option>
          <option value="2">Advanced (6-10 years)</option>
          <option value="3">Expert (10+ years)</option>
        </select>

        <label>Pitch Video (Optional)</label>
        <input 
          type="file" 
          name="videopath" 
          accept="video/*" 
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Completing..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
};

export default CompleteEntreRegister; 