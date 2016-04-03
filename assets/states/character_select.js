var character_select = {
	
	//initialize variables as global for this state
	init: function() {
		
		console.log('character select');		
		game.stage.disableVisibilityChange = true;
		
		player_char_counter = 0;
		var readyButton;
		var upButton;
		var downButton;
		var player_character;
		var opponent_character;
		player_ready = false;
	},
	
	//load assets that are used in this state
	preload: function() {
		
		game.load.spritesheet('ready_button', 'assets/ready_button.png', 150, 75);
		game.load.image('character_select_background', 'assets/character_select_background.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('down_arrow', 'assets/down_arrow_button.png', 50, 75);
		game.load.spritesheet('up_arrow', 'assets/up_arrow_button.png', 50, 75);
	},
	
	//create the screen that is sent to both clients
	create: function() {
		
		game.add.sprite(0, 0, 'character_select_background');
		
		waitingButton = game.add.sprite(400, 500, 'ready_button', 2);
		waitingButton.anchor.setTo(0.5, 0.5);
		
		readyButton = this.game.add.button(400, 500, 'ready_button', this.playerReady, this, 1, 0, 1);
		readyButton.anchor.setTo(0.5, 0.5);
		
		//if the client is assigned the ID player 1, load that clients assets
		if(playerID == 'player 1'){
			
			player_character = game.add.sprite(140,320, 'dude',0);
			player_character.animations.add('characters', [0,1,2,3,4,5]);
	
			downButton = this.game.add.button(150, 450, 'down_arrow', this.nextChar, this, 1, 0, 2);
			downButton.anchor.setTo(0.5, 0.5);
		
			upButton = this.game.add.button(150, 250, 'up_arrow', this.prevChar, this, 1, 0, 2);
			upButton.anchor.setTo(0.5, 0.5);
			
			opponent_character = game.add.sprite(640,320, 'dude',0);
		}
		
		//if the client is assigned the ID player 2, load that clients assets
		else if(playerID == 'player 2'){
			
			player_character = game.add.sprite(640,320, 'dude',0);
			player_character.animations.add('characters', [0,1,2,3,4,5]);
	
			downButton = this.game.add.button(650, 450, 'down_arrow', this.nextChar, this, 1, 0, 2);
			downButton.anchor.setTo(0.5, 0.5);
		
			upButton = this.game.add.button(650, 250, 'up_arrow', this.prevChar, this, 1, 0, 2);
			upButton.anchor.setTo(0.5, 0.5);
			
			opponent_character = game.add.sprite(140,320, 'dude',0);
		}
	
	},
	
	//called when the down button is pressed
	nextChar: function(){
	
		player_char_counter--;
		
		//if the opponent has chosen their character, prevent player from choosing the same character 
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter--;
			}
		}
		
		//choose which sprite to display
		console.log(player_char_counter);
		if(player_char_counter < 0) player_char_counter = 3;
		
		switch(player_char_counter){
			case 0: player_character.frame = 0;
			   break;
			case 1: player_character.frame = 1;
			   break;
			case 2: player_character.frame = 4;
			   break;
			case 3: player_character.frame = 5;
			   break;
		}
		
		socket.emit('player character',player_char_counter);
	},
	
	//called when the up button is pressed
	prevChar: function(){
	
		player_char_counter++;
		
		
		//if the opponent has chosen their character, prevent player from choosing the same character
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter++;
			}
		}
		
		//choose which sprite to display
		console.log(player_char_counter);
		if(player_char_counter > 3) player_char_counter = 0;
		
		switch(player_char_counter){
			case 0: player_character.frame = 0;
			   break;
			case 1: player_character.frame = 1;
			   break;
			case 2: player_character.frame = 4;
			   break;
			case 3: player_character.frame = 5;
			   break;
		}
		
		socket.emit('player character',player_char_counter);
	},
	
	//called when the player presses the ready button
	playerReady: function() {
		
		//destory buttons so they can't change their character once ready
		readyButton.destroy();
		upButton.destroy();
		downButton.destroy();
		
		//let the server know that the player is ready
		player_ready = true;
		
		socket.emit('player ready', player_ready);
	},
	
	//if the menu music is not playing, play the song again
	update: function() {
		
		if(!menu_music.isPlaying){
			
			menu_music.play();
		}
		
		//if the opponent has chosen their character and the player is on the same character,
		//change players character so that the same character can't be picked
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				this.prevChar();
			}
		}
		
		//used to show players their opponents character
		switch(opponent_char_counter){
			case 0: opponent_character.frame = 0;
			   break;
			case 1: opponent_character.frame = 1;
			   break;
			case 2: opponent_character.frame = 4;
			   break;
			case 3: opponent_character.frame = 5;
			   break;
		}

		if(player_ready && opponent_ready){
			
			game.state.start('game');
		}
	}

}