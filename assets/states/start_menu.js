var start_menu = {
	
	//used to load assets that will be used in this state of the game
	preload: function(){
		
		game.load.spritesheet('play_button', 'assets/play_button.png', 200, 100);
		game.load.image('startbackground', 'assets/startbackground.png');
	},
	
	//creates the state that will be shown to both clients
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		game.add.sprite(0, 0, 'startbackground');
		
		//add audio to the start menu and play it
		//set loop to true so that the audio file will start over if the song ends
		menu_music = game.add.audio('menu_music');
		menu_music.loop = true;
		menu_music.play();
		
		//add the play button to the game
		//the 0, 1, and 2 are used to diplay a particular section of the sprite sheet so that the
		//user recieves feedback from the button
		var playButton = this.game.add.button(390, 325, 'play_button', this.playGame, this, 1, 0, 2);
		playButton.anchor.setTo(0.5, 0.5);
	},
	
	
	//when the play button is clicked this function is called
	//the next state will be called and sent to both clients
	playGame: function() {
		
		game.state.start('wait_for_player');
	},
	
	//update continually checks the clients for conditions listed within the function
	update: function() {
		
		//if the music is not playing, play the song again so that the audio never stops
		if(!menu_music.isPlaying){
			
			menu_music.play();
		}
	}
}


/* color codes

purple: 8726FF

yellow: FBFF16 */