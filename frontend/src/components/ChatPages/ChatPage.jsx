import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import "./ChatPage.css";

import Conversation from "./Conversation.jsx";
import Message from "./Message.jsx";
import { BASE_URL } from "../../helper.js";
import { postToBackend, getFromBackend } from "../../store/fetchdata";

const SOCKET_SERVER_URL = "http://localhost:5050";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]); 
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { emailid: decoded.emailid, role: decoded.role };
    } catch (err) {
      console.error("Token error:", err);
      return null;
    }
  };

  const user = getUser();
  const userEmail = user?.emailid;
  const userRole = user?.role;

  // Connect to socket
  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (userEmail) {
      socket.current.emit("addUser", { email: userEmail, role: userRole });
    }
  }, [userEmail]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userEmail) return;
      try {
        const res = await getFromBackend(`${BASE_URL}/api/conversations/`);
        console.log(res);
        const withCurrentUser = res.data.map((c) => ({
          ...c,
          currentUser: userEmail,
        }));
        setConversations(withCurrentUser);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    fetchConversations();
  }, [userEmail]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await getFromBackend(`${BASE_URL}/api/messages/${currentChat._id}`);
        // const data = await res.json();
        console.log("wanna be printing res",res);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat || !userEmail) return;

    const receiverId = currentChat.members.find((m) => m !== userEmail);

    socket.current.emit("sendMessage", {
      senderId: userEmail,
      senderRole:userRole,
      receiverId,
      text: newMessage,
    });

    try {
        const data1={
          sender: userEmail,
          text: newMessage,
          conversationId: currentChat._id,
        };
        const data2={
          receiverEmail: receiverId,
          message: newMessage,
          convoId: currentChat._id,
        };
       const res = await postToBackend(`${BASE_URL}/api/messages/`,data2)
      setMessages((prev) => [...prev, data1]);
      setNewMessage("");
    } catch (err) {
      console.error("Sending failed:", err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <h3>Your Chats</h3>
          {conversations.map((c, index) => (
            <Conversation
              key={index}
              conversation={c}
              onClick={() => setCurrentChat(c)}
            />
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m, index) => (
                  <Message key={index} ref={scrollRef} message={m} own={m.sender === userEmail} />

                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="Write a message..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />
                <button className="chatSubmitButton" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">Open a conversation to start chatting</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
