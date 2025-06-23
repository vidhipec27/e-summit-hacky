import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { BASE_URL } from "../helper";
import { getFromBackend } from "../store/fetchdata";
import { useRegistrationCheck } from "../hooks/useRegistrationCheck";
import Navbar from "./Navbar";
import HelpButton from "./Chatbot/HelpButton";  
import HelpChat from "./Chatbot/HelpChat";  

import peerEntrepreneursImg from '../assets/peer-entre.png';
import investorsImg from '../assets/investor-connect.png';
import pitchFeedbackImg from '../assets/pitch.png';




const offers = [
  {
    img: peerEntrepreneursImg,
    alt: "Connect to Peer Entrepreneurs",
    title: "Connect to Peer Entrepreneurs",
    text: "Network with ambitious entrepreneurs, share ideas, and grow together in a thriving business community. Based on your interests, goals, and industry, our ML algorithm matches you with entrepreneurs who share your vision. Start meaningful conversations, share insights, and grow together.",
    btn: "Connect",
    onClick: "handleConnectToPeers"
  },
  {
    img: investorsImg,
    alt: "Connect to Investors",
    title: "Connect to Investors",
    text: "Find potential investors and gain expert insights to fuel your startup journey. Whether you're in the early ideation phase or scaling your operations, connect with the right backers who believe in your mission. Receive valuable feedback, explore funding opportunities, and turn your business vision into a thriving reality.",
    btn: "Get Funding",
    onClick: "handleGetFunding"
  },
  {
    img: pitchFeedbackImg,
    alt: "Improve Your Pitch",
    title: "Improve Your Pitch",
    text: "Supercharge your pitch with AI-powered feedback. Get instant, intelligent insights to refine your pitch deck and presentation—from structure and clarity to visual appeal and messaging. Make your startup story more compelling, boost investor confidence, and stand out in a competitive landscape.",
    btn: "Improve Pitch",
    onClick: "handleImprovePitch"
  }
];

const HomeEntre = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const imgRefs = [useRef(), useRef(), useRef()];
  const cardRefs = [useRef(), useRef(), useRef()];

  const { isComplete: isRegistrationComplete } = useRegistrationCheck("entre");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getFromBackend(`${BASE_URL}/auth/details`);
        setUsername(response.data.username);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);



    useEffect(() => {
    const observers = [];
    offers.forEach((_, i) => {
      if (imgRefs[i].current && cardRefs[i].current) {
        const observer = new window.IntersectionObserver(
          ([entry]) => {
            const imgEl = imgRefs[i].current;
            const cardEl = cardRefs[i].current;

            imgEl.classList.remove(
              "img-approach-right", "img-approach-left", 
              "img-slide-in-left-final", "img-slide-in-right-final"
            );
            cardEl.classList.remove(
              "card-approach-left", "card-approach-right", 
              "card-slide-in-right-final", "card-slide-in-left-final"
            );

            if (entry.isIntersecting) {
              imgEl.classList.add(i % 2 === 0 ? "img-approach-right" : "img-approach-left");
              cardEl.classList.add(i % 2 === 0 ? "card-approach-left" : "card-approach-right");
              setTimeout(() => {
                imgEl.classList.add(i % 2 === 0 ? "img-slide-in-left-final" : "img-slide-in-right-final");
                cardEl.classList.add(i % 2 === 0 ? "card-slide-in-right-final" : "card-slide-in-left-final");
              }, 1150); // Matches approach animation duration
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(cardRefs[i].current);
        observers.push(observer);
      }
    });
    return () => observers.forEach(o => o.disconnect());
  }, [imgRefs, cardRefs]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleFeatureAccess = (targetPath) => {
    if (isRegistrationComplete) {
      navigate(targetPath);
    } else {
      navigate("/complete-registration/entrepreneur");
    }
  };

  const handleConnectToPeers = () => {
    handleFeatureAccess("/entreconnect");
  };

  const handleGetFunding = () => {
    handleFeatureAccess("/entrepreneur/ListOfInvestors");
  };

  const handleImprovePitch = () => {
    handleFeatureAccess("/feedback");
  };

  return (
    <div className="home-container">
      <Navbar handleLogout={handleLogout} />

      <div className="content">
        {loading ? (
          <p>Loading user details...</p>
        ) : error ? (
          <>
            <p className="error-message">{error}</p>
            <button className="home-btn" onClick={() => navigate("/login/entre")}>
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="heading-welcome">Welcome, {username}!</h1> 
          </>
        )}
      </div>

      {/* Offers Section */}
      <div className="offers-section">
        <h2 className="offers-title">WHAT WE OFFER ?</h2>
        <div className="offers-vertical-scroll">
          {offers.map((offer, i) => (
            <div className={`offer-row ${i % 2 === 0 ? 'row-normal' : 'row-reverse'}`} key={i}>
              <div className="offer-img-wrapper big-side-block" ref={imgRefs[i]}>
                <img className="offer-img" src={offer.img} alt={offer.alt} />
              </div>
              <div className="offer-card big-offer-card big-side-block" ref={cardRefs[i]}>
                {/* <h3>{offer.title}</h3> */}
                <h3 style={{ fontSize: "2rem", fontWeight: "bold" }}>{offer.title}</h3>
                <p style={{ fontSize: "1.1rem" }}>{offer.text}</p>
                <button
                  className="offer-btn"
                  onClick={
                    offer.onClick === "handleConnectToPeers"
                      ? () => handleConnectToPeers()
                      : offer.onClick === "handleGetFunding"
                      ? () => handleGetFunding()
                      : () => handleImprovePitch()
                  }
                >
                  {offer.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Button and Help Chat */}
      {!isChatOpen && <HelpButton onClick={() => setIsChatOpen(true)} />}
      {isChatOpen && <HelpChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default HomeEntre;

//older:
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Home.css";
// import { BASE_URL } from "../helper";
// import { getFromBackend } from "../store/fetchdata";
// import { useRegistrationCheck } from "../hooks/useRegistrationCheck";
// import Navbar from "./Navbar";
// import HelpButton from "./Chatbot/HelpButton";  
// import HelpChat from "./Chatbot/HelpChat";  

// const HomeEntre = () => {
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const navigate = useNavigate();
  
//   // Check registration completion status
//   const { isComplete: isRegistrationComplete, loading: registrationLoading } = useRegistrationCheck("entre");

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await getFromBackend(`${BASE_URL}/auth/details`);
//         setUsername(response.data.username);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch user details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleLogout = () => {
//     navigate("/");
//   };

//   // Handle feature access with registration check
//   const handleFeatureAccess = (targetPath) => {
//     console.log("handleFeatureAccess called with targetPath:", targetPath);
//     console.log("isRegistrationComplete:", isRegistrationComplete);
//     console.log("registrationLoading:", registrationLoading);
    
//     if (isRegistrationComplete) {
//       console.log("Registration complete, navigating to:", targetPath);
//       navigate(targetPath);
//     } else {
//       console.log("Registration incomplete, navigating to complete registration page");
//       navigate("/complete-registration/entrepreneur");
//     }
//   };

//   const handleConnectToPeers = () => {
//     handleFeatureAccess("/entreconnect");
//   };

//   const handleGetFunding = () => {
//     handleFeatureAccess("/entrepreneur/ListOfInvestors");
//   };

//   const handleImprovePitch = () => {
//     handleFeatureAccess("/feedback");
//   };

//   return (
//     <div className="home-container">
//       <Navbar handleLogout={handleLogout} />

//       <div className="content">
//         {loading ? (
//           <p>Loading user details...</p>
//         ) : error ? (
//           <>
//             <p className="error-message">{error}</p>
//             <button className="home-btn" onClick={() => navigate("/login/entre")}>
//               Go to Login
//             </button>
//           </>
//         ) : (
//           <>
//             <h1 className="heading-welcome">Welcome, {username}!</h1> 
//             {/* <p>You are successfully logged in.</p> */}
//           </>
//         )}
//       </div>

//       {/* Offers Section */}
//       <div className="offers-section">
//         <h2 className="offers-title">WHAT WE OFFER ?</h2>
//         <div className="offers-container">
//           <div className="offer-card">
//             <h3>Connect to Peer Entrepreneurs</h3>
//             <p>Network with ambitious entrepreneurs, share ideas, and grow together in a thriving business community.</p>
//             <button className="offer-btn" onClick={handleConnectToPeers}>Connect</button>
//           </div>
//           {/* <div className="offer-card">
//             <h3>Connect to Mentors</h3>
//             <p>Gain insights and guidance from experienced mentors who can help you navigate your entrepreneurial journey.</p>
//             <button className="offer-btn" onClick={() => navigate("/mentors")}>Find Mentors</button>
//           </div> */}
//           <div className="offer-card">
//             <h3>Connect to Investors</h3>
//             <p>Find potential investors and gain insights to support your startup and bring your business vision to life.</p>
//             <button className="offer-btn" onClick={handleGetFunding}>Get Funding</button>
//           </div>
//           <div className="offer-card">
//             <h3>Improve Your Pitch</h3>
//             <p>Get AI-powered feedback on your pitch deck and presentation to make it more compelling and investor-ready.</p>
//             <button className="offer-btn" onClick={handleImprovePitch}>Improve Pitch</button>
//           </div>
//         </div>
//       </div>

//       {/* Help Button and Help Chat */}
//       {!isChatOpen && <HelpButton onClick={() => setIsChatOpen(true)} />}
//       {isChatOpen && <HelpChat onClose={() => setIsChatOpen(false)} />}
//     </div>
//   );
// };

// export default HomeEntre;





// //working badiya:
// const offers = [
//   {
//     img: peerEntrepreneursImg,
//     alt: "Connect to Peer Entrepreneurs",
//     title: "Connect to Peer Entrepreneurs",
//     text: "Network with ambitious entrepreneurs, share ideas, and grow together in a thriving business community.",
//     btn: "Connect",
//     onClick: "handleConnectToPeers"
//   },
//   {
//     img: investorsImg,
//     alt: "Connect to Investors",
//     title: "Connect to Investors",
//     text: "Find potential investors and gain insights to support your startup and bring your business vision to life.",
//     btn: "Get Funding",
//     onClick: "handleGetFunding"
//   },
//   {
//     img: pitchFeedbackImg,
//     alt: "Improve Your Pitch",
//     title: "Improve Your Pitch",
//     text: "Get AI-powered feedback on your pitch deck and presentation to make it more compelling and investor-ready.",
//     btn: "Improve Pitch",
//     onClick: "handleImprovePitch"
//   }
// ];

// const HomeEntre = () => {
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const navigate = useNavigate();

//   // For card and image animation
//   const imgRefs = [useRef(), useRef(), useRef()];
//   const cardRefs = [useRef(), useRef(), useRef()];

//   // Check registration completion status
//   const { isComplete: isRegistrationComplete } = useRegistrationCheck("entre");

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await getFromBackend(`${BASE_URL}/auth/details`);
//         setUsername(response.data.username);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch user details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   // Animate images and cards separately on scroll
//   useEffect(() => {
//     offers.forEach((_, i) => {
//       if (imgRefs[i].current && cardRefs[i].current) {
//         const observer = new window.IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               imgRefs[i].current.classList.add(i % 2 === 0 ? "img-slide-in-left" : "img-slide-in-right");
//               cardRefs[i].current.classList.add(i % 2 === 0 ? "card-slide-in-right" : "card-slide-in-left");
//             }
//           },
//           { threshold: 0.3 }
//         );
//         observer.observe(cardRefs[i].current);
//         // Cleanup
//         return () => observer.disconnect();
//       }
//     });
//   }, [imgRefs, cardRefs]);

//   const handleLogout = () => {
//     navigate("/");
//   };

//   // Handle feature access with registration check
//   const handleFeatureAccess = (targetPath) => {
//     if (isRegistrationComplete) {
//       navigate(targetPath);
//     } else {
//       navigate("/complete-registration/entrepreneur");
//     }
//   };

//   const handleConnectToPeers = () => {
//     handleFeatureAccess("/entreconnect");
//   };

//   const handleGetFunding = () => {
//     handleFeatureAccess("/entrepreneur/ListOfInvestors");
//   };

//   const handleImprovePitch = () => {
//     handleFeatureAccess("/feedback");
//   };

//   return (
//     <div className="home-container">
//       <Navbar handleLogout={handleLogout} />

//       <div className="content">
//         {loading ? (
//           <p>Loading user details...</p>
//         ) : error ? (
//           <>
//             <p className="error-message">{error}</p>
//             <button className="home-btn" onClick={() => navigate("/login/entre")}>
//               Go to Login
//             </button>
//           </>
//         ) : (
//           <>
//             <h1 className="heading-welcome">Welcome, {username}!</h1> 
//           </>
//         )}
//       </div>

//       {/* Offers Section */}
//       <div className="offers-section">
//         <h2 className="offers-title">WHAT WE OFFER ?</h2>
//         <div className="offers-vertical-scroll">
//           {offers.map((offer, i) => (
//             <div className={`offer-row ${i % 2 === 0 ? 'row-normal' : 'row-reverse'}`} key={i}>
//               <div className="offer-img-wrapper" ref={imgRefs[i]}>
//                 <img className="offer-img" src={offer.img} alt={offer.alt} />
//               </div>
//               <div className="offer-card big-offer-card broader-offer-card" ref={cardRefs[i]}>
//                 <h3>{offer.title}</h3>
//                 <p>{offer.text}</p>
//                 <button
//                   className="offer-btn"
//                   onClick={
//                     offer.onClick === "handleConnectToPeers"
//                       ? () => handleConnectToPeers()
//                       : offer.onClick === "handleGetFunding"
//                       ? () => handleGetFunding()
//                       : () => handleImprovePitch()
//                   }
//                 >
//                   {offer.btn}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Help Button and Help Chat */}
//       {!isChatOpen && <HelpButton onClick={() => setIsChatOpen(true)} />}
//       {isChatOpen && <HelpChat onClose={() => setIsChatOpen(false)} />}
//     </div>
//   );
// };

// export default HomeEntre;

