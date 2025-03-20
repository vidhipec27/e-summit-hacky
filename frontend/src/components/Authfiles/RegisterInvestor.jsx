// import { useState } from "react";
// import axios from "axios";
// import "./Auth.css";
// import { BASE_URL } from "../../helper";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useAuth } from "../../store/storetoken";
// // import Login from "./Login";
// const RegisterIn = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     emailid: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const navigate = useNavigate();
//   const { storeTokeninLS } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.username || !formData.emailid || !formData.password) {
//       setError("All fields are required!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${BASE_URL}/auth/register`, formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       console.log(response.data);
//       if (response.data.success) {
//         // alert("Registration successful! Please log in.");
//         storeTokeninLS(response.data.token);
//         navigate("/Home");
//       } else {
//         alert("Registration failed! Try again");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Register</h2>

//         {error && <p className="error-message">{error}</p>}

//         <label>Username</label>
//         <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />

//         <label>Email</label>
//         <input type="email" name="emailid" placeholder="Enter your email" value={formData.emailid} onChange={handleChange} />
//         <label>Password</label>
//         <div className="password-container">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Enter your password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>        
        
//         <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>

//         <p className="redirect-text">
//           Already have an account? <span onClick={() => navigate("/login")}>Login</span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default RegisterIn;


import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../../helper";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../store/storetoken";

const RegisterIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
    willFund: false, // Default selection
    number: "",
    domain: "",
    experience: "",
    expertise: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.emailid || !formData.number||!formData.password || !formData.domain || !formData.experience || !formData.expertise||formData.willFund) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/investor/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.data);
      if (response.data.success) {
        storeTokeninLS(response.data.token);
        navigate("/Home");
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

        <label>Willing to Fund?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="willingToFund"
              value="yes"
              checked={formData.willFund === 1}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="willingToFund"
              value="no"
              checked={formData.willFund=== 0}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        <label>Domain</label>
        <select name="businessType" value={formData.domain} onChange={handleChange}>
          <option value="">Select Domain</option>
          <option value="Manufacturing & Production">Manufacturing & Production</option>
          <option value="Retail & E-commerce">Retail & E-commerce</option>
          <option value="Service-Based Industry">Service-Based Industry</option>
          <option value="Technology & IT">Technology & IT</option>
          <option value="Social & Environmental Entrepreneurship">Social & Environmental Entrepreneurship</option>
          <option value="Financial & Investment Services">Financial & Investment Services</option>
        </select>

        <label>Phone Number</label>
        <input type="tel" name="number" placeholder="Enter your phone number" value={formData.number} onChange={handleChange} />
        
        <label>Experience (in years)</label>
        <input type="number" name="experience" placeholder="Enter experience in years" value={formData.experience} onChange={handleChange} />

        <label>Expertise Field</label>
        <input type="text" name="expertise" placeholder="Enter your expertise field" value={formData.expertise} onChange={handleChange} />

        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>

        <p className="redirect-text">
          Already have an account? <span onClick={() => navigate("/login/mentor")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterIn;
