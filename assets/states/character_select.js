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
		game.load.spritesheet('sample_character', 'assets/sample_character_sheet.png', 57.6, 65);
		game.load.spritesheet('down_arrow', 'assets/down_arrow_button.png', 50, 75);
		game.load.spritesheet('up_arrow', 'assets/up_arrow_button.png', 50, 75);
	},
	
	//create the screen that is sent to both clients
	create: function() {

		// Create a custom timer
        timer = game.time.create();
        
        // Create a delayed event 1m and 30s from now
        timerEvent = timer.add(Phaser.Timer.SECOND * 10, this.endTimer, this);
        
        // Start the timer
        timer.start();

		socket.once('opponent disconnect', character_select_disc = function(input){
			
 			socket.removeAllListeners();
 			game.state.start('start_menu');
 		});
		
		socket.once('opponent disconnect', character_select_disc = function(input){
			
			socket.removeAllListeners();
			game.state.start('start_menu');
		});
		
		socket.on('opponent character', opponent_char_func = function(input){
			opponent_char_counter = input;
		});
		
		socket.once('opponent ready', function(input){
			opponent_ready = input;
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter++;		
		
				//if the opponent has chosen their character, prevent player from choosing the same character
				if(opponent_ready){
					
					if(opponent_char_counter == player_char_counter){				
						player_char_counter++;
					}
				}
				
				//choose which sprite to display
				
				if(player_char_counter > 3) player_char_counter = 0;
				console.log(player_char_counter);
				switch(player_char_counter){
					case 0: player_character.frame = 0;
					   break;
					case 1: player_character.frame = 1;
					   break;
					case 2: player_character.frame = 2;
					   break;
					case 3: player_character.frame = 3;
			   		   break;
				}
				
				socket.emit('player character',player_char_counter);
			}
		});
		
	
		
		background = game.add.sprite(0, 0, 'character_select_background');
		background.scale.setTo(1.125,.75);
		
		waitingButton = game.add.sprite(400, 400, 'ready_button', 2);
		waitingButton.anchor.setTo(0.5, 0.5);
		
		readyButton = this.game.add.button(400, 400, 'ready_button', this.playerReady, this, 1, 0, 1);
		readyButton.anchor.setTo(0.5, 0.5);
		
		//if the client is assigned the ID player 1, load that clients assets
		if(playerID == 'player 1'){
			
			player_character = game.add.sprite(150,300, 'sample_character',0);
			player_character.anchor.setTo(0.5, 0.5);
			player_character.animations.add('characters', [0,1,2]);
	
			downButton = this.game.add.button(150, 400, 'down_arrow', this.nextChar, this, 1, 0, 2);
			downButton.anchor.setTo(0.5, 0.5);
		
			upButton = this.game.add.button(150, 200, 'up_arrow', this.prevChar, this, 1, 0, 2);
			upButton.anchor.setTo(0.5, 0.5);
			
			opponent_character = game.add.sprite(650,300, 'sample_character',0);
			opponent_character.anchor.setTo(0.5, 0.5);
		}
		
		//if the client is assigned the ID player 2, load that clients assets
		else if(playerID == 'player 2'){
			
			player_character = game.add.sprite(650,300, 'sample_character',0);
			player_character.anchor.setTo(0.5, 0.5);
			player_character.animations.add('characters', [0,1,2]);
	
			downButton = this.game.add.button(650, 400, 'down_arrow', this.prevChar, this, 1, 0, 2);
			downButton.anchor.setTo(0.5, 0.5);
		
			upButton = this.game.add.button(650, 200, 'up_arrow', this.nextChar, this, 1, 0, 2);
			upButton.anchor.setTo(0.5, 0.5);
			
			opponent_character = game.add.sprite(150,300, 'sample_character',0);
			opponent_character.anchor.setTo(0.5, 0.5);
		}
	
	},
	
	//called when the down button is pressed
	prevChar: function(){
	
		player_char_counter--;
		
		//if the opponent has chosen their character, prevent player from choosing the same character 
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter--;
			}
		}
		
		//choose which sprite to display
		
		if(player_char_counter < 0) player_char_counter = 3;
		console.log(player_char_counter);
		switch(player_char_counter){
			case 0: player_character.frame = 0;
			   break;
			case 1: player_character.frame = 1;
			   break;
			case 2: player_character.frame = 2;
			   break;
			case 3: player_character.frame = 3;
			   break;
		}
		
		socket.emit('player character',player_char_counter);
	},
	
	//called when the up button is pressed
	nextChar: function(){
	
		player_char_counter++;
		
		
		//if the opponent has chosen their character, prevent player from choosing the same character
		if(opponent_ready){
			
			if(opponent_char_counter == player_char_counter){				
				player_char_counter++;
			}
		}
		
		//choose which sprite to display
		
		if(player_char_counter > 3) player_char_counter = 0;
		console.log(player_char_counter);
		switch(player_char_counter){
			case 0: player_character.frame = 0;
			   break;
			case 1: player_character.frame = 1;
			   break;
			case 2: player_character.frame = 2;
			   break;
			case 3: player_character.frame = 3;
			   break;
		}
		
		socket.emit('player character',player_char_counter);
	},
	
	//called when the player presses the ready button
	playerReady: function() {
		
		camera_shutter.play();
		
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
		
		/* if(!menu_music.isPlaying){
			
			menu_music.resume();
		} */
		
		//if the opponent has chosen their character and the player is on the same character,
		//change players character so that the same character can't be picked
		
		//used to show players their opponents character
		switch(opponent_char_counter){
			case 0: opponent_character.frame = 0;
			   break;
			case 1: opponent_character.frame = 1;
			   break;
			case 2: opponent_character.frame = 2;
			   break;
			case 3: opponent_character.frame = 3;
			   break;
		}

		if(player_ready && opponent_ready){
			
			player_ready = false;
			opponent_ready = false;
			
			socket.removeListener('opponent character', opponent_char_func);
			
			game.state.start('game', false, true, player_char_counter, opponent_char_counter);
		}
	},
	render: function () {
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (timer.running) {
            game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 400, 225, "#fff");
        }
        else {
            game.debug.text("Done!", 400, 325, "#0f0");

        }
    },
    endTimer: function() {
        // Stop the timer when the delayed event triggers
        timer.stop();
        this.playerReady();
    },
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }

}
