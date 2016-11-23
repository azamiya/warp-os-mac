navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var peer = new Adawarp();
var myID = null;
var call;

var localStream;
var connectedCall;

var myID;
var partnerID;

var socket = io.connect('localhost:4222');

window.onload = function(){
    displayMyCamera();
    peer.on('open', function(){
        document.getElementById("my-id").innerHTML = peer.id;
    });
    peer.login();
}

peer.on('connection', function(conn) {
    document.getElementById("partnerID").innerHTML = conn.peer;
    conn.on('data', function(data){
        document.getElementById("receive_message").innerHTML = data;
        socket.emit('servo', data);
    });
});

peer.on('call', function(call){
    connectedCall = call;
    call.answer(localStream);

    call.on('stream', function(stream){
        document.getElementById("partnerVideo").src = URL.createObjectURL(stream);
    });
});

function displayMyCamera(){
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        localStream = stream;
        document.getElementById("myVideo").src = URL.createObjectURL(stream);
    }, function() { alert("Error!"); });
}

function outputUpdate(vol) {
  document.querySelector('#volume').value = vol;
  socket.emit('servo', vol);
}