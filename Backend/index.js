let express = require('express');
const users_routes = require('./routes/users')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const User = require('./models/users');


const app = express();

app.use(cookieParser());
app.use(cors());

mongoose.connect('mongodb://localhost/chatDB');
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use('/api', users_routes);

let server = app.listen(4001, function(){
    console.log('Listening to port 4000...')
});


let io = require('socket.io')(server);

// app.use(express.static('public'));

let connected_users_list = [];

io.on('connection', function(socket){
    console.log('type.....................', parseInt(socket.handshake.query.id), typeof socket.handshake.query.id);
    if(parseInt(socket.handshake.query.id) > 0){
        User.find({userId: socket.handshake.query.id}).then(function(user){
            setConnectedUsers(user);
            console.log('hhhhhhhhhhhhh', user);
        });
        // setConnectedUsers(user);
    }
    io.emit('get_connected_users', connected_users_list);
    socket.on('message', function(msg){
        io.emit('broadcast', msg);
        console.log('message: ', msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected...')
    });
});

function setConnectedUsers(user){
    console.log('ccccccccccccccccccccccccccc' , connected_users_list.find(x => x[0].userId == user[0].userId));
if(connected_users_list.filter(x => x[0].userId == user[0].userId).length < 1){
    connected_users_list.push(user);
}

console.log('setConnectedUsereeeeeeees>>>>>>>>>>>', connected_users_list)
}

module.exports.setConnectedUsers = setConnectedUsers;