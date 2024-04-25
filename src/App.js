import React, { useState, useEffect } from 'react';
import './App.css';
import Hotbar from './hotbar/hotbar';
import MediaPlayer from './media-player/media-player';
import LiveChat from './live-chat/live-chat';
import Panel from './panel/panel';
import socket from './socket';

/**
 * Functional component representing the main application.
 * @returns {JSX.Element} The JSX representation of the component.
 */
function App() {
  /**
   * State hook for managing media data.
   */
  const [media, setMedia] = useState({
    mediaURL: '',
    mediaTitle: '',
    mediaChoser: '',
    currentTime: 0,
    playing: false
  });

  /**
   * Effect hook for updating media data.
   */
  useEffect(() => {
    /**
     * Listener function to handle updated media data from the server.
     * @param {object} updatedMedia - The updated media data.
     */
    const updateMediaListener = (updatedMedia) => {
      setMedia(updatedMedia);
      socket.emit('newMedia', updatedMedia);
    };

    socket.on('updatedMedia', updateMediaListener);

    return () => {
      socket.off('updatedMedia', updateMediaListener);
    };
  }, []);


  /**
   * Handler function for searching and parsing media.
   * @param {string} URL - The URL of the media to parse.
   */
  const handleSearch = (URL) => {
    socket.emit('parseMedia', { URL });
  };

  return (
    <div className="app" style={{ backgroundColor: "#100c0c" }}>
      <LiveChat />
      <Panel/>
      <Hotbar onSearchButtonClick={handleSearch} />
      <MediaPlayer
        url={media.mediaURL}
        title={media.mediaTitle}
        chosenBy={media.mediaChoser}
        time={media.currentTime}
        playing={media.playing}
      />
    </div>
  );
}

export default App;
