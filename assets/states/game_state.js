//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(){
		console.log('game_state loaded');		
		
		var player;
		var opponent;
		var platforms;
		var cursors;

		player_score = 0;
		opponent_score = 0;
		var player_score_text;
		var opponent_score_text;
		
		frame = false;
		
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
			socket.emit('purse swap', playerID);
		}
		emit_taunt = function(){	
			var client_packet = { 
			   input: 'taunt'
			}
			socket.emit('input', client_packet);
		}
		emit_ass_l = function(x, y){
			var client_packet = {
			   input: 'ass_l',
			   x: x,
			   y: y
			}
			socket.emit('input', client_packet);
		}
		emit_ass_r = function(x, y){	
			var client_packet = { 
			   input: 'ass_r',
			   x: x,
			   y: y
			}
			socket.emit('input', client_packet);
		}
		
		

		can_move = true;
		dash_count = 0;

	
	},
	
	preload: function(){

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.spritesheet('dude', 'assets/dude.png', 58.25, 74);
		game.load.spritesheet('dude_no_purse', 'assets/dude_no_purse.png', 58.25, 74);
		game.load.spritesheet('purse', 'assets/purse.png', 43, 50);
	},
	
	create: function(){
		
		butt_bump_sound = game.add.audio('butt_bump_sound');
		crowd_gasp = game.add.audio('crowd_gasp');
		oh_yeah = game.add.audio('oh_yeah');
		whoosh = game.add.audio('whoosh');
		
		socket.on('purse swap', purse_swap_func = function(input){
			opponent_swap = input;
		});

		socket.on('opponent input', opponent_input_func = function(input){
			opponent_packet = input;
		});
		
		game.stage.disableVisibilityChange = true;
		
		game.scale.setGameSize(800, 800);
		
		menu_music.stop();
		
		game_music = game.add.audio('game_music');
		
		game_music.play('', 0, .1);
	
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		game.add.sprite(0, 0, 'sky');
		purse = game.add.sprite(380, game.world.height - 750, 'purse');

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
		ledge.scale.setTo(1.52, 1.4);
		
		// The player and its settings
		if(playerID == 'player 1'){
			player = game.add.sprite(5, game.world.height - 150, 'dude_no_purse');
			opponent = game.add.sprite(750, game.world.height - 150, 'dude_no_purse');
			
			//  player score
			player_score_text = game.add.text(50, 750, String(player_score), { fontSize: '32px', fill: '#000' });
			//  opponent score
			opponent_score_text = game.add.text(750, 750, String(opponent_score), { fontSize: '32px', fill: '#000' });
		}
		else if(playerID == 'player 2'){
			opponent = game.add.sprite(32, game.world.height - 150, 'dude_no_purse');
			player = game.add.sprite(736, game.world.height - 150, 'dude_no_purse');
			
			//  player score
			player_score_text = game.add.text(750, 750, String(player_score), { fontSize: '32px', fill: '#000' });
			//  opponent score
			opponent_score_text = game.add.text(50,750, String(opponent_score), { fontSize: '32px', fill: '#000' });

		}
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(opponent);
		game.physics.arcade.enable(purse);
		
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
		player.animations.add('l_ass', [11], 10, true);
		player.animations.add('r_ass', [12], 10, true);
		player.animations.add('taunt', [7,8,9,8], 1, true);

		//  Player physics properties. Give the little guy a slight bounce.
//		opponent.body.bounce.y = 0.2;
		opponent.body.gravity.y = 450;
		opponent.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		opponent.animations.add('right', [0, 1, 2], 10, true);
		opponent.animations.add('left', [4, 5, 6], 10, true);
		opponent.animations.add('l_ass', [11], 10, true);
		opponent.animations.add('r_ass', [12], 10, true);
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
			
			if(p_or_o == opponent){
				opponent_score += 1;
				opponent_score_text.text = String(opponent_score);
				
				if(opponent_score == 10){
					socket.emit('game end', playerID);
					socket.removeListener('purse swap', purse_swap_func);
					socket.removeListener('opponent input', opponent_input_func);
					game.state.start('game_end', false, true, 'lose', player_score, opponent_score);
				}
			}
			else if(p_or_o == player){
				player_score += 1;
				player_score_text.text = String(player_score);
				
				if(player_score == 10){
					socket.emit('game end', playerID);
					socket.removeListener('purse swap', purse_swap_func);
					socket.removeListener('opponent input', opponent_input_func);
					game.state.start('game_end', false, true, 'win', player_score, opponent_score);
				}
			}

		}
		stop_taunt = function(){
			can_move = true;
		}
	

		
		player.purse = false;
		opponent.purse = false;
		player.dash = true;

		
	},
	
	update: function(){
		
		/* if(!game_music.isPlaying == false){
			
			game_music.play();
		} */
		
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
				oh_yeah.play();
				player.animations.stop();
				can_move = false;
				emit_taunt();
				start_taunt_1(player);
			}
			else if(a_key.isDown && player.dash == true){
				whoosh.play();
				l_dash();
				player.body.velocity.x = -400;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if(d_key.isDown && player.dash == true){
				whoosh.play();
				r_dash();
				player.body.velocity.x = 400;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if (s_key.isDown && cursors.left.isDown && player_collide == false && player.purse == false){
				emit_ass_l(player.x, player.y);
				player.body.velocity.x = -75;
				player.frame = 11;
				
			}
			else if (s_key.isDown && cursors.right.isDown && player_collide == false && player.purse == false){
				emit_ass_r(player.x, player.y);
				player.body.velocity.x = 75;
				player.frame = 10;
				
			}
			else if (s_key.isDown && player_collide == false && player.purse == false){
				player.frame = 10;
			}
			else if(s_key.isDown && player_collide && player.purse == false && opponent.purse == true){
				butt_bump_sound.play();
				crowd_gasp.play();
				emit_purse_swap();
				player.frame = 11;
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

		if (opponent_swap)
		{
			opponent_swap = false;
			can_move = false;
			player.purse = false;
			opponent.purse = true;
			player.loadTexture('dude_no_purse', 0, false);
			opponent.loadTexture('dude', 0, false);
			game.time.events.add(Phaser.Timer.SECOND * 2, stop_taunt, this);
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
		else if (opponent_packet.input == 'ass_r')
		{
			opponent.body.velocity.x = 75;
			opponent.frame = 10;
		}
		else if (opponent_packet.input == 'ass_l')
		{
			opponent.body.velocity.x = -75;
			opponent.frame = 11;
		}
		else if (opponent_packet.input == 'up' && opponent.body.touching.down)
		{
			opponent.body.velocity.y = -460;
		}
		else if (opponent_packet.input == true && player.purse == true)
		{
			player.purse = false;
		}
		else
		{
			//  Stand still
			opponent.animations.stop();
			opponent.body.velocity.x = 0;
			//opponent.frame = 4;
		}
	
		//  Allow the opponent to jump if they are touching the ground.

		// reset opponent input
		if(dash_count >= 4){
			opponent_packet.input = null;
		}
		dash_count += 1;

		opponent_packet.x = null;
		opponent_packet.y = null;

	},

}