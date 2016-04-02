var start_menu = {
	
	preload: function(){
		
		game.load.spritesheet('play_button', 'assets/play_button.png', 200, 100);
		game.load.image('startbackground', 'assets/startbackground.png');
	},
	
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		game.add.sprite(0, 0, 'startbackground');
		
		menu_music = game.add.audio('menu_music');
		menu_music.play();
		
		var playButton = this.game.add.button(390, 325, 'play_button', this.playGame, this, 1, 0, 2);
		playButton.anchor.setTo(0.5, 0.5);
	},
	
	playGame: function() {
		
		game.state.start('wait_for_player');
	}
}


/* color codes

purple: 8726FF

yellow: FBFF16 */