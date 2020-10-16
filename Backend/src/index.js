const path = require('path');
let express = require('express');
const users_routes = require('../routes/users')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const User = require('../models/users');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
let io = socketio(server);

app.use(cookieParser());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/chatDB', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use('/api', users_routes);


const port = process.env.PORT || 4001;

server.listen(port, () => {
    console.log('Listening on port:', port);
})

let connected_users_list = [];

io.on('connection', async (socket) => {
    socket.on('message', function (msg) {
        io.emit('broadcast', msg);
    });

    socket.on('disconnect', function () {
        io.emit('get_connected_users', connected_users_list);
    });

    const user = await User.findById(socket.handshake.query._id);
    setConnectedUsers(user);

    io.emit('get_connected_users', connected_users_list);
});

function setConnectedUsers(user) {
    if (connected_users_list.findIndex(x => x._id == user._id) < 0) {
        connected_users_list.push(user);
    }
}

module.exports.setConnectedUsers = setConnectedUsers;