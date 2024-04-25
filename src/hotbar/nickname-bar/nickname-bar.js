import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "./nickname-bar.css";
import editIcon from "./edit.png";
import socket from '../../socket';

/**
 * Functional component representing the nickname bar section.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {string} props.socketId - The socket ID.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const NicknameBar = ({ socketId }) => {
  const [nicknameValue, setNicknameValue] = useState('');

  useEffect(() => {
    if (socketId) {
      setNicknameValue(socketId);
    }
  }, [socketId]);

  /**
   * Handles the set nickname click event.
   */
  const handleButtonClick = () => {
    if (nicknameValue !== '') {
      socket.emit('send-socket-id', nicknameValue);
    }
  };

  return (
    <div className='nickname-bar'>
      <input
        type="text"
        value={nicknameValue}
        onChange={(e) => setNicknameValue(e.target.value)}
      />
      <button onClick={handleButtonClick}>
        <img src={editIcon} alt="Nickname Icon" />
      </button>
    </div>
  );
};

NicknameBar.propTypes = {
  socketId: PropTypes.string,
};

export default NicknameBar;
