import { useNavigate } from "react-router-dom";
import "./RegisterSelection.css";

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="logo-section">
          <div className="logo-circle">
            <span className="logo-icon">🚀</span>
          </div>
        </div>
        
        <div className="content-section">
          <h1 className="welcome-title">Welcome to EntreConnect</h1>
          <p className="welcome-subtitle">Join our thriving community of innovators and visionaries</p>
          <p className="selection-text">Choose your role to begin your journey</p>
        </div>

        <div className="role-selection">
          <div className="role-card" onClick={() => navigate("/register/entrepreneur")}>
            <div className="role-icon">💡</div>
            <div className="role-content">
              <h3>Entrepreneur</h3>
              <p>Build, innovate, and grow your startup</p>
            </div>
            <div className="role-arrow">→</div>
          </div>
          
          <div className="role-card" onClick={() => navigate("/register/mentor")}>
            <div className="role-icon">🎯</div>
            <div className="role-content">
              <h3>Investor / Mentor</h3>
              <p>Guide and invest in the next big ideas</p>
            </div>
            <div className="role-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;

