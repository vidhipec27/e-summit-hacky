import { useNavigate } from "react-router-dom";
import "./RegisterSelection.css";

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Welcome!</h2>
        <p className="selection-text">Choose your role to continue</p>

        <div className="role-selection">
          <button className="role-button" onClick={() => navigate("/register/entrepreneur")}>
            Register as Entrepreneur
          </button>
          <button className="role-button" onClick={() => navigate("/register/mentor")}>
            Register as Investor / Mentor
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;

