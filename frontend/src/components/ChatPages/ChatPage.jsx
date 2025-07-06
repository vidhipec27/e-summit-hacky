"use client"

import { useEffect, useState, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import { io } from "socket.io-client"
import "./ChatPage.css"

import Conversation from "./Conversation.jsx"
import Message from "./Message.jsx"
import { BASE_URL } from "../../helper.js"
import { postToBackend, getFromBackend } from "../../store/fetchdata"
import { useParams } from "react-router-dom"
import Navbar from "../Navbar.jsx"

const ChatPage = () => {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const socket = useRef()
  const scrollRef = useRef()
  const { emailid } = useParams()
  const createdWithRef = useRef(new Set());
  const isCreated=useRef(false);

  const getUser = () => {
    const token = localStorage.getItem("token")
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return { emailid: decoded.emailid, role: decoded.role, username: decoded.username }
    } catch (err) {
      console.error("Token error:", err)
      return null
    }
  }

  const user = getUser()
  const userEmail = user?.emailid
  const userRole = user?.role

  // Function to remove duplicate conversations
  const removeDuplicateConversations = (conversations) => {
    const seen = new Set()
    const unique = []

    conversations.forEach((conv) => {
      if (conv.members && conv.members.length >= 2) {
        // Create a unique key for this conversation based on members
        const otherMember = conv.members.find((member) => member !== userEmail)

        if (otherMember && !seen.has(otherMember)) {
          seen.add(otherMember)
          unique.push(conv)
        }
      }
    })

    return unique
  }

  // Connect to socket
  useEffect(() => {
    socket.current = io(BASE_URL)
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })
  }, [])

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage])
    }
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    if (userEmail) {
      socket.current.emit("addUser", { email: userEmail, role: userRole })
    }
  }, [userEmail])

  // Function to create a new conversation


  const createConversation = async (receiverEmail) => {
    try {
      const res = await postToBackend(`${BASE_URL}/api/conversations/`, {
        senderEmail: userEmail,
        senderRole: userRole,
        receiverEmail: receiverEmail,
      })
      return res.data
    } catch (err) {
      console.error("Error creating conversation:", err)
      return null
    }
  }

  // Fetch conversations and handle auto-initialization
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userEmail) return
      try {
        const res = await getFromBackend(`${BASE_URL}/api/conversations/`)
        console.log("Raw conversations:", res)

        const withCurrentUser = res.data.map((c) => ({
          ...c,
          currentUser: userEmail,
        }))

        // Remove duplicates before setting state
        const uniqueConversations = removeDuplicateConversations(withCurrentUser)
        console.log("Unique conversations:", uniqueConversations)
        setConversations(uniqueConversations)

        // Auto-initialize conversation if emailid is provided in params
        if (emailid && emailid.trim() !== "" && emailid !== userEmail) {
          // Check if conversation already exists with this emailid
          const existingConversation = uniqueConversations.find(
            (conv) => conv.members && conv.members.includes(emailid),
          )

          if (existingConversation) {
            setCurrentChat(existingConversation)
          } else if(!isCreated.current) {
            // Create new conversation only if none exists
            isCreated.current=true;
            const newConversation = await createConversation(emailid)
            isCreated.current=false;
            if (newConversation) {
              const newConvWithCurrentUser = {
                ...newConversation,
                currentUser: userEmail,
              }
              const updated = setConversations((prev) =>
                removeDuplicateConversations([...prev, newConvWithCurrentUser])
              )
              setCurrentChat(newConvWithCurrentUser)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching conversations:", err)
      }
    }
    fetchConversations()
  }, [userEmail, emailid])

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return
      try {
        const res = await getFromBackend(`${BASE_URL}/api/messages/${currentChat._id}`)
        console.log("wanna be printing res", res)
        setMessages(res.data.messages)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }
    fetchMessages()
  }, [currentChat])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat || !userEmail) return

    const receiverId = currentChat.members.find((m) => m !== userEmail)

    socket.current.emit("sendMessage", {
      senderId: userEmail,
      senderRole: userRole,
      receiverId,
      text: newMessage,
    })

    try {
      const data1 = {
        sender: userEmail,
        text: newMessage,
        conversationId: currentChat._id,
      }
      const data2 = {
        receiverEmail: receiverId,
        message: newMessage,
        convoId: currentChat._id,
      }
      const res = await postToBackend(`${BASE_URL}/api/messages/`, data2)
      setMessages((prev) => [...prev, data1])
      setNewMessage("")
    } catch (err) {
      console.error("Sending failed:", err)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="messenger">
      <Navbar/>
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <h3>Your Chats</h3>
          {conversations.map((c, index) => (
            <Conversation key={index} conversation={c} onClick={() => setCurrentChat(c)} />
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
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
  )
}

export default ChatPage
