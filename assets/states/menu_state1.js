//main menu game state
var menu_state1 = {
	
	create: function(){
		game.stage.disableVisibilityChange = true;
		
		socket.emit('play', {message:'playerid'} );
		
		socket.once('opponent found', function(message){
			console.log(message);
			game.state.start('game', true, false, message);
		});
	}
}