var boot = {
	
	//allows both clients to be updated if you are focused on a different tab or window
	init: function(){
		game.stage.disableVisibilityChange = true;
		game.scale.pageAlignHorizontally = true;
	},
	
	//loads music assets so they can be read in before they are used in later states
	preload: function() {
	
		game.load.audio('menu_music', 'assets/menu_music.mp3');
		game.load.audio('game_music', 'assets/game_music.mp3');
		game.load.audio('butt_bump_sound', 'assets/butt_bump.mp3');
		game.load.audio('camera_shutter', 'assets/camera_shutter.mp3');
		game.load.audio('crowd_gasp', 'assets/crowd_gasp.mp3');
		game.load.audio('oh_yeah', 'assets/oh_yeah.mp3');
		game.load.audio('whoosh', 'assets/whoosh.mp3');
		game.load.image('loadingbackground', 'assets/loadingbackground.png');
	},
	
	//adds the loading screen to the background while the audio files are loaded
	create: function() {
		
		game.add.sprite(0, 0, 'loadingbackground');
	},
	
	//when the menu music audio file is decoded the clients will be sent to the start state
	update: function() {
		
		if(this.cache.isSoundDecoded('menu_music') && this.cache.isSoundDecoded('camera_shutter')){
			
			game.state.start('start_menu');
		}
	}
}