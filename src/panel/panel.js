import React from 'react';
import './panel.css';
import YT from './YT.jpg';
import SC from './SC.jpg';
import FB from './FB.png';
import TW from './TW.png';

/**
 * Functional component representing the panel section.
 * 
 * @returns {JSX.Element} The JSX representation of the component.
 */
const Panel = ({}) => {

  return (
    <div className="panel">
      <button>
        <img src={YT} alt="YouTube" />
      </button>
      <button >
        <img src={SC} alt="SoundCloud" />
      </button>
      <button >
        <img src={FB} alt="Facebook" />
      </button>
      <button>
        <img src={TW} alt="Twitch" />
      </button>
    </div>
  );
};

export default Panel;
