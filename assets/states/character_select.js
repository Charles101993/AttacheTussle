var character_select = {
	
	init: function() {
		
		game.stage.disableVisibilityChange = true;
		
		player_char_counter = 0;
		var readyButton;
		var upButton;
		var downButton;
		var player_character;
		var opponent_character;
		player_ready = false;
	},
	
	preload: function() {
		
		game.load.spritesheet('ready_button', 'assets/ready_button.png', 150, 75);
		game.load.image('character_select_background', 'assets/character_select_background.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('down_arrow', 'assets/down_arrow_button.png', 50, 75);
		game.load.spritesheet('up_arrow', 'assets/up_arrow_button.png', 50, 75);
	},
	
	create: function() {
		
		game.add.sprite(0, 0, 'character_select_background');
		
		waitingButton = game.add.sprite(400, 500, 'ready_button', 2);
		waitingButton.anchor.setTo(0.5, 0.5);
		
		readyButton = this.game.add.button(400, 500, 'ready_button', this.playerReady, this, 1, 0, 1);
		readyButton.anchor.setTo(0.5, 0.5);
		
		if(playerID == 'player 1'){
			
			player_character = game.add.sprite(140,320, 'dude',0);
			player_character.animations.add('characters', [0,1,2,3,4,5]);
	
			downButton = this.game.add.button(150, 450, 'down_arrow', this.nextChar, this, 1, 0, 2);
			downButton.anchor.setTo(0.5, 0.5);
		
			upButton = this.game.add.button(150, 250, 'up_arrow', this.prevChar, this, 1, 0, 2);
			upButton.anchor.setTo(0.5, 0.5);
			
			opponent_character = game.add.sprite(640,320, 'dude',0);
		}
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
	
	nextChar: function(){
	
		player_char_counter--;
		
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter--;
			}
		}
		
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
	
	prevChar: function(){
	
		player_char_counter++;
		
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter++;
			}
		}
		
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
	
	playerReady: function() {
		
		readyButton.destroy();
		upButton.destroy();
		downButton.destroy();
		
		player_ready = true;
		
		socket.emit('player ready', player_ready);
	},
	
	update: function() {
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				prevChar();
			}
		}
		
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
		console.log('player: ' + player_ready);
		console.log('opponent: ' + opponent_ready);
		if(player_ready && opponent_ready){
			
			game.state.start('game');
		}
	}

}