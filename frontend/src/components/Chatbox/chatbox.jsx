// // import { useEffect, useState, useRef } from "react";
// // import io from "socket.io-client";
// // import { useAuth } from "../../store/storetoken";
// // import { jwtDecode } from "jwt-decode"; // Ensure it's installed
// // import "./chatbox.css";

// // const ChatPage = () => {
// //   const { storeTokeninLS } = useAuth();
// //   const [socket, setSocket] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState("");
// //   const [receiverEmail, setReceiverEmail] = useState("");
// //   const messagesEndRef = useRef(null);

// //   // Extract user details from token
// //   const getUserDetails = () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) return null;

// //     try {
// //       const decoded = jwtDecode(token);
// //       const email = decoded.emailid?.trim();
// //       const role = decoded.role?.trim();
// //       if (!email || !role) return null; // Ensure both are present
// //       return { email, role };
// //     } catch (error) {
// //       console.error("Invalid token:", error);
// //       return null;
// //     }
// //   };

// //   const user = getUserDetails();
// //   const userEmail = user?.email;
// //   const userRole = user?.role; // 'investor' or 'entrepreneur'

// //   useEffect(() => {
// //     if (!userEmail || !userRole) return;

// //     const newSocket = io("http://localhost:5050", { transports: ["websocket"] });
// //     setSocket(newSocket);

// //     newSocket.emit("addUser", { email: userEmail, role: userRole });

// //     newSocket.on("getMessage", (message) => {
// //       // Ensure message is only between Investor and Entrepreneur
// //       if (
// //         (userRole === "investor" && message.senderRole === "entre") ||
// //         (userRole === "entre" && message.senderRole === "investor")
// //       ) {
// //         setMessages((prev) => [...prev, message]);
// //       }
// //     });

// //     return () => {
// //       newSocket.disconnect(); // Cleanup on unmount
// //     };
// //   }, [userEmail, userRole]);

// //   const sendMessage = () => {
// //     if (!receiverEmail || !text.trim() || !socket || !userEmail || !userRole) {
// //       console.log("Something is missing!");
// //       return;
// //     }

// //     const messageData = {
// //       senderId: userEmail,
// //       senderRole: userRole,
// //       receiverId: receiverEmail,
// //       text,
// //     };

// //     socket.emit("sendMessage", messageData);
// //     setMessages((prev) => [...prev, messageData]); // Optimized message update
// //     setText("");
// //   };

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);
// //   useEffect(() => {
// //     console.log("Socket:", socket); // Debugging
// //   }, [socket]);
  
// //   return (
// //     <div className="chat-container">
// //       <h2>Chat</h2>
// //       <input
// //         type="text"
// //         value={receiverEmail}
// //         onChange={(e) => setReceiverEmail(e.target.value)}
// //         placeholder="Receiver's email"
// //         className="input-field"
// //       />
// //       <div className="chat-box">
// //         {messages.map((msg, index) => (
// //           <div key={index} className={msg.senderId === userEmail ? "message sent" : "message received"}>
// //             <span>{msg.text}</span>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>
// //       <div className="input-area">
// //         <input
// //           type="text"
// //           value={text}
// //           onChange={(e) => setText(e.target.value)}
// //           placeholder="Type a message..."
// //           className="input-field"
// //         />
// //         <button onClick={sendMessage} className="send-button">Send</button>
// //       </div>
// //     </div>
// //   );
// // };


// // export default ChatPage;

// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import { useAuth } from "../../store/storetoken";
// import { jwtDecode } from "jwt-decode";
// import "./chatbox.css";

// const SOCKET_SERVER_URL = "http://localhost:5050"; // ✅ Ensure this is correct

// const ChatPage = () => {
//   const { storeTokeninLS } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [receiverEmail, setReceiverEmail] = useState("");
//   const messagesEndRef = useRef(null);

//   // Extract user details from token
//   const getUserDetails = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     try {
//       const decoded = jwtDecode(token);
//       console.log(decoded);
//       return { email: decoded.emailid, role: decoded.role };
//     } catch (error) {
//       console.error("Invalid token:", error);
//       return null;
//     }
//   };

//   const user = getUserDetails();
//   const userEmail = user?.email;
//   const userRole = user?.role;

//   useEffect(() => {
//     if (!userEmail || !userRole) return;

//     // ✅ Ensure WebSocket is used
//     const newSocket = io(SOCKET_SERVER_URL, {
//       transports: ["websocket"], // Force WebSocket
//       reconnection: true, // ✅ Auto-reconnect
//       reconnectionAttempts: 5, // ✅ Try 5 times before giving up
//       reconnectionDelay: 2000, // ✅ Wait 2 sec between attempts
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("✅ Connected to socket:", newSocket.id);
//       newSocket.emit("addUser", { email: userEmail, role: userRole });
//     });

//     newSocket.on("getMessage", (message) => {
//       if (
//         (userRole === "investor" && message.senderRole === "entre") ||
//         (userRole === "entre" && message.senderRole === "investor")
//       ) {
//         setMessages((prev) => [...prev, message]);
//       }
//     });

//     newSocket.on("disconnect", () => {
//       console.warn("❌ Disconnected from socket");
//     });

//     return () => {
//       newSocket.disconnect(); // ✅ Prevent memory leaks
//     };
//   }, [userEmail, userRole]);

//   const sendMessage = () => {
//     console.log("receiverEmail:", receiverEmail);
//   console.log("text:", text);
//   console.log("socket:", socket);
//   console.log("userEmail:", userEmail);
//   console.log("userRole:", userRole);
//     if (!receiverEmail || !text || !socket || !userEmail || !userRole) {
//       console.log("you are doing something wrong!");
//       return;
//     }

//     const messageData = {
//       senderId: userEmail,
//       senderRole: userRole,
//       receiverId: receiverEmail,
//       text,
//     };

//     socket.emit("sendMessage", messageData);
//     setMessages([...messages, messageData]);
//     setText("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="chat-container">
//       <h2>Chat</h2>
//       <input
//         type="text"
//         value={receiverEmail}
//         onChange={(e) => setReceiverEmail(e.target.value)}
//         placeholder="Receiver's email"
//         className="input-field"
//       />
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index} className={msg.senderId === userEmail ? "message sent" : "message received"}>
//             <span>{msg.text}</span>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="input-area">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           className="input-field"
//         />
//         <button onClick={sendMessage} className="send-button">Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import { jwtDecode } from "jwt-decode";
// import "./chatbox.css";

// const SOCKET_SERVER_URL = "http://localhost:5050";

// const ChatPage = () => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [receiverEmail, setReceiverEmail] = useState("");
//   const messagesEndRef = useRef(null);

//   const getUserDetails = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     try {
//       const decoded = jwtDecode(token);
//       return { email: decoded.emailid, role: decoded.role };
//     } catch (error) {
//       console.error("Invalid token:", error);
//       return null;
//     }
//   };

//   const user = getUserDetails();
//   const userEmail = user?.email;
//   const userRole = user?.role;

//   useEffect(() => {
//     if (!userEmail || !userRole) return;

//     const newSocket = io(SOCKET_SERVER_URL, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 2000,
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("✅ Connected to socket:", newSocket.id);
//       newSocket.emit("addUser", { email: userEmail, role: userRole });
//     });

//     newSocket.on("getMessage", (message) => {
//       if (
//         (userRole === "investor" && message.senderRole === "entre") ||
//         (userRole === "entre" && message.senderRole === "investor")
//       ) {
//         setMessages((prev) => [...prev, message]);
//       }
//     });

//     newSocket.on("disconnect", () => {
//       console.warn("❌ Disconnected from socket");
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userEmail, userRole]);

//   const sendMessage = () => {
//     if (!receiverEmail || !text.trim() || !socket || !userEmail || !userRole) {
//       console.log("Missing required fields!");
//       return;
//     }

//     const messageData = {
//       senderId: userEmail,
//       senderRole: userRole,
//       receiverId: receiverEmail,
//       text,
//     };

//     socket.emit("sendMessage", messageData);
//     setMessages((prev) => [...prev, messageData]);
//     setText("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="chat-container">
//       <h2>Chat</h2>
//       <input
//         type="text"
//         value={receiverEmail}
//         onChange={(e) => setReceiverEmail(e.target.value)}
//         placeholder="Receiver's email"
//         className="input-field"
//       />
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={msg.senderId === userEmail ? "message sent" : "message received"}
//           >
//             <span>{msg.text}</span>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="input-area">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           className="input-field"
//         />
//         <button onClick={sendMessage} className="send-button">Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "./chatbox.css";

const SOCKET_SERVER_URL = "http://localhost:5050";

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
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

  const sendMessage = () => {
    if (!receiverEmail || !text.trim() || !socket || !userEmail || !userRole) {
      console.log("Missing required fields!");
      return;
    }

    // if (receiverEmail === userEmail) {
    //   alert("❌ You can't send messages to yourself!");
    //   return;
    // }

    const messageData = {
      senderId: userEmail,
      senderRole: userRole,
      receiverId: receiverEmail,
      text,
    };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <input
        type="text"
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
        placeholder="Receiver's email"
        className="input-field"
      />
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === userEmail ? "message sent" : "message received"}
          >
            <span>{msg.text}</span>
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

export default ChatPage;
