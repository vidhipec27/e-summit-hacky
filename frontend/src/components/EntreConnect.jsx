// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import './EntreConnect.css';
// import entrepreneurImg from '../assets/entrepreneur.png';

// import Navbar from './Navbar';

// const EntreConnect = () => {
//   const [name, setName] = useState('');
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const openGoogleForm = () => {
//     window.open('https://forms.gle/hTUcxa3W8C5ztEQQ6', '_blank');
//   };

//   const handleNameChange = (e) => {
//     setName(e.target.value);
//   };

//   const generateMatches = async () => {
//     if (!name.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Email',
//         text: 'Please enter your Email!',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:8080/find_matches', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ user_id: name }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMatches(data);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: data.error || 'No matches found.',
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Network Error',
//         text: 'Failed to fetch matches. Please try again later.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="entreconnect-container">
//       <Navbar></Navbar>
//       <header className="entreconnect-header">
//         <img src={entrepreneurImg} alt="Entrepreneur working" className="entreconnect-img" />
//         <h1>EntreConnect</h1>
//         <p>Find like-minded entrepreneurs and connect with them!</p>
//         <button className="cta-btn" onClick={openGoogleForm}>
//           Fill Out The Entrepreneur Form And Get Started
//         </button>
//       </header>
//       <div className="entreconnect-input-section">
//         <input
//           type="text"
//           placeholder="Enter your Email"
//           value={name}
//           onChange={handleNameChange}
//           disabled={loading}
//           className="entreconnect-input"
//         />
//         <button className="entreconnect-btn" onClick={generateMatches} disabled={loading}>
//           {loading ? 'Finding Matches...' : 'Find Matches'}
//         </button>
//       </div>
//       {matches.length > 0 && (
//         <section className="entreconnect-matches">
//           <h2>Your Top Matches</h2>
//           <div className="entreconnect-matches-list">
//             {matches.map((match, idx) => (
//               <div key={idx} className="entreconnect-match-card">
//                 <h3>{match.Name}</h3>
//                 <p>Email: {match.Email}</p>
//                 <p>Experience: {match["How many years of experience do you have in entrepreneurship?"]} years</p>
//                 <p>Business Stage: {match["What stage is your current business in?"]}</p>
//                 <p>Risk Tolerance: {match["How risk-tolerant are you in business decisions? (Scale of 1-5)"]}</p>
//                 <p>Funding Experience: {match["Do you have experience in securing funding?"]}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// };

// export default EntreConnect;

//works fine:
// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   Grid,
//   CircularProgress,
//   InputAdornment
// } from "@mui/material";
// import { FiMail, FiUser, FiCheckCircle, FiExternalLink, FiSearch } from "react-icons/fi";
// import { ToastContainer, toast } from "react-toastify";
// import { MdWorkOutline, MdOutlineFlag, MdOutlineAttachMoney } from "react-icons/md";
// import "react-toastify/dist/ReactToastify.css";
// import "./EntreConnect.css";
// import entrepreneurImg from "../assets/entrepreneur.png";
// import Navbar from "./Navbar";

// const EntreConnect = () => {
//   const [email, setEmail] = useState("");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const openGoogleForm = () => {
//     window.open("https://forms.gle/hTUcxa3W8C5ztEQQ6", "_blank");
//   };

//   function validateEmail(val) {
//     return /\S+@\S+\.\S+/.test(val);
//   }

//   const handleEmailChange = (e) => setEmail(e.target.value);

//   const generateMatches = async () => {
//     if (!validateEmail(email)) {
//       toast.warn("Please enter a valid email address!", { position: "bottom-center" });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:8080/find_matches", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: email }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMatches(data);
//         if (data.length === 0) {
//           toast.info("No matches found. Try another email?", { position: "bottom-center" });
//         } else {
//           toast.success("Matches found!", { position: "bottom-center" });
//         }
//       } else {
//         toast.error(data.error || "No matches found.", { position: "bottom-center" });
//       }
//     } catch (error) {
//       toast.error("Failed to fetch matches. Please try again later.", { position: "bottom-center" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box className="entreconnect-bg">
//       <ToastContainer />
//       <Navbar />
//       <Box className="modern-container" sx={{ minHeight: "100vh", pb: 6 }}>
//         <Card className="glass-header-card" elevation={9}>
//           <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <Avatar
//               src={entrepreneurImg}
//               alt="Entrepreneur"
//               sx={{
//                 width: 96,
//                 height: 96,
//                 mb: 2,
//                 boxShadow: 4,
//                 bgcolor: "white",
//                 border: "3px solid #2563eb",
//               }}
//             />
//             <Typography variant="h3" component="h1" fontWeight={900} color="#2563eb" gutterBottom>
//               EntreConnect
//             </Typography>
//             <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2 }}>
//               Find like-minded entrepreneurs and connect with them!
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               endIcon={<FiExternalLink />}
//               sx={{
//                 background: "#232946",
//                 color: "#fff",
//                 fontWeight: 700,
//                 borderRadius: 2,
//                 px: 3,
//                 py: 1.4,
//                 letterSpacing: 1,
//                 textTransform: "none",
//                 boxShadow: 3,
//                 mt: 1,
//                 "&:hover": { background: "#2563eb" },
//               }}
//               onClick={openGoogleForm}
//             >
//               Fill Out The Entrepreneur Form And Get Started
//             </Button>
//           </CardContent>
//         </Card>
//         <Card className="glass-card" elevation={6} sx={{ mt: 4, mb: 3 }}>
//           <CardContent>
//             <Box
//               component="form"
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 gap: 2,
//                 alignItems: "center",
//               }}
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 generateMatches();
//               }}
//             >
//               <TextField
//                 label="Enter your Email"
//                 type="email"
//                 value={email}
//                 onChange={handleEmailChange}
//                 required
//                 disabled={loading}
//                 variant="outlined"
//                 sx={{
//                   flex: 1,
//                   background: "#fff",
//                   borderRadius: 2,
//                   minWidth: 200,
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FiMail color="#2563eb" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 type="submit"
//                 disabled={loading}
//                 sx={{
//                   fontWeight: 600,
//                   borderRadius: 2,
//                   px: 3,
//                   py: 1.2,
//                   textTransform: "none",
//                   letterSpacing: 1,
//                   background: "#2563eb",
//                   boxShadow: 2,
//                   "&:hover": { background: "#232946" },
//                   minWidth: 170,
//                 }}
//                 startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiSearch />}
//               >
//                 {loading ? "Finding Matches..." : "Find Matches"}
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//         {matches.length > 0 && (
//           <Box sx={{ mt: 3 }}>
//             <Typography variant="h5" component="h2" fontWeight={700} color="#2563eb" mb={2} align="center">
//               Your Top Matches
//             </Typography>
//             <Grid container spacing={3} justifyContent="center">
//               {matches.map((match, idx) => (
//                 <Grid item xs={12} sm={6} md={4} key={idx}>
//                   <Card className="glass-card match-card" elevation={7}>
//                     <CardHeader
//                       avatar={
//                         <Avatar sx={{ bgcolor: "#2563eb", width: 48, height: 48 }}>
//                           <FiUser size={24} />
//                         </Avatar>
//                       }
//                       title={
//                         <Typography fontWeight={700} color="#2563eb" variant="h6">
//                           {match.Name}
//                         </Typography>
//                       }
//                       subheader={
//                         <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <FiMail size={16} /> {match.Email}
//                         </Typography>
//                       }
//                     />
//                     <CardContent>
//                       <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
//                         <MdWorkOutline size={20} color="#232946" />
//                         <Typography color="text.secondary" variant="body2">
//                           Experience:
//                         </Typography>
//                         <Typography color="#232946" fontWeight={600}>
//                           {match["How many years of experience do you have in entrepreneurship?"]} years
//                         </Typography>
//                       </Box>
//                       <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
//                         <MdOutlineFlag size={20} color="#232946" />
//                         <Typography color="text.secondary" variant="body2">
//                           Business Stage:
//                         </Typography>
//                         <Typography color="#232946" fontWeight={600}>
//                           {match["What stage is your current business in?"]}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
//                         <FiCheckCircle size={20} color="#232946" />
//                         <Typography color="text.secondary" variant="body2">
//                           Risk Tolerance:
//                         </Typography>
//                         <Typography color="#232946" fontWeight={600}>
//                           {match["How risk-tolerant are you in business decisions? (Scale of 1-5)"]}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
//                         <MdOutlineAttachMoney size={20} color="#232946" />
//                         <Typography color="text.secondary" variant="body2">
//                           Funding Experience:
//                         </Typography>
//                         <Typography color="#232946" fontWeight={600}>
//                           {match["Do you have experience in securing funding?"]}
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default EntreConnect;

//new test:
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import { FiMail, FiUser, FiCheckCircle, FiExternalLink, FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import { MdWorkOutline, MdOutlineFlag, MdOutlineAttachMoney } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import "./EntreConnect.css";
import entrepreneurImg from "../assets/entrepreneur.png";
import Navbar from "./Navbar";

const EntreConnect = () => {
  const [email, setEmail] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const openGoogleForm = () => {
    window.open("https://forms.gle/hTUcxa3W8C5ztEQQ6", "_blank");
  };

  function validateEmail(val) {
    return /\S+@\S+\.\S+/.test(val);
  }

  const handleEmailChange = (e) => setEmail(e.target.value);

  const generateMatches = async () => {
    if (!validateEmail(email)) {
      toast.warn("Please enter a valid email address!", { position: "bottom-center" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/find_matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
        if (data.length === 0) {
          toast.info("No matches found. Try another email?", { position: "bottom-center" });
        } else {
          toast.success("Matches found!", { position: "bottom-center" });
        }
      } else {
        toast.error(data.error || "No matches found.", { position: "bottom-center" });
      }
    } catch (error) {
      toast.error("Failed to fetch matches. Please try again later.", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="entreconnect-bg">
      {/* Decorative Spheres Background */}
      <div className="sphere" />
      <div className="sphere2" />
      <div className="sphere3" />
      <div className="sphere4" />
      <ToastContainer />
      <Navbar />
      <Box className="modern-container" sx={{ minHeight: "100vh", pb: 6 }}>
        <Card className="glass-header-card" elevation={9}>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar
              src={entrepreneurImg}
              alt="Entrepreneur"
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                boxShadow: 4,
                bgcolor: "white",
                border: "3px solid #2563eb",
              }}
            />
            <Typography variant="h3" component="h1" fontWeight={900} color="#2563eb" gutterBottom>
              EntreConnect
            </Typography>
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2 }}>
              Find like-minded entrepreneurs and connect with them!
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<FiExternalLink />}
              sx={{
                background: "#232946",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.4,
                letterSpacing: 1,
                textTransform: "none",
                boxShadow: 3,
                mt: 1,
                "&:hover": { background: "#2563eb" },
              }}
              onClick={openGoogleForm}
            >
              Fill Out The Entrepreneur Form And Get Started
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-card" elevation={6} sx={{ mt: 4, mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                generateMatches();
              }}
            >
              <TextField
                label="Enter your Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
                variant="outlined"
                sx={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 2,
                  minWidth: 200,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMail color="#2563eb" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  letterSpacing: 1,
                  background: "#2563eb",
                  boxShadow: 2,
                  "&:hover": { background: "#232946" },
                  minWidth: 170,
                }}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiSearch />}
              >
                {loading ? "Finding Matches..." : "Find Matches"}
              </Button>
            </Box>
          </CardContent>
        </Card>
        {matches.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" fontWeight={700} color="#2563eb" mb={2} align="center">
              Your Top Matches
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {matches.map((match, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card className="glass-card match-card" elevation={7}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "#2563eb", width: 48, height: 48 }}>
                          <FiUser size={24} />
                        </Avatar>
                      }
                      title={
                        <Typography fontWeight={700} color="#2563eb" variant="h6">
                          {match.Name}
                        </Typography>
                      }
                      subheader={
                        <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <FiMail size={16} /> {match.Email}
                        </Typography>
                      }
                    />
                    <CardContent>
                      <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                        <MdWorkOutline size={20} color="#232946" />
                        <Typography color="text.secondary" variant="body2">
                          Experience:
                        </Typography>
                        <Typography color="#232946" fontWeight={600}>
                          {match["How many years of experience do you have in entrepreneurship?"]} years
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                        <MdOutlineFlag size={20} color="#232946" />
                        <Typography color="text.secondary" variant="body2">
                          Business Stage:
                        </Typography>
                        <Typography color="#232946" fontWeight={600}>
                          {match["What stage is your current business in?"]}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                        <FiCheckCircle size={20} color="#232946" />
                        <Typography color="text.secondary" variant="body2">
                          Risk Tolerance:
                        </Typography>
                        <Typography color="#232946" fontWeight={600}>
                          {match["How risk-tolerant are you in business decisions? (Scale of 1-5)"]}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <MdOutlineAttachMoney size={20} color="#232946" />
                        <Typography color="text.secondary" variant="body2">
                          Funding Experience:
                        </Typography>
                        <Typography color="#232946" fontWeight={600}>
                          {match["Do you have experience in securing funding?"]}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EntreConnect;