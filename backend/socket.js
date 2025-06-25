import { Server } from "socket.io";

let users = [];

const addUser = (userId, socketId) => {
    if (!userId) {
      console.error("❌ Missing userId when adding user");
      return;
    }
  
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId });
      console.log("✅ User added:", { userId, socketId, users });
    } else {
      console.log("⚠️ User already exists:", userId);
    }
  };

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
    // transports: ["websocket"], // ✅ Ensure WebSocket is used
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.on("addUser", ({ email, role }) => {
      addUser(email, socket.id);
      console.log(`User added: ${email} (${role})`);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, senderRole, receiverId, text }) => {
        console.log("📩 Incoming message:", { senderId, senderRole, receiverId, text });
      
        const user = getUser(receiverId);
        if (user) {
          console.log(`📤 Sending message to ${receiverId} at ${user.socketId}`);
          io.to(user.socketId).emit("getMessage", { senderId, senderRole, text });
        } else {
          console.error(`❌ Receiver ${receiverId} not found in users list`);
        }
      });
    socket.on("disconnect", () => {
      console.log("❌ A user disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });

  return io;
};
