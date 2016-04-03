var game_end_state = {
	
	init: function(param1,param2,param3){
		game.stage.disableVisiblityChange = true;
		
		result = param1;
		player_score = param2;
		opponent_score = param3;
		
		mainMenu = function(){
			socket.emit('game end choice', 'main menu');
			game.state.start('start_menu');
		}
		rematch = function(){
			socket.emit('game end choice', 'rematch');
			if(opponent_rematch == true){
				opponent_rematch = null;
				player_rematch = null;
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
	},
	
	create: function(){
		socket.once('rematch', function(input){
			opponent_rematch = input;
		});
		
		game.add.sprite(0,0,'background');
		game.add.button(100, 500, 'main menu', mainMenu, this, 1, 0, 2);
		game.add.button(700, 500, 'rematch', rematch, this, 1, 0, 2);
		socket.emit('play',playerID);
		
	},
	
	update: function(){
		if(opponent_rematch == false){
			opponent_rematch = null;
			player_rematch = null;
			game.state.start('start_menu');
		}
		else if( (player_rematch == true) && (opponent_rematch == true) ){
			opponent_rematch = null;
			player_rematch = null;
			game.state.start('character_select');
		}
	}
}