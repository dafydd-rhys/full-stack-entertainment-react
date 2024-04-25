/**
 * Module dependencies.
 */
const io = require('socket.io')(4, {
    cors: {
        origin: ['http://localhost:3000', 'http://192.168.0.12:3000']
    }
});

const MediaParser = require('./MediaParser');

/**
 * List of user colors.
 */
const userColors = {};

/**
 * List of connected users.
 */
const connectedUsers = {}; 

/**
 * Available colors for users.
 */
const availableColors = ['#FF0000', '#FFA500', '#FFFF00', '#7FFFD4', '#0000FF', '#800080', '#FFC0CB'];

/**
 * Assigns a color to a user.
 * 
 * @param {SocketIO.Socket} socket - The socket of the user.
 * @returns {string} The assigned color.
 */
function assignColor(socket) {
    if (!userColors[socket.id]) {
        const nextColor = availableColors[Object.keys(userColors).length % availableColors.length];
        userColors[socket.id] = nextColor;
    }

    return userColors[socket.id];
}

/**
 * Represents the current media.
 */
let mediaL = {
    mediaURL: 'https://www.youtube.com/watch?v=nnD8FKXzIGs',
    mediaTitle: `"Yer a wizard, Harry" | Harry Potter and the Philosopher's Stone`,
    mediaChoser: 'Thanks for using FullStackEntertainment!',
    currentTime: 0,
    playing: false
};

/**
 * Handles socket connections.
 */
io.on('connection', socket => {
    const userColor = assignColor(socket);
    io.emit("receive-message", { user: `${socket.id}`, message: ` joined. 🎉🎉🎉`, color: userColor, videoTime: mediaL.currentTime });
    socket.emit('updatedMedia', mediaL);

    connectedUsers[socket.id] = {
        id: socket.id,
        color: userColor
    };

    io.emit('updatedUsers', Object.values(connectedUsers));

    socket.on('send-socket-id', (socketName) => {
        if (!connectedUsers[socketName]) {
            const old = socket.id
            connectedUsers[socketName] = connectedUsers[socket.id];
            delete connectedUsers[socket.id];

            socket.id = socketName;
            io.emit('recieve-id', socketName); 
            io.emit('receive-message', { user: socketName, message: `${old} changed there nickname to ${socketName}`, color: userColor, mediaTime: mediaL.currentTime });
        } else {
            socket.emit('receive-message', { user: socket.id, message: `${socket.id} tried to change there nickname to ${socketName} but it's already in use`, color: userColor, mediaTime: mediaL.currentTime });
        }
    })

    const mediaParser = new MediaParser(socket.id, io);

    socket.on('parseMedia', ({ URL }) => {
        mediaParser.parse(URL, socket);
    });

    socket.on('requestMedia', () => {
        socket.emit('updatedMedia', mediaL);
    });

    socket.on('newMedia', (media) => {
        mediaL = media;
    });
    
    socket.on('playMedia', (data) => {
        mediaL.currentTime = data.currentTime;
        mediaL.playing = true;
        io.emit('playMedia', data);
    });

    socket.on('pauseMedia', (data) => {
        mediaL.currentTime = data.currentTime;
        mediaL.playing = false;
        io.emit('pauseMedia', data);
    })

    socket.on('update-duration', (cTime) => {
        mediaL.currentTime = cTime;
    });

    socket.on("send-message", (message) => {
        io.emit("receive-message", { user: `${socket.id}`, message: `${message}`, color: userColor, mediaTime: mediaL.currentTime });
    });

    socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
        io.emit("receive-message", { user: `${socket.id}`, message: ` left. 🥺🥺🥺`, color: userColor, mediaTime: mediaL.currentTime });

        delete userColors[socket.id];
        io.emit('updatedUsers', Object.values(connectedUsers));
    });
});
