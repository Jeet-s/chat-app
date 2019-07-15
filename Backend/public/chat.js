let socket = io.connect('http://localhost:4000');

let msg_field = document.getElementById('msg');
let btn = document.getElementById('send-btn');
let output = document.getElementById('output');

btn.addEventListener('click', function(){
    if (msg_field.value !== ''){
        socket.emit('message', msg_field.value);
    }
});

socket.on('broadcast-msg', function(msg){
    console.log('received');
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    output.appendChild(li);
});