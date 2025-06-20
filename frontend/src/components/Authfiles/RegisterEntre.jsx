import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../../helper";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../store/storetoken";

const RegisterE = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
    number: "",
    needFunding: false,
    startupStage:null,
    teamSize: null,
    experience:null, // Default selection
    videopath:null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "needFunding" ? (value === "yes") : value,
    });
  };

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.emailid || !formData.password || !formData.number||formData.startupStage === null || 
  formData.teamSize === null || 
  formData.experience === null) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");
    
    const data = new FormData();
    data.append("username", formData.username);
    data.append("emailid", formData.emailid);
    data.append("password", formData.password);
    data.append("number", formData.number);
    data.append("needFunding", formData.needFunding); // Boolean is OK
    data.append("startupStage", formData.startupStage);
    data.append("teamSize", formData.teamSize);
    data.append("experience", formData.experience);

    if (formData.videopath) {
      data.append("videopath", formData.videopath); // This will send the video file
    }

    try {
      // const response = await axios.post(`${BASE_URL}/auth/entre/register`, formData, {
      //   headers: { "Content-Type": "application/json" },
      // });
      const response = await axios.post(`${BASE_URL}/auth/entre/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      if (response.data.success) {
        storeTokeninLS(response.data.token);
        navigate("/Home/entrepreneur");
      } else {
        alert("Registration failed! Try again");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error-message">{error}</p>}

        <label>Username</label>
        <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="emailid" placeholder="Enter your email" value={formData.emailid} onChange={handleChange} />

        <label>Phone Number</label>
        <input type="tel" name="number" placeholder="Enter your phone number" value={formData.number} onChange={handleChange} />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Looking for Funding?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="needFunding"
              value="yes"
              checked={formData.needFunding === true}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="needFunding"
              value="no"
              checked={formData.needFunding === false}
              onChange={handleChange}
            />
            No
          </label>
        </div>
        
        <label>Startup Stage</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="startupStage"
              value={0}
              checked={formData.startupStage === 0}
              onChange={(e) =>
        setFormData({ ...formData, startupStage: parseInt(e.target.value) })
      }
            />
            Idea
          </label>
          <label>
            <input
              type="radio"
              name="startupStage"
              value={1}
              checked={formData.startupStage === 1}
              onChange={(e) =>
        setFormData({ ...formData, startupStage: parseInt(e.target.value) })
      }
            />
            MVP
          </label>
          <label>
            <input
              type="radio"
              name="startupStage"
              value={2}
              checked={formData.startupStage === 2}
              onChange={(e) =>
        setFormData({ ...formData, startupStage: parseInt(e.target.value) })
      }
            />
            Launched
          </label>
          <label>
            <input
              type="radio"
              name="startupStage"
              value={3}
              checked={formData.startupStage === 3}
              onChange={(e) =>
        setFormData({ ...formData, startupStage: parseInt(e.target.value) })
      }
            />
            Revenue Generating
          </label>
        </div>

        <label>Team size-how many active members?</label>
<div className="radio-group">
  {[
    { label: "<10", value: 0 },
    { label: "10-25", value: 1 },
    { label: "25-50", value: 2 },
    { label: "50-100", value: 3 },
    { label: "100+", value: 4},
  ].map(({ label, value }) => (
    <label key={value}>
      <input
        type="radio"
        name="teamSize"
        value={value}
        checked={formData.teamSize === value}
        onChange={(e) =>
          setFormData({
            ...formData,
            teamSize: parseInt(e.target.value),
          })
        }
      />
      {label}
    </label>
  ))}
</div>

<label>Experience (in  months)</label>
<div className="radio-group">
  {[
    { label: "<3", value: 0 },
    { label: "3-6", value: 1 },
    { label: "6-12", value: 2 },
    { label: "12+", value: 3 },
  ].map(({ label, value }) => (
    <label key={value}>
      <input
        type="radio"
        name="experience"
        value={value}
        checked={formData.experience === value}
        onChange={(e) =>
          setFormData({
            ...formData,
            experience: parseInt(e.target.value),
          })
        }
      />
      {label}
    </label>
  ))}
</div>

<label>Upload your pitch video</label>
<input
  type="file"
  name="videopath"
  accept="video/*"
  onChange={(e) =>
    setFormData({ ...formData, videopath: e.target.files[0] })
  }
/>

        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>

        <p className="redirect-text">
          Already have an account? <span onClick={() => navigate("/login/entrepreneur")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterE;
