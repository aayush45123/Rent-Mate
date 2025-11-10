// components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import {
  FaTimes,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaEllipsisV,
  FaExclamationTriangle,
} from "react-icons/fa";
import styles from "./ChatInterface.module.css";

const ChatInterface = ({ isOpen, onClose, otherUser }) => {
  const { currentChat, messages, sendMessage, startChat, closeChat } =
    useChat();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && otherUser && !currentChat) {
      initializeChat();
    }
  }, [isOpen, otherUser]);

  const initializeChat = async () => {
    setLoading(true);
    setError(null);
    try {
      await startChat(otherUser._id);
    } catch (error) {
      console.error("Error initializing chat:", error);
      setError(error.message || "Failed to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !currentChat) return;

    try {
      await sendMessage(otherUser._id, message);
      setMessage("");
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleClose = () => {
    closeChat();
    onClose();
    setError(null);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatOverlay}>
      <div className={styles.chatContainer}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.userInfo}>
            <img
              src={otherUser.picture || "/default-avatar.png"}
              alt={otherUser.name}
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <h3 className={styles.userName}>{otherUser.name}</h3>
              <span className={styles.userStatus}>
                {otherUser.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.actionBtn}>
              <FaEllipsisV />
            </button>
            <button onClick={handleClose} className={styles.closeBtn}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.errorBanner}>
            <FaExclamationTriangle />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={styles.dismissError}
            >
              ×
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className={styles.messagesContainer}>
          {loading ? (
            <div className={styles.loadingMessages}>
              <div className={styles.spinner}></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className={styles.noMessages}>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className={styles.messagesList}>
              {messages.map((msg) => (
                <div
                  key={msg._id || msg.timestamp}
                  className={`${styles.message} ${
                    msg.senderId === otherUser._id
                      ? styles.received
                      : styles.sent
                  }`}
                >
                  <div className={styles.messageContent}>
                    <p className={styles.messageText}>{msg.content}</p>
                    <div className={styles.messageMeta}>
                      <span className={styles.messageTime}>
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.senderId !== otherUser._id && (
                        <span className={styles.messageStatus}>
                          {msg.read ? (
                            <FaCheckDouble className={styles.readIcon} />
                          ) : msg.delivered ? (
                            <FaCheckDouble className={styles.deliveredIcon} />
                          ) : (
                            <FaCheck className={styles.sentIcon} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className={styles.messageInputContainer}
        >
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className={styles.messageInput}
              disabled={!currentChat || loading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!message.trim() || !currentChat || loading}
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
