import React, { useState, useEffect, useRef } from 'react';
import "./live-chat.css";
import emojiIcon from "./emoji.png";
import closeIcon from "./close.png";
import membersIcon from "./members.png";
import socket from '../socket';
import 'emoji-picker-element';

/**
 * Functional component representing the live chat section.
 * @param {object} props - The properties passed to the component.
 * @param {Function} props.onCloseClick - Function for closing the chat - TODO
 * @param {Function} props.onMembersClick - Function for opening members list - TODO
 * @returns {JSX.Element} The JSX representation of the component.
 */
const LiveChat = ({ onCloseClick, onMembersClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    socket.on('receive-message', ({ user, message, color, mediaTime }) => {
      const formattedTime = formatMediaTime(mediaTime);
      setMessages(prevMessages => [...prevMessages, { user, message, color, mediaTime: formattedTime }]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handles emoji button click event.
   */
  const handleEmojiClick = () => {
    const emojiPicker = document.createElement('emoji-picker');
  
    emojiPicker.style.position = 'fixed';
    emojiPicker.style.bottom = '10px'; 
    emojiPicker.style.right = '10px';
    emojiPicker.style.marginBottom = '80px';
  
    emojiPicker.addEventListener('emoji-click', (emojiEvent) => {
      const emoji  = emojiEvent.detail.emoji.unicode;
      setInputValue((prevValue) => prevValue + emoji);
      emojiPicker.remove();
    });
  
    document.body.appendChild(emojiPicker);
  };
  
  /**
   * Handles close button click event.
   */
  const handleCloseClick = () => {
    onCloseClick(inputValue);
  };

  /**
   * Handles members button click event.
   */
  const handleMembersClick = () => {
    onMembersClick(inputValue);
  };

  /**
   * Handles send button click event.
   */
  const handleSendClick = () => {
    if (inputValue !== '') {
      socket.emit('send-message', inputValue);
      setInputValue('');
    }
  };

  /**
   * Handles input click event.
   */
  const handleInputClick = () => {
    // setInputValue('');
  };

  /**
   * Formats media time into 'MM:SS' format.
   * @param {object} timeInSeconds - The current time of the media in seconds.
   * @returns {string} The formatted media time.
   */
  const formatMediaTime = (timeInSeconds) => {
    if (timeInSeconds && !isNaN(timeInSeconds)) {
      const x = Math.floor(timeInSeconds.currentTime || 0);
  
      const minutes = Math.floor(x / 60);
      const seconds = Math.floor(x % 60);
  
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return '00:00';
    }
  };
  
  return (
    <div className="live-chat">
      <div className="titleBar">
        <div className="title">LIVE CHAT</div>
        <button className="members" onClick={() => handleMembersClick()}>
          <img src={membersIcon} alt="Members Icon" />
        </button>
        <button className="close" onClick={() => handleCloseClick()}>
          <img src={closeIcon} alt="Close Icon" />
        </button>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((messageObj, index) => (
          <div key={index} className="item">
            <span style={{ fontWeight: 'bold', color: messageObj.color }}>
              {messageObj.user}:
            </span>
            {` ${messageObj.message} (${messageObj.mediaTime})`}
          </div>
        ))}
      </div>
      <div className="message">
        <input
          type="text"
          value={inputValue}
          placeholder="Send a message..."
          onChange={(e) => setInputValue(e.target.value)}
          onClick={handleInputClick}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendClick();
            }
          }}
        />
        <button onClick={handleEmojiClick}>
          <img src={emojiIcon} alt="Emoji Icon" />
        </button>
      </div>
      <button className="send" onClick={handleSendClick}>
        Send
      </button>
    </div>
  );
};

export default LiveChat;
