import React, { useState } from 'react';
import PropTypes from 'prop-types';
import searchIcon from "./search-bar.png";
import "./search-bar.css";

/**
 * Functional component representing the search bar section.
 * @param {object} props - The properties passed to the component.
 * @param {Function} props.onSearchButtonClick - Function for search button click.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const SearchBar = ({ onSearchButtonClick }) => {
  const [searchValue, setSearchValue] = useState('');

  /**
   * Handles the search for media click event.
   */
  const handleButtonClick = () => {
    onSearchButtonClick(searchValue);
  };

  /**
   * Handles the input click event.
   */
  const handleInputClick = () => {
    setSearchValue('');
  };

  return (
    <div className='search-bar'>
      <input
        type="text"
        value={searchValue}
        placeholder="Enter Media URL"
        onChange={(e) => setSearchValue(e.target.value)}
        onClick={handleInputClick}
      />
      <button onClick={handleButtonClick}>
        <img src={searchIcon} alt="Search Icon" />
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  onSearchButtonClick: PropTypes.func.isRequired,
};

export default SearchBar;
