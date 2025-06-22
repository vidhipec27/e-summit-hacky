import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../../helper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/storetoken";

const CompleteInvestorRegister = () => {
  const [formData, setFormData] = useState({
    number: "",
    domain: "",
    experience: "",
    expertise: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.number || !formData.domain || !formData.experience || !formData.expertise) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/auth/investor/register2`, formData, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log(response.data);
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/Home/investor");
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
        <p className="form-subtitle">Please provide additional details to complete your investor profile</p>

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

        <label>Investment Domain</label>
        <select name="domain" value={formData.domain} onChange={handleChange}>
          <option value="">Select investment domain</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Other">Other</option>
        </select>

        <label>Experience Level</label>
        <select name="experience" value={formData.experience} onChange={handleChange}>
          <option value="">Select experience level</option>
          <option value="Beginner">Beginner (0-2 years)</option>
          <option value="Intermediate">Intermediate (3-5 years)</option>
          <option value="Advanced">Advanced (6-10 years)</option>
          <option value="Expert">Expert (10+ years)</option>
        </select>

        <label>Areas of Expertise</label>
        <textarea 
          name="expertise" 
          placeholder="Describe your areas of expertise and investment focus"
          value={formData.expertise} 
          onChange={handleChange}
          rows="4"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Completing..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
};

export default CompleteInvestorRegister;