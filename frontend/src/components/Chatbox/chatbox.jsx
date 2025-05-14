import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./chatbox.css";
import { postToBackend, getFromBackend } from "../../store/fetchdata";
import { BASE_URL } from "../../helper";
const SOCKET_SERVER_URL = "http://localhost:5050";

const ChatBox = () => {
  const { emailid } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

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
  const userEmail = user?.email;
  const userRole = user?.role;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if(userRole==="investor"){
        console.log("Fetching profile for:", emailid);
        const response = await getFromBackend(`${BASE_URL}/search/entre/details/${ emailid }` );
        console.log("Profile response:", response);
        setUserProfile(response.data.result[0]);}
        else{
          console.log("Fetching profile for:", emailid);
        const response = await postToBackend(`${BASE_URL}/search/investor/details`,{emailid}  );
        console.log("Profile response:", response);
        setUserProfile(response.data.result[0]);}
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          username: "Guest",
          emailid: "guest@example.com",
          number: "0000000000",
          domain: "General",
          experience: 0,
          expertise: "None",
          willFund: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [emailid]);

  useEffect(() => {
    if (!userEmail || !userRole) return;

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("addUser", { email: userEmail, role: userRole });
    });

    newSocket.on("getMessage", (message) => {
      if (
        (userRole === "investor" && message.senderRole === "entre") ||
        (userRole === "entre" && message.senderRole === "investor")
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ Disconnected from socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userEmail, userRole]);

  const sendMessage =async () => {
    if (!emailid || !text.trim() || !socket || !userEmail || !userRole) {
      console.log("Missing required fields!");
      return;
    }

    const convoPayload = {
      receiverEmail: emailid,
    };
    const convoRes = await postToBackend(`${BASE_URL}/api/conversations/`, convoPayload);
    const conversationId = convoRes.data._id;

    const messageData = {
      senderId:userEmail,
      convoId:conversationId,
      receiverEmail: emailid,
      message:text,
    };
    console.log(messageData);
     const res = await postToBackend(`${BASE_URL}/api/messages`,messageData);
     const dataforsocket={
      senderId:userEmail,
      senderRole:userRole,
      receiverId: emailid,
      text,
    };
    socket.emit("sendMessage",dataforsocket);
    setMessages((prev) => [...prev, dataforsocket]);
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>{loading ? "Loading chat..." : `Chat with ${userProfile?.username || "Guest"}`}</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
         <div key={index} className="message-wrapper">
      <div className={`message ${msg.senderId === userEmail ? "sent" : "received"}`}>
        <span>{msg.text}</span>
      </div>
    </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input-field"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;