// contexts/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0(); // ADDED: getIdTokenClaims

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("ChatContext: User authenticated", user); // DEBUG

      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          token: encodeURIComponent(user.sub)
, // Use encodeURIComponent(user.sub)as token
          userId: encodeURIComponent(user.sub)
,
        },
        query: {
          userId: encodeURIComponent(user.sub)
,
        },
      });

      setSocket(newSocket);

      // Join user to their personal room
      newSocket.emit("join_user", { userId: encodeURIComponent(user.sub)
 });

      // Listen for new messages
      newSocket.on("receive_message", (message) => {
        console.log("Received message:", message); // DEBUG
        setMessages((prev) => [...prev, message]);

        // Update unread count if chat is not active
        if (currentChat?.userId !== message.senderId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }));
        }
      });

      // Listen for online users
      newSocket.on("online_users", (users) => {
        console.log("Online users:", users); // DEBUG
        setOnlineUsers(users);
      });

      // Listen for message read receipts
      newSocket.on("messages_read", ({ chatId, readerId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === readerId ? { ...msg, read: true } : msg
          )
        );
      });

      // Listen for connection errors
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = async (receiverId, content) => {
    if (socket && content.trim() && user) {
      try {
        const message = {
          senderId: encodeURIComponent(user.sub)
,
          receiverId,
          content: content.trim(),
          timestamp: new Date().toISOString(),
          senderName: user.name,
          senderPicture: user.picture,
        };

        console.log("Sending message:", message); // DEBUG

        // Emit to socket for real-time delivery
        socket.emit("send_message", message);

        // Also save to database via API
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/chat/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save message");
        }

        // Add to local state immediately for instant feedback
        setMessages((prev) => [
          ...prev,
          { ...message, _id: Date.now(), status: "sent" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // You might want to show an error to the user here
      }
    }
  };

  const startChat = async (otherUserId) => {
    try {
      console.log("Starting chat with:", otherUserId); // DEBUG
      console.log("Current user:", user); // DEBUG

      if (!user || !encodeURIComponent(user.sub)
) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participant1: encodeURIComponent(user.sub)
,
            participant2: otherUserId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentChat({
          chatId: data.chat._id,
          userId: otherUserId,
          userName: data.otherUser?.name || "User",
          userPicture: data.otherUser?.picture || "/default-avatar.png",
        });

        // Load existing messages
        await loadMessages(data.chat._id);

        // Clear unread count
        setUnreadCounts((prev) => ({ ...prev, [otherUserId]: 0 }));

        // Mark messages as read
        if (socket) {
          socket.emit("mark_messages_read", {
            chatId: data.chat._id,
            readerId: encodeURIComponent(user.sub)
,
          });
        }

        return data.chat._id;
      } else {
        throw new Error(data.error || "Failed to start chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error; // Re-throw to handle in component
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/messages/${chatId}`
      );
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const closeChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };

  const value = {
    socket,
    currentChat,
    messages,
    unreadCounts,
    onlineUsers,
    sendMessage,
    startChat,
    closeChat,
    loadMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
