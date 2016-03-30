var express = require('express');var app = express();var serv = require('http').Server(app); app.get('/',function(req, res) {    res.sendFile(__dirname + '/index.html');});app.use('/assets',express.static(__dirname + '/assets'));serv.listen(10000);console.log("Server started."); var SOCKET_LIST = [];var READY_QUEUE = [];var io = require('socket.io')(serv,{});io.sockets.on('connection', function(socket){    console.log('socket connection');		SOCKET_LIST.push(socket);		socket.on('play', function(data){		console.log('player ready');				READY_QUEUE.push(socket);				if(READY_QUEUE.length > 1){			console.log('match found');						player1 = READY_QUEUE.shift();			player2 = READY_QUEUE.shift();						// notify clients that an opponent was found			player1.emit('opponent found', 'player 1');			player2.emit('opponent found', 'player 2');			player1.on('input', function(input){				player2.emit('opponent input', input);			});						player2.on('input', function(input){				player1.emit('opponent input', input);			});		}			});	});