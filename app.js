//*******************************************************              NICKS CODE              *******************************************

//Initialize and connect to MongoDB for the database
/* 
var MongoClient = require('mongodb').MongoClient;
var MongoURI = "mongodb://charles101993:5138008cB5138008cB@jello.modulusmongo.net:27017/i6Dyzuqy";
var db;


//Right way to connect (once then re-use the object) but gives an error
MongoClient.connect(MongoURI, function (err, database) {
	if(err) throw err;
	db = database;
	
});

function display_all_users(){
	db.collection('users').find({},{email: 1, _id: 0}).toArray(function (err, result) {
		if (err) throw err;
		console.log(result);
	});	
}

function add_user(email){
	//bad way to connect (in every function) but doesnt give an error
	MongoClient.connect(MongoURI, function (err, db) {
		if (err) throw err
	        db.collection('users').insert({
			email: email,
			c4_unlocked: 0,
			Wins: 0,
			Losses: 0,
			Total_Taunts: 0,	
		});
	});
}

function email_available(email){
	//bad way to connect (in every function) but doesnt give an error
	var returnbool = true;
	MongoClient.connect(MongoURI, function (err, db) {
		if (err) throw err
	        db.collection('users').find({email},{email: 1, _id: 0}).toArray(function (err, result) {
			if (err) throw err
			console.log("Number of users named " + email + ": " + result.length);
			if(result.length = 0) returnbool = true;
			else                  returnbool = false;
	  	})
	});
	return returnbool;

}

function remove_users(){	//THIS WILL DELETE THE ENTIRE TABLE USE FOR ONLY TESTING PUPROSES
	//bad way to connect (in every function) but doesnt give an error
	MongoClient.connect(MongoURI, function (err, db) {
		if (err) throw err
	        db.collection('users').remove({});
	});
}


function try_user(email){
	if(email_available(email)){
		console.log(email + " is avaialable.");
		add_user(email);
	}
	else{	
		console.log(email + " is not avaialable.");
	}
	
}

if(0) {
	console.log("Removing users.");
	remove_users();
}
if(1){
	try_user("test@gmail.com");
}
if(0){
	add_user("test@gmail.com");
}
display_all_users();
 */

//*******************************************************       END OF NICKS CODE              *******************************************


var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/assets',express.static(__dirname + '/assets'));

serv.listen(process.env.PORT || 10002); //process.env.PORT || 
console.log("> Server started...\n");
 
var io = require('socket.io')(serv,{}); 
 
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
			
			player1.once('disconnect', function(){
				console.log('> player ' + player2.id + ' wins by opponent disconnect\n');
				player2.emit('opponent disconnect', null);
				player2.removeAllListeners();
				processRequest(player2);
			});
			player2.once('disconnect', function(){
				console.log('> player ' + player1.id + ' wins by opponent disconnect\n');
				player1.emit('opponent disconnect', null);
				player1.removeAllListeners();
				processRequest(player1);
			});
			
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

io.sockets.on('connection', function(socket){
	
	// generate id for socket
	socket.id = Math.floor(Math.random() * (1000 - 0) + 0);
    console.log( '> player ' + socket.id + ' has connected\n');
	
	SOCKET_LIST[socket.id] = socket;

	socket.once('disconnect', function(){
		console.log('> player ' + socket.id + ' has disconnected\n');
		delete SOCKET_LIST[socket.id];
		var index = READY_QUEUE.indexOf(socket);
		if (index > -1) { 
			READY_QUEUE.splice(index,1);
		}
	});
	
	// begin serving client
	processRequest(socket);	
	
});
