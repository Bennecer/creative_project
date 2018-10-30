var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/control', function(req, res){
  res.sendFile(__dirname + '/control.html');
});

app.get('/carteNantes', function(req, res){
  res.sendFile(__dirname + '/carte-nantes.png');
});


io.on('connection', function(socket){
    socket.on('buildingSize', function(msg){
	     io.emit("buildingSize", msg);
    });
});

http.listen(3000, function(){
});
