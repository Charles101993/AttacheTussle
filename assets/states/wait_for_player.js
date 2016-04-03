var wait_for_player = { 
	
	//load the assets that are used in this state
	preload: function() {
		
		game.load.image('waiting_background', 'assets/waiting_background.png');
	},
	
	//create the screen that will be displayed to both clients
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		//menu_music = game.add.audio('menu_music');
		
		game.add.sprite(0, 0, 'waiting_background');
		
		//tell the server that the player is ready to play and assign them a player ID
		socket.emit('play', {message:'playerid'} );
		
		//when another player has been found, start the character selection state
		socket.once('opponent found', function(message){
			console.log(message);
			playerID = message;
			game.state.start('character_select', true, false);
		});
	},
	
	//if the menu music is not playing, play the song again
	update: function() {
		
		/* if(!menu_music.isPlaying){
			
			menu_music.play();
		} */
	}
}