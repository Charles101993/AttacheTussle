var wait_for_player = {
	
	preload: function() {
		
		game.load.image('waiting_background', 'assets/waiting_background.png');
	},
	
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		game.add.sprite(0, 0, 'waiting_background');
		
		socket.emit('play', {message:'playerid'} );
		
		socket.once('opponent found', function(message){
			console.log(message);
			playerID = message;
			game.state.start('character_select', true, false);
		});
	}
}