//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(param){
		
		var player1, player2;
		var platforms;
		var cursors;

		var score = 0;
		var scoreText;

		playerID = param;
		
		collectStar = function(player, star){
	
			// Removes the star from the screen
			star.kill();

			//  Add and update the score
			score += 10;
			scoreText.text = 'Score: ' + score;
		}
	},
	
	preload: function(){

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

	},
	
	create: function(){
		
		game.stage.disableVisibilityChange = true;
	
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
			player1 = game.add.sprite(32, game.world.height - 113, 'dude');
			player2 = game.add.sprite(736, game.world.height - 113, 'dude');
		}
		else if(playerID == 'player 2'){
			player1 = game.add.sprite(736, game.world.height - 113, 'dude');
			player2 = game.add.sprite(32, game.world.height - 113, 'dude');
		}
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(player1);
		game.physics.arcade.enable(player2);

		//  The score
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
		//  Player physics properties. Give the little guy a slight bounce.
		player1.body.bounce.y = 0.2;
		player1.body.gravity.y = 300;
		player1.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		player1.animations.add('left', [0, 1, 2, 3], 10, true);
		player1.animations.add('right', [5, 6, 7, 8], 10, true);
		
		//  Player physics properties. Give the little guy a slight bounce.
		player2.body.bounce.y = 0.2;
		player2.body.gravity.y = 300;
		player2.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		player2.animations.add('left', [0, 1, 2, 3], 10, true);
		player2.animations.add('right', [5, 6, 7, 8], 10, true);
		
	},
	
	update: function(){
		
		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player1, platforms);
		game.physics.arcade.collide(player2, platforms);

		//  Reset the players velocity (movement)
		player1.body.velocity.x = 0;
		player2.body.velocity.x = 0;

		if (cursors.left.isDown)
		{
			socket.emit('input','left');
			//  Move to the left
			player1.body.velocity.x = -150;

			player1.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			socket.emit('input','right');
			//  Move to the right
			player1.body.velocity.x = 150;

			player1.animations.play('right');
		}
		else
		{
			//  Stand still
			player1.animations.stop();

			player1.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player1.body.touching.down)
		{
			socket.emit('input','up');
			player1.body.velocity.y = -350;
		}
		
		//  Player 2		
		if (player2_input == 'left')
		{
			//  Move to the left
			player2.body.velocity.x = -150;

			player2.animations.play('left');
		}
		else if (player2_input == 'right')
		{
			//  Move to the right
			player2.body.velocity.x = 150;

			player2.animations.play('right');
		}
		else
		{
			//  Stand still
			player2.animations.stop();

			player2.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (player2_input == 'up' && player2.body.touching.down)
		{
			player2.body.velocity.y = -350;
		}
		
		// reset player2 input
		player2_input = null;

	},
	
}