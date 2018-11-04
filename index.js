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
  res.sendFile(__dirname + '/img/carte-nantes.png');
});

app.get('/splashsound', function(req, res){
  res.sendFile(__dirname + '/water_sound.wav');
});

app.get('/marteau', function(req, res){
  res.sendFile(__dirname + '/marteau.wav');
});


io.on('connection', function(socket){
  socket.on('buildingSize', function(msg){
    io.emit("buildingSize", msg);
  });
  socket.on('triggerBuilding', function(msg){
    io.emit("triggerBuilding", msg);
  });

  socket.on('triggerLoire', function(msg){
    io.emit("triggerLoire", msg);
  });

  socket.on('colorR', function(msg){
    io.emit("colorR", msg);
  });

  socket.on('colorV', function(msg){
    io.emit("colorV", msg);
  });

  socket.on('apocalypse', function(){
    io.emit("apocalypse");
  });

  socket.on('apocalypse2', function(){
    io.emit("apocalypse2");
  });

  socket.on('reload', function(){
    io.emit("reload");
  });



});

http.listen(3000, function(){
});
