var game_end_state = {
	
	init: function(param1,param2,param3){
		game.stage.disableVisiblityChange = true;
		
		opponent_rematch = null;
		player_rematch = null;
		
		result = param1;
		player_score = param2;
		opponent_score = param3;
		mainMenuButton = null;
		rematchButton = null;
		
		mainMenu = function(){
			socket.emit('game end choice', 'main menu');
			game.state.start('start_menu');
		}
		rematch = function(){
			
			mainMenuButton.destroy();
			rematchButton.destroy();
			
			waitingButton = game.add.sprite(400, 500, 'ready_button', 2);
			waitingButton.anchor.setTo(0.5, 0.5);
			
			socket.emit('game end choice', 'rematch');
			if(opponent_rematch == true){
				music_start = true;
				game.state.start('character_select');
			}
			else
				player_rematch = true;
		}
	},
	
	preload: function(){
		game.load.image('background', 'assets/' + result + 'background.png');
		game.load.spritesheet('rematch', 'assets/rematch_button.png',150,75);
		game.load.spritesheet('main menu', 'assets/main_menu_button.png',150,75);
		game.load.spritesheet('ready_button', 'assets/ready_button.png', 150, 75);
	},
	
	create: function(){
		
		socket.once('rematch', function(input){
			opponent_rematch = input;
		});
		
		game.scale.setGameSize(800, 600);
		
		game_music.destroy();
		
		game.add.sprite(0,0,'background');
		
		mainMenuButton = game.add.button(100, 500, 'main menu', mainMenu, this, 1, 0, 2);
		mainMenuButton.anchor.setTo(0.5, 0.5);
		
		rematchButton = game.add.button(700, 500, 'rematch', rematch, this, 1, 0, 2);
		rematchButton.anchor.setTo(0.5, 0.5);
		
		socket.emit('play',playerID);
		
	},
	
	update: function(){
		if(opponent_rematch == false){
			socket.emit('game end choice', 'main menu');
			game.state.start('start_menu');
		}
		else if( (player_rematch == true) && (opponent_rematch == true) ){
			music_start = true;
			game.state.start('character_select');
		}
	}
}