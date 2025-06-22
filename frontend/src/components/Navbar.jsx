
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Home button redirects to Home.jsx */}
      <div className="logo" onClick={() => navigate("/")}>Entre-Connect</div>

      <div className="nav-links">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About Us</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
        <button onClick={() => navigate("/chatpage")}>Chats</button>
        <button onClick={() => navigate("/feedback")}>Improve Pitch</button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
