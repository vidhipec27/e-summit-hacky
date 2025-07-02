import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const getUserDetails = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { email: decoded.emailid, role: decoded.role };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const user = getUserDetails();
  const userRole = user?.role;

  return (
    <nav className="navbar">

      <div className="logo" onClick={() => userRole == "investor" ? navigate("/Home/investor") : navigate("/Home/entrepreneur")}>Entre-Connect</div>

      <div className="nav-links">
        {/* <button onClick={() => navigate("/")}>Home</button> */}
        <button onClick={() => navigate("/about")}>About Us</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
        <button onClick={() => navigate("/chatpage")}>Chats</button>
      </div>

      <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
    </nav>
  );
};

export default Navbar;
