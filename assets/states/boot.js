var boot = {

	preload: function() {
	
		game.load.audio('menu_music', 'assets/menu_music.mp3');
		game.load.audio('game_music', 'assets/game_music.mp3');
		game.load.image('loadingbackground', 'assets/loadingbackground.png');
	},
	
	create: function() {
		
		game.add.sprite(0, 0, 'loadingbackground');
	},
	
	update: function() {
		
		if(this.cache.isSoundDecoded('menu_music')){
			
			game.state.start('start_menu');
		}
	}
}