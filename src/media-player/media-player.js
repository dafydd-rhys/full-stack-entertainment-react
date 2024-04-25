import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import './media-player.css';
import socket from '../socket';

/**
 * Functional component representing the media player section.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {string} props.url - The URL of the media.
 * @param {string} props.title - The title of the media.
 * @param {string} props.chosenBy - The user who chose the media.
 * @param {object} props.time - The current time of the media.
 * @param {boolean} props.playing - Whether the media is currently playing.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const MediaPlayer = ({ url, title, chosenBy, time, playing }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerSize, setPlayerSize] = useState({ width: 1408, height: 792 });
  const [titleWidth, setTitleWidth] = useState(window.innerWidth / 2); 

  useEffect(() => {
    console.log("Socket connected:", socket.connected);
    setIsPlaying(playing);
  
    socket.on('pauseMedia', (data) => {
      console.log("Received pauseMedia event:", data);
      setIsPlaying(false);

      if (playerRef.current) {
        playerRef.current.seekTo(data.currentTime, 'seconds');
      }
    });
  
    socket.on('playMedia', (data) => {
      console.log("Received playMedia event:", data);
      setIsPlaying(true);
  
      if (playerRef.current) {
        playerRef.current.seekTo(data.currentTime, 'seconds');
      }
    });
  
    socket.on('seekTo', (data) => {
      console.log("Received seekTo event:", data);
      setIsPlaying(data.isPlaying);
    });

    const handleResize = () => {
      const newWidth = window.innerWidth - 512;
      const newHeight = newWidth * 0.5625
      
      const x = (950/962) * window.innerWidth + (250 - ((950*958)/962))
      setTitleWidth(x);

      setPlayerSize({ width: newWidth, height: newHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('pauseMedia');
      socket.off('playMedia');
      socket.off('seekTo');
    };
  }, [playing]);

  /**
   * Handles the play button click event.
   */
  const handlePlay = () => {
    const currentTime = playerRef.current.getCurrentTime();

    if (!isPlaying) {
      setIsPlaying(true);  
      socket.emit('playMedia', { currentTime, isPlaying});
    }
  }; 

  /**
   * Handles the pause button click event.
   */
  const handlePause = () => {
    const currentTime = playerRef.current.getCurrentTime();
  
    if (isPlaying) {
      setIsPlaying(false); 
      socket.emit('pauseMedia', { currentTime, isPlaying });
    }
  };

  /**
   * Handles the rewind button click event.
   */
  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 5, 'seconds');

      if (isPlaying) {
        socket.emit('playMedia', { currentTime: currentTime - 5, isPlaying });
      } else {
        socket.emit('pauseMedia', { currentTime: currentTime - 5, isPlaying });
      }
    }
  };

  /**
   * Handles the skip button click event.
   */
  const handleSkip = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 5, 'seconds');

      if (isPlaying) {
        socket.emit('playMedia', { currentTime: currentTime + 5, isPlaying }); 
      } else {
        socket.emit('pauseMedia', { currentTime: currentTime + 5, isPlaying });
      }
    }
  };

  /**
   * Handles the sync button click event.
   */
  const handleSync = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();

      if (isPlaying) {
        socket.emit('playMedia', { currentTime: currentTime, isPlaying });
      } else {
        socket.emit('pauseMedia', { currentTime: currentTime, isPlaying });
      }
    }
  };

  /**
   * Handles the duration change event.
   */
  const handleDuration = () => {
    const currentTime = playerRef.current.getCurrentTime();
    socket.emit('update-duration', { currentTime });
  };

  return (
    <div className="media-player">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={true}
        width={playerSize.width || '100%'}
        height={playerSize.height}
        onPause={handlePause}
        onPlay={handlePlay}
        onProgress={handleDuration}
        config={{
          youtube: {
            playerVars: { disablekb: 1, start: Math.ceil(time.currentTime)},
          },
        }}
      />
      <div className="media-title">
      <div className="title-text" style={{ width: `${titleWidth}px` }}> {title}</div>
        <div className='button-container'>
          <button className='rewind' onClick={handleRewind}>🞀🞀</button>
          <button className='skip' onClick={handleSkip}>🞂🞂</button>
          <button className='sync' onClick={handleSync}>👁⃤</button>
        </div>
      </div>
      <div className="chosen-by">{chosenBy}</div>
    </div>
);
};

export default MediaPlayer;
