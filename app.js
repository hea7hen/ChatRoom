const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const socket = require("socket.io");
const app = express();
app.use(express.static('public'));
const LoginRouter = require("./routers/loginRouter");
const RegisterRouter = require("./routers/RegisterRouter");
const chatRouter = require("./routers/chatRouter");
const Logout = require("./routers/logoutRouter");


const dbUrl =
  "mongodb+srv://abhi:nXkuENwUKYmyxFh2@cluster0.djk7ffg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected"));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "ChatV2", resave: false, saveUninitialized: true }));

const io = socket(app.listen(3000));

const images = []; // This could be replaced with a database for persistence

io.on("connection", (socket) => {
    console.log(socket.id + " a user connected");
    
    // On connection, send all images to the newly connected client
    images.forEach(image => {
        socket.emit('update-album', image);
    });

    socket.on('share-image', (data) => {
        images.push(data); // Store the image in the array
        io.emit('update-album', data); // Update all clients with the new image
    });
});




app.use(LoginRouter);
app.use(RegisterRouter);
app.use(chatRouter);
app.use(Logout);

app.use(function (req, res) {
  res.status(404).end("404 NOT FOUND");
});
