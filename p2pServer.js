var port = process.env.PORT || 8080
var express = require('express')
var app = express()
var server = require('http').Server(app)
var p2pserver = require('socket.io-p2p-server').Server
var io = require('socket.io')(server)
var p2pclients = require('socket.io-p2p-server').clients

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var debug = require('debug')
var hat = require('hat')
app.use(express.static(__dirname+'/public'))

app.use('/assets',express.static(__dirname + '/assets'));
app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use('/node_modules',express.static(__dirname + '/node_modules'));


var rooms = []
var clients = {}

server.listen(port, function() {
  console.log("Server started port: %s", port);
});

function findOrCreateRoom () {
  var lastRoom = findReadyRoom ()
  if (!lastRoom || lastRoom.full) {
    var room = {players: [], playerCount: 0, name: hat()}
    return addRoom(room)
  }
  return lastRoom
}

function findReadyRoom () {
  return rooms.filter(function(room) { return room.playerCount === 1 })[0];
}

function removeRoom (room) {
  room.playerCount--
  if (room.playerCount === 0) rooms.splice(rooms.indexOf(room), 1)
}

function addRoom (room) {
  return rooms[rooms.push(room) - 1]
}

 // list of sockets mapped to generated id
var SOCKET_LIST = {};

 // queue of players ready to be matched
var READY_QUEUE = [];

// called when new client connects to server and when player heads back to main menu 
var processRequest = function(socket){
	console.log('> serving player ' + socket.id + '\n');	
	
	socket.once('play', function(data){
		console.log('> player ' + socket.id + ' searching for match');
		
		READY_QUEUE.push(socket);
		console.log('> ready queue: ' + READY_QUEUE.length + '\n');


		
		if(READY_QUEUE.length > 1){
			
			var player1 = READY_QUEUE.shift();
			var player2 = READY_QUEUE.shift();

			var room = {players: [player1, player2], playerCount: 2, name: hat()}
			player1.join(room.name);
			player2.join(room.name);
			rooms.push(room);
			
			p2pserver(player1, null, room);
			p2pserver(player2, null, room);
			console.log('> match found for player ' + player1.id + ' and ' + player2.id);

			console.log('> ready queue: ' + READY_QUEUE.length + '\n');
			
			// notify clients that an opponent was found
			player1.emit('opponent found', 'player 1');
			player2.emit('opponent found', 'player 2');
			
			processSession(player1,player2);
			
		}		
	});
}

// processes a session between two players
// called when a match between two players is found
var processSession = function(player1,player2){

	var player1_ready = false;
	var player2_ready = false;
	
	console.log('> serving session for player ' + player1.id + ' and player ' + player2.id + '\n');
	
	player1.on('player character', player1_char_call = function(player_char_counter){
		player2.emit('opponent character', player_char_counter);
	});
	
	player2.on('player character', player2_char_call = function(player_char_counter){	
		player1.emit('opponent character', player_char_counter);
	});
	
	player1.once('player ready', function(player_ready){
		console.log('> player ' + player1.id + ' ready\n');
		
		// remove character_select listeners
		player1.removeListener('player character', player1_char_call);
		
		player2.emit('opponent ready', player_ready);	
		
		player1_ready = true;
		
		if(player2_ready){
			console.log('> match between player ' + player1.id + ' and player ' + player2.id + ' has begun\n');
		}	
	});
	
	player2.once('player ready', function(player_ready){
		console.log('> player ' + player2.id + ' ready\n');
		
		// remove character_select listeners
		player2.removeListener('player character', player2_char_call);
		
		player1.emit('opponent ready', player_ready);

		player2_ready = true;
		
		if(player1_ready){
			console.log('> match between player ' + player1.id + ' and player ' + player2.id + 'has begun\n');
		}		
	});
	
	
	
	var game_end = false;
	player1.once('disconnect', function(){
		player2.emit('opponent input', { input: 'disconnected'});
		player1.removeListener('purse swap', player2_purse_swap);
		player1.removeListener('input', player2_input);
	});
	player2.once('disconnect', function(){
		player1.emit('opponent input', { input: 'disconnected'});
		player2.removeListener('purse swap', player2_purse_swap);
		player2.removeListener('input', player2_input);		
	});
	
	
	player1.on('input', player1_input = function(input){
		player2.emit('opponent input', input);
	});
	
	player2.on('input', player2_input = function(input){
		player1.emit('opponent input', input);
	});

	player1.on('purse swap', player1_purse_swap = function(input){
		player2.emit('purse swap', true);
	});
	
	player2.on('purse swap', player2_purse_swap = function(input){
		player1.emit('purse swap', true);
	});
	
	player1.once('game end', function(input){
		
		if(!game_end){
			console.log('> match between player ' + player1.id + ' and player ' + player2.id + ' has ended\n');
		}
		
		game_end = true;
		
		// remove game input listeners
		player1.removeListener('purse swap', player1_purse_swap);
		player1.removeListener('input', player1_input);
	});
	
	player2.once('game end', function(input){
		
		if(!game_end){
			console.log('> match between player ' + player1.id + ' and player ' + player2.id + ' has ended\n');
		}
		
		game_end = true;
		
		// remove game input listeners
		player2.removeListener('purse swap', player2_purse_swap);
		player2.removeListener('input', player2_input);
	});


	
	// do nothing until game end
	//while(!game_end);
	
	var player1_rematch = null;
	var player2_rematch = null;	
	
	player1.once('game end choice', game_end_func = function(input){
		if(input == 'main menu'){	
			console.log('> player ' + player1.id + ' went back to the main menu\n');
			
			processRequest(player1);
			
			// if other player waiting for rematch serve for main menu instead
			if(player2_rematch == true){
				processRequest(player2);
			}	
			
			player2.emit('rematch', false);
			player1_rematch = false;
		}					
		else{		
			console.log('> player ' + player1.id + ' requested a rematch\n');
			
			player1_rematch = true;
			player2.emit('rematch', true);
			
			// if both players want a rematch process a session between them
			if(player2_rematch == true){
				processSession(player1,player2);
			}
		}
	});
	
	player2.once('game end choice', game_end_func = function(input){
		if(input == 'main menu'){
			console.log('> player ' + player2.id + ' went back to the main menu\n');
			
			processRequest(player2);
			
			// if other player waiting for rematch serve for main menu instead
			if(player1_rematch == true){
				processRequest(player1);
			}
			
			player1.emit('rematch', false);
			player2_rematch = false;
		}					
		else{
			console.log('> player ' + player2.id + ' requested a rematch\n');
			
			player2_rematch = true;
			player1.emit('rematch', true);
			
			// if both players want a rematch process a session between them
			if(player1_rematch == true){
				processSession(player1,player2);
			}
		}
	});
	
}

if(io.use(p2pserver)){
	console.log('connected using websockets');
}

io.on('connection', function(socket){
	// generate id for socket
	socket.id = Math.floor(Math.random() * (1000 - 0) + 0);
    console.log( '> player ' + socket.id + ' has connected\n');
	
	SOCKET_LIST[socket.id] = socket;
	// begin serving client
	processRequest(socket);	

	
});
