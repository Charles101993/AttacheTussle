//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(){
		console.log('game_state loaded');		
		
		var player;
		var opponent;
		var platforms;
		var cursors;

		packet_queue = [];
		
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
		
		player_fall_through = false;
		opponent_fall_through = false;

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
			/* if(packet_queue.length<10) */ packet_queue.push(input);
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
		var ground = platforms.create(0, game.world.height -10, 'ground');
		ground.scale.setTo(10, 1);
		ground.body.immovable = true;

		//  Now let's create two ledges
		var ledge = platforms.create(730, 576, 'ground');
		ledge.scale.setTo(.1, .1);
		ledge.body.immovable = true;

		ledge = platforms.create(502, 396, 'ground');
		ledge.scale.setTo(.1, .1);
		ledge.body.immovable = true;

		ledge = platforms.create(552, 302, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1, .1);

		ledge = platforms.create(362, 286, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1 , .1);

		ledge = platforms.create(436, 416, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		
		ledge = platforms.create(250, 610, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(202, 518, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(262, 494, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(330, 486, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(384, 650, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(426, 652, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(522, 700, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(600, 478, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(150, 120, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(658, 104, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(148, 118, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge = platforms.create(94, 378, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
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
		
		game.physics.arcade.OVERLAP_BIAS = 9;
		
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
		pause_taunt = function(){
			player.taunt = false;
			game.time.events.add(Phaser.Timer.SECOND * 1, resume_taunt, this);
		}
		resume_taunt = function(){
			player.taunt = true;
		}
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
		player.taunt = true;
		
	},
	
	update: function(){

		if(player.body.velocity.y >= 0){
			game.physics.arcade.collide(player, platforms);
		}
		game.physics.arcade.collide(purse, platforms);
		
		purse_collide = game.physics.arcade.overlap(player, purse, null, null, this);
		opponent_collide = game.physics.arcade.overlap(purse, opponent, null, null, this);
		
		player_collide = game.physics.arcade.overlap(player, opponent, null, null, this);
		
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
		
		if(packet_queue.length > 0) opponent_packet = packet_queue.shift();
		
		// sync opponent position if significant discrepency
		if(opponent_packet.x != null){			
			if( (opponent_packet.x - opponent.x) > 10 || (opponent_packet.x - opponent.x) < -10 ){
				opponent.x = opponent_packet.x;
			}
			/* else
				opponent.x += (opponent_packet.x - opponent.x)*0.2; */
		}
		if(opponent_packet.y != null){
			if( (opponent_packet.y - opponent.y) > 10 || (opponent_packet.y - opponent.y) < -10 && opponent.body.onFloor() ){
				opponent.y = opponent_packet.y - 3;
			}
		}
		
		// opponent fall through platform?
		if(!game.physics.arcade.overlap(opponent, platforms, null, null, this)){
			opponent_fall_through = false;
		}
		if(!opponent_fall_through){
			game.physics.arcade.collide(opponent, platforms);
		}
		else{
			game.physics.arcade.collide(opponent, platforms.children[0]);
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
		else if (opponent_packet.input == true && player.purse == true)
		{
			player.purse = false;
		}
		else
		{
			//  Stand still
			opponent.animations.stop();
			//  Reset the opponent's velocity (movement)
			opponent.body.velocity.x = 0;
			//opponent.frame = 4;
		}
		
		if (opponent_packet.input == 'up' && opponent.body.touching.down)
		{
			opponent.body.velocity.y = -460;
		}
		else if (opponent_packet.input == 'down' && opponent.body.touching.down)
		{
			opponent_fall_through = true;
		}
	
		//  Allow the opponent to jump if they are touching the ground.

		// reset opponent input
		if(dash_count >= 4){
			opponent_packet.input = null;
		}
		dash_count += 1;

		opponent_packet.x = null;
		opponent_packet.y = null;
		
		// skip client processing every other frame
		if(!frame) {
			frame = true;
			return;
		}
		//  player ------------------------------------------------------------------------------------------------			
		
		// player fall through platform?
		if(!game.physics.arcade.overlap(player, platforms, null, null, this)){
			player_fall_through = false;
		}
		if(!player_fall_through){
			game.physics.arcade.collide(player, platforms);
		}
		else{
			game.physics.arcade.collide(player, platforms.children[0]);
		}
		
		player.body.velocity.x = 0;

		if(can_move == true){
			if(s_key.isDown && player.purse == true && player.taunt == true){
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
				emit_ass_l(player.x + player.body.velocity.x/30, player.y);
				player.body.velocity.x = -75;
				player.frame = 11;
				
			}
			else if (s_key.isDown && cursors.right.isDown && player_collide == false && player.purse == false){
				emit_ass_r(player.x + player.body.velocity.x/30, player.y);
				player.body.velocity.x = 75;
				player.frame = 10;
				
			}
			else if (s_key.isDown && player_collide == false && player.purse == false){
				player.frame = 10;
			}
			else if(s_key.isDown && player_collide && player.purse == false && opponent.purse == true){
				butt_bump_sound.play();
				crowd_gasp.play();
				pause_taunt();
				emit_purse_swap();
				player.frame = 11;
				player.purse = true;
				opponent.purse = false;
				player.loadTexture('dude', 0, false);
				opponent.loadTexture('dude_no_purse', 0, false);	
			}
			else if (cursors.left.isDown)
			{			
				//  Move to the left
				player.body.velocity.x = -150;

				player.animations.play('left');
				
				left(player.x + player.body.velocity.x/30, player.y);
			}
			else if (cursors.right.isDown)
			{		
				//  Move to the right
				player.body.velocity.x = 150;

				player.animations.play('right');
				
				right(player.x + player.body.velocity.x/30, player.y);
			}
			else
			{
				player.animations.stop();
				
				var client_packet = {
					input: null,
					x: player.x,
					y: player.y
				}
				
				socket.emit('input',client_packet);
			}
			
			if (cursors.up.isDown && player.body.touching.down)
			{
				player.body.velocity.y = -460;
				up(player.x + player.body.velocity.x/30, player.y);
			}
			else if (cursors.down.isDown && player.body.touching.down)
			{
				player_fall_through = true;
				down(player.x + player.body.velocity.x/30, player.y);
			}
			
		}
		
		frame = false;

	}

}
