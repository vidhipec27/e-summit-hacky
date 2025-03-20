
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Home button redirects to Home.jsx */}
      <div className="logo" onClick={() => navigate("/")}>MyApp</div>

      <div className="nav-links">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About Us</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
