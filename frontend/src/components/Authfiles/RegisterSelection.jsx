import { useNavigate } from "react-router-dom";
import "./Auth.css";

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h2>Welcome!</h2>
      <p>Choose your role to continue</p>

      <div className="role-selection">
        <button className="role-button" onClick={() => navigate("/register/entrepreneur")}>
          Register as Entrepreneur
        </button>
        <button className="role-button" onClick={() => navigate("/register/mentor")}>
          Register as Investor / Mentor
        </button>
      </div>
    </div>
  );
};

export default RegisterSelection;
