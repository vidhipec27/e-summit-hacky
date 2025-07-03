import { useState, useEffect, useRef } from "react";
import "./HelpChat.css";
import { BASE_URL } from "../../helper";

export default function HelpChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const botMessage = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entreconnect-chat">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <div className="avatar-icon">EC</div>
            <div className="status-indicator"></div>
          </div>
          <div className="header-info">
            <h3 className="bot-name">EntreConnect Bot</h3>
            <span className="bot-status">Online • Ready to help</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">💡</div>
            <h4>Welcome to EntreConnect!</h4>
            <p>I'm here to help you with entrepreneurship, networking, funding, and business advice. What would you like to know?</p>
            <div className="quick-suggestions">
              <button className="suggestion-btn" onClick={() => setInput("How can I find investors?")}>
                Find Investors
              </button>
              <button className="suggestion-btn" onClick={() => setInput("Help me network")}>
                Networking Tips
              </button>
              <button className="suggestion-btn" onClick={() => setInput("Business plan advice")}>
                Business Plans
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.role === "user" ? "user-message" : "assistant-message"}`}
          >
            {msg.role === "assistant" && (
              <div className="message-avatar">
                <div className="bot-icon">EC</div>
              </div>
            )}
            <div className="message-bubble">
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {/* {msg.role === "user" && (
              <div className="message-avatar user-avatar">
                <div className="user-icon">You</div>
              </div>
            )} */}
          </div>
        ))}

        {loading && (
          <div className="message-wrapper assistant-message">
            <div className="message-avatar">
              <div className="bot-icon">EC</div>
            </div>
            <div className="message-bubble loading-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="loading-text">EntreConnect Bot is typing...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={sendMessage} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about entrepreneurship..."
              className="message-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
