//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(){
		console.log('game_state loaded');		
		
		var player, opponent;
		var platforms;
		var cursors;

		var score = 0;
		var scoreText;
		
		frame = false;
		
		collectStar = function(player, star){
	
			// Removes the star from the screen
			star.kill();

			//  Add and update the score
			score += 10;
			scoreText.text = 'Score: ' + score;
		}
		
		left = function(x,y){
			
			var client_packet = { 
			   input: 'left',
				    x: x,
				    y: y 
			}
											
			socket.emit('input', client_packet);
		}
		
		right = function(x,y){
			
			var client_packet = { 
			   input: 'right',
				    x: x,
				    y: y 
			}
											
			socket.emit('input', client_packet);
		}
		
		up = function(x,y){
			
			var client_packet = { 
			   input: 'up',
				    x: x,
				    y: y 
			}
											
			socket.emit('input', client_packet);
		}
		
		down = function(x,y){
			
			var client_packet = { 
			   input: 'down',
				    x: x,
				    y: y
			}
											
			socket.emit('input', client_packet);
		}
	},
	
	preload: function(){

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

	},
	
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		menu_music.destroy();
		
		game_music = game.add.audio('game_music');

		game_music.play();
		
		game_music.onLoop.add(function(){    game_music.play();},this);
	
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		game.add.sprite(0, 0, 'sky');

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 64, 'ground');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(2, 2);

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;

		ledge = platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;
		
		// The player and its settings
		if(playerID == 'player 1'){
			player = game.add.sprite(32, game.world.height - 113, 'dude');
			opponent = game.add.sprite(736, game.world.height - 113, 'dude');
		}
		else if(playerID == 'player 2'){
			opponent = game.add.sprite(32, game.world.height - 113, 'dude');
			player = game.add.sprite(736, game.world.height - 113, 'dude');
		}
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(opponent);

		//  The score
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		//  Player physics properties. Give the little guy a slight bounce.
		opponent.body.bounce.y = 0.2;
		opponent.body.gravity.y = 300;
		opponent.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		opponent.animations.add('left', [0, 1, 2, 3], 10, true);
		opponent.animations.add('right', [5, 6, 7, 8], 10, true);
		
	},
	
	update: function(){
		
		if(!game_music.isPlaying){
			
			game_music.play();
		}
		
		// skip every other frame
		if(!frame) {
			frame = true;
			return;
		}
			
		//  player -------------------------------------------------
		
		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, platforms);

		//  Reset the player's velocity (movement)
		player.body.velocity.x = 0;
		
		if (cursors.left.isDown)
		{
			left(player.x, player.y);
			
			//  Move to the left
			player.body.velocity.x = -150;

			player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			right(player.x, player.y);
			
			//  Move to the right
			player.body.velocity.x = 150;

			player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();

			player.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down)
		{
			up(player.x, player.y);

			player.body.velocity.y = -350;
		}
		
		//  opponent ------------------------------------------------
		
		//  Reset the opponent's velocity (movement)
		opponent.body.velocity.x = 0;	
		
		// sync opponent position
		if(opponent_packet.x != null && opponent_packet.y != null){
			if(opponent_packet.y > game.world.height - 113) opponent_packet.y = game.world.height - 112;
			
			opponent.x=opponent_packet.x;
			opponent.y=opponent_packet.y;
		}
		
		//  Collide the opponent with the platforms
		game.physics.arcade.collide(opponent, platforms);		
		
		if (opponent_packet.input == 'left')
		{
			//  Move to the left
			opponent.body.velocity.x = -150;

			opponent.animations.play('left');
		}
		else if (opponent_packet.input == 'right')
		{
			//  Move to the right
			opponent.body.velocity.x = 150;

			opponent.animations.play('right');
		}
		else
		{
			//  Stand still
			opponent.animations.stop();

			opponent.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (opponent_packet.input == 'up' && opponent.body.touching.down)
		{
			opponent.body.velocity.y = -350;
		}

		// reset opponent input
		opponent_packet.input = '';
		opponent_packet.x = null;
		opponent_packet.y = null;

	},
	
}