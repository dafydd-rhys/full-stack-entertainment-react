/**
 * Represents the HTTP parser class.
 */
class MediaParser {

  /**
   * Instance of MediaParser.
   * 
   * @param {string} socketId - The ID of the socket.
   * @param {object} io - The Socket.IO instance.
   */
  constructor(socketId, io) {
    this.socketId = socketId;
    this.io = io;
    this.socket = null;
  }

  /**
   * Parses the media URL and determines its source.
   * 
   * @param {string} URL - The URL of the media.
   * @param {object} socket - The socket object.
   */
  parse(URL, socket) {
      this.socket = socket;

      if (URL.includes("youtube.com")) {
        this.parseYouTubeVideo(URL);
      } else if (URL.includes("soundcloud.com")) {
        this.parseSoundCloudAudio(URL);
      } else if (URL.includes("twitch.tv")) {
        this.parseTwitchStream(URL);
      } else {
        this.parseFacebookVideo(URL);
      }
  }

  /**
   * Parses videos from Facebook.
   * 
   * @param {string} URL - The URL of the Facebook video.
   */
  parseFacebookVideo(URL) {
    const parts = URL.split('/');
    const videoID = parts[parts.length - 1];
    const page_access = "";

    // Make request to Facebook API
    fetch(`https://graph.facebook.com/${videoID}?fields=name&access_token=${page_access}`)
      .then(response => response.json())
      .then(data => {
        const videoName = data.name || videoID;
        this.createMediaObject(URL, videoName);
      })
      .catch(error => {
        console.error('Error fetching video information:', error);
        this.createMediaObject(URL, videoID);
      });
  }

  /**
   * Parses streams from Twitch.
   * 
   * @param {string} URL - The URL of the Twitch stream.
   */
  parseTwitchStream(URL) {
    const parts = URL.split('tv/');
    const username = parts[parts.length - 1];
    this.createMediaObject(URL, username);
  }

  /**
   * Parses audio from SoundCloud.
   * 
   * @param {string} URL - The URL of the SoundCloud audio.
   */
  parseSoundCloudAudio(URL) {
    const parts = URL.split('/');
    const lastPart = parts[parts.length - 1];

    let replacedTitle = "";
    if (lastPart.indexOf('?') === -1) {
      replacedTitle = lastPart.replace(/-/g, ' ');
    } else {
      const title = lastPart.substring(0, lastPart.indexOf('?'));
      replacedTitle = title.replace(/-/g, ' ');
    }

    this.createMediaObject(URL, replacedTitle);
  }

  /**
   * Parses videos from YouTube.
   * 
   * @param {string} URL - The URL of the YouTube video.
   */
  parseYouTubeVideo(URL) {
    // Pattern matching to get video ID
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = URL.match(regExp);
    const mediaId = (match && match[7].length === 11) ? match[7] : false;
    const ytApiKey = "AIzaSyC0I4k2Z9OuQR8_n70YT9tz1XPJYOJ-nXg";
    const request = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${mediaId}&key=${ytApiKey}`;

    // Make request to YouTube API
    fetch(request)
      .then(response => response.json())
      .then(data => {
        const videoTitle = data.items[0].snippet.title;
        this.createMediaObject(URL, videoTitle);
      })
      .catch(error => {
        console.error('Error fetching media details:', error);
      });
  }

  /**
   * Updates the server media object with the parsed one.
   * 
   * @param {string} URL - The URL of the media.
   * @param {string} title - The title of the media.
   */
  createMediaObject(URL, title) {
      let MediaState = {
          mediaURL: URL,
          mediaTitle: title,
          mediaChoser: 'Chosen by ' + this.socketId,
          currentTime: 0,
          playing: false
      };

      this.io.emit('updatedMedia', MediaState);
  }
}

module.exports = MediaParser;
