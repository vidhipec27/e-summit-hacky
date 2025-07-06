import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar = () => {
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

  const handleProfileClick = () => {
    if (userRole === "investor") {
      navigate("/edit-profile/investor");
    } else if (userRole === "entre") {
      navigate("/edit-profile/entrepreneur");
    } else {
      //Fallback to entrepreneur profile if role is not clear
      navigate("/edit-profile/entrepreneur");
    }
  };

  return (
    <nav className="navbar">

      <div className="logo" onClick={handleHomeClick}>Entre-Connect</div>

      <div className="nav-links">
        <button onClick={() => navigate("/about")}>About Us</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
        <button onClick={() => navigate("/chatpage")}>Chats</button>
        <button onClick={handleProfileClick}>Profile</button>
      </div>

      <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
    </nav>
  );
};

export default Navbar;
