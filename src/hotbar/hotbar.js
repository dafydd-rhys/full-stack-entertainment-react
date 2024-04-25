import React from 'react';
import SearchBar from './search-bar/search-bar';
import NicknameBar from './nickname-bar/nickname-bar';
import './hotbar.css';

/**
 * Functional component representing the hotbar section.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {Function} props.onSearchButtonClick - Function for search button click.
 * @param {string} props.socketId - The socket ID.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const Hotbar = ({ onSearchButtonClick, socketId }) => {
  console.log("Socket ID in Hotbar:", socketId);
  return (
    <div className="hotbar">
      <SearchBar onSearchButtonClick={onSearchButtonClick} />
      <NicknameBar socketId={socketId} />
    </div>
  );
};

export default Hotbar;
