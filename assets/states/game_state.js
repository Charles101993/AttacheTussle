//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(param){
		console.log('game_state loaded');		
		
		var player, opponent;
		var platforms;
		var cursors;

		score = 0;
		var scoreText;
		
		frame = false;

		playerID = param;
		
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
		l_dash = function(){
			var client_packet = {
				input: 'l_dash'
			}
		
			socket.emit('input', client_packet);
		}
		r_dash = function(){
			var client_packet = {
				input: 'r_dash'
			}
		
			socket.emit('input', client_packet);
		}
		emit_purse_swap = function(){	
			var client_packet = { 
			   input: 'swap'
			}
			socket.emit('input', client_packet);
		}
		emit_taunt = function(){	
			var client_packet = { 
			   input: 'taunt'
			}
			socket.emit('input', client_packet);
		}
		can_move = true;
		dash_count = 0;

	
	},
	
	preload: function(){

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.spritesheet('dude', 'assets/dude.png', 45.1, 74);
		game.load.spritesheet('dude_no_purse', 'assets/dude_no_purse.png', 45.1, 74);
		game.load.spritesheet('purse', 'assets/purse.png', 43, 50);
	},
	
	create: function(){
		
		game.stage.disableVisibilityChange = true;
		
		game.scale.setGameSize(800, 800);
		
		menu_music.pause();
		
		game_music = game.add.audio('game_music');
		game_music.loop = true;
		game_music.play();
	
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		game.add.sprite(0, 0, 'sky');
		purse = game.add.sprite(300, game.world.height - 500, 'purse');

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 53, 'ground');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(2, 2);

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = platforms.create(570, 328, 'ground');
		ledge.body.immovable = true;

		ledge = platforms.create(-185, 330, 'ground');
		ledge.body.immovable = true;

		ledge = platforms.create(240, 486, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.75, 1);

		ledge = platforms.create(130, 180, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(1.28 , .9);

		ledge = platforms.create(65, 704, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(1.55, 1.4);
		
		// The player and its settings
		if(playerID == 'player 1'){
			player = game.add.sprite(32, game.world.height - 150, 'dude_no_purse');
			opponent = game.add.sprite(736, game.world.height - 150, 'dude_no_purse');
		}
		else if(playerID == 'player 2'){
			opponent = game.add.sprite(32, game.world.height - 150, 'dude_no_purse');
			player = game.add.sprite(736, game.world.height - 150, 'dude_no_purse');
		}
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(opponent);
		game.physics.arcade.enable(purse);

		//  The score
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
		//  Player physics properties. Give the little guy a slight bounce.

//		player.body.bounce.y = 0.2;
		player.body.gravity.y = 450;
		player.body.collideWorldBounds = true;
		purse.body.collideWorldBounds = true;

		purse.body.gravity.y = 250;

		//  Our two animations, walking left and right.
		player.animations.add('right', [0, 1, 2], 10, true);
		player.animations.add('left', [4, 5, 6], 10, true);
		player.animations.add('l_ass', [7], 10, true);
		player.animations.add('r_ass', [8], 10, true);
		player.animations.add('taunt', [7,8,9,8], 1, true);

		//  Player physics properties. Give the little guy a slight bounce.
//		opponent.body.bounce.y = 0.2;
		opponent.body.gravity.y = 450;
		opponent.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		opponent.animations.add('right', [0, 1, 2], 10, true);
		opponent.animations.add('left', [4, 5, 6], 10, true);
		opponent.animations.add('l_ass', [7], 10, true);
		opponent.animations.add('r_ass', [8], 10, true);
		opponent.animations.add('taunt', [7,8,9,8], 1, true);

		a_key = game.input.keyboard.addKey(Phaser.Keyboard.A);
		d_key = game.input.keyboard.addKey(Phaser.Keyboard.D);
		s_key = game.input.keyboard.addKey(Phaser.Keyboard.S);
		timer = game.time.create(false);
		dash = true;

		enable_dash = function(){
			player.dash = true;
		}
		disable_dash = function(){
			player.dash = false;
			game.time.events.add(Phaser.Timer.SECOND * 3, enable_dash, this);
		}
		start_taunt_1 = function(p_or_o){
			p_or_o.frame = 7;
			game.time.events.add(Phaser.Timer.QUARTER * 2, start_taunt_2, this, p_or_o);
		}
		start_taunt_2 = function(p_or_o){
			p_or_o.frame = 8;
			game.time.events.add(Phaser.Timer.QUARTER * 2, start_taunt_3, this, p_or_o);
		}
		start_taunt_3 = function(p_or_o){
			p_or_o.frame = 9;
			game.time.events.add(Phaser.Timer.QUARTER * 2, start_taunt_4, this, p_or_o);
		}
		start_taunt_4 = function(p_or_o){
			p_or_o.frame = 8;
			game.time.events.add(Phaser.Timer.QUARTER * 2, stop_taunt, this);
			score += 1;
			scoreText.text = 'Score: ' + score;

		}
		stop_taunt = function(){
			can_move = true;
		}
		player.purse = false;
		opponent.purse = false;
		player.dash = true;
		
	},
	
	update: function(){
		
		if(!game_music.isPlaying == false){
			
			game_music.play();
		}
		
		// skip every other frame
		if(!frame) {
			frame = true;
			return;
		}
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(purse, platforms);
		player.body.velocity.x = 0;
		player_collide = game.physics.arcade.overlap(player, opponent, null, null, this);
		purse_collide = game.physics.arcade.overlap(player, purse, null, null, this);
		opponent_collide = game.physics.arcade.overlap(purse, opponent, null, null, this);
		
		if(purse_collide){
			purse.destroy();
			player.purse = true;
			player.loadTexture('dude',0,true);
		}
		if(opponent_collide){
			purse.destroy();
			opponent.purse = true;
			opponent.loadTexture('dude',0,true);
		}
		if(can_move == true){
			if(s_key.isDown && player.purse == true){
				player.animations.stop();
				can_move = false;
				start_taunt_1(player);
				emit_taunt();			
			}
			else if(a_key.isDown && player.dash == true){
				l_dash();
				player.body.velocity.x = -400;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if(d_key.isDown && player.dash == true){
				r_dash();
				player.body.velocity.x = 400;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if(s_key.isDown && player_collide && player.purse == false && opponent.purse == true){
				emit_purse_swap();
				player.animations.play('l_ass');
				player.purse = true;
				opponent.purse = false;
				player.loadTexture('dude', 0, false);
				opponent.loadTexture('dude_no_purse', 0, false);				
			}
			else if (cursors.left.isDown)
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
			else if (cursors.up.isDown && player.body.touching.down)
			{
				up(player.x, player.y);
				player.body.velocity.y = -460;
			}
			else
			{
				player.animations.stop();
			}
		}


		//  opponent ------------------------------------------------------------------------------------------------		
		//  Reset the opponent's velocity (movement)
		//opponent.body.velocity.x = 0;	
		
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
		else if (opponent_packet.input == 'swap')
		{
			player.purse = false;
			opponent.purse = true;
			player.loadTexture('dude_no_purse', 0, false);
			opponent.loadTexture('dude', 0, false);
		}
		else if (opponent_packet.input == 'taunt')
		{
			start_taunt_1(opponent);
		}
		else if (opponent_packet.input == 'l_dash')
		{
			opponent.body.velocity.x = -400;
			if(dash_count > 4){
				dash_count = 0;
			}
		}
		else if (opponent_packet.input == 'r_dash')
		{
			if(dash_count > 4){
				dash_count = 0;
			}
			opponent.body.velocity.x = 400;
		}
		else
		{
			//  Stand still
			opponent.animations.stop();
			opponent.body.velocity.x = 0;
			//opponent.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (opponent_packet.input == 'up' && opponent.body.touching.down)
		{
			opponent.body.velocity.y = -460;
		}

		// reset opponent input
		if(dash_count >= 4){
			opponent_packet.input = '';
		}
		dash_count += 1;

		opponent_packet.x = null;
		opponent_packet.y = null;

	},

}