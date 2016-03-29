var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
//app.use('/client',express.static(__dirname + '/client'));
app.use('/assets',express.static(__dirname + '/assets'));

serv.listen(10000);
console.log("Server started.");
 
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection');
 
    socket.on('Test',function(data){
        console.log(data.reason);
    });
   
    socket.emit('serverMsg',{
        msg:'left',
    });
   
});
 
 
