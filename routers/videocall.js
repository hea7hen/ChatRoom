const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Redirect to a new unique room
// Assuming you are using express and your app is set up to listen on port 3000
app.get('/videocall', (req, res) => {
    res.redirect(`/${uuidV4()}`);  // Redirects to a new UUID room
});

app.get('/videocall/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });  // Make sure the 'room' view exists
});


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(4000, () => console.log('Video call app running on port 4000'));
