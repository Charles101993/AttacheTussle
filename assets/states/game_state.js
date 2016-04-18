//world game state
var game_state = {
	// param is string denoting whether client is player 1 or 2
	init: function(param4, param5){
		console.log('game_state loaded');		
		
		//assigning numbers for the character chosen in the previous state
		player_character_number = param4;
		opponent_character_number = param5;
		
		if(player_character_number == 0){
		
			player_character = 'c1';
		}
		else if(player_character_number == 1){
			
			player_character = 'c2';
		}
		else if(player_character_number == 2){
			
			player_character = 'c3';
		}

		if(opponent_character_number == 0){
			
			opponent_character = 'c1';
		}
		else if(opponent_character_number == 1){
			
			opponent_character = 'c2';
		}
		else if(opponent_character_number == 2){
			
			opponent_character = 'c3';
		}
		
		var player;
		var opponent;
		var platforms;
		var cursors;
		
		//queue of packets to be sent to the server
		packet_queue = [];
		
		player_score = 0;
		opponent_score = 0;
		var player_score_text;
		var opponent_score_text;
		
		frame = false;
		
		//below are fucntions for each packet to be sent when a key is pressed
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
			   input: 'taunt',
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
	
	//loading all assets that will be shown in the game state
	preload: function(){

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.spritesheet('purse', 'assets/purse.png', 43, 50);
		game.load.spritesheet('c1', 'assets/c1.png', 58.25, 74);
		game.load.spritesheet('c1_no_purse', 'assets/c1_no_purse.png', 58.25, 74);
		game.load.spritesheet('c1_onground', 'assets/c1_onground.png', 74.5, 74);
		game.load.spritesheet('c2', 'assets/c2.png', 60, 74);
		game.load.spritesheet('c2_no_purse', 'assets/c2_no_purse.png', 60, 74);
		game.load.spritesheet('c2_onground', 'assets/c2_onground.png', 74.5, 74);
		game.load.spritesheet('c3', 'assets/c3.png', 60, 74);
		game.load.spritesheet('c3_no_purse', 'assets/c3_no_purse.png', 60, 74);
		game.load.spritesheet('c3_onground', 'assets/c3_onground.png', 74.5, 74);
		game.load.spritesheet('smoke', 'assets/smoke.png', 255.2, 239);		

	},
	


	create: function(){
		//add audio needed in the game state
		butt_bump_sound = game.add.audio('butt_bump_sound');
		crowd_gasp = game.add.audio('crowd_gasp');
		oh_yeah = game.add.audio('oh_yeah');
		whoosh = game.add.audio('whoosh');
		
		//sockets for swapping the purse and listening for opponent input
		socket.on('purse swap', purse_swap_func = function(input){
			opponent_swap = input;
		});

		socket.on('opponent input', opponent_input_func = function(input){
			/* if(packet_queue.length<10) */ packet_queue.push(input);
		});
		
		game.stage.disableVisibilityChange = true;
		
		game.scale.setGameSize(820, 800);
		game.camera.x = 10;
		game.camera.height = 800;
		game.camera.width = 800;
		
		//add music to be played and stop the menu music
		menu_music.stop();
		
		game_music = game.add.audio('game_music');
		
		game_music.play('', 0, .7);
	
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		game.add.sprite(5, 0, 'sky');
		purse = game.add.sprite(380, game.world.height - 750, 'purse');

		//  The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 52, 'ground');
		ground.scale.setTo(10, 1);
		ground.body.immovable = true;

		//  Now let's create two ledges

		
		
		//  creating platforms for the players to jump on

		var ledge = platforms.create(738, 576, 'ground');
		ledge.scale.setTo(.1, .1);
		ledge.body.immovable = true;
		ledge.anchor.setTo(0.5, 0.5);

		ledge = platforms.create(502, 396, 'ground');
		ledge.scale.setTo(.1, .1);
		ledge.body.immovable = true;
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(552, 302, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1, .1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(399, 118, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1, .1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(278, 388, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1, .1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(362, 286, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1 , .1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(436, 416, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(250, 620, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);

		ledge = platforms.create(202, 518, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(262, 507, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(330, 486, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(384, 650, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(426, 652, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(522, 700, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(614, 478, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(146, 120, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(657, 112, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(158, 118, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		ledge = platforms.create(98, 380, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(.1,.1);
		ledge.anchor.setTo(0.5, 0.5);
		
		// The player and its settings
		if(playerID == 'player 1'){
			player = game.add.sprite(5, game.world.height - 150, player_character + '_no_purse');
			opponent = game.add.sprite(750, game.world.height - 150, opponent_character + '_no_purse');
			
			//  player score
			player_score_text = game.add.text(50, 750, String(player_score), { fontSize: '32px', fill: '#000' });
			//  opponent score
			opponent_score_text = game.add.text(750, 750, String(opponent_score), { fontSize: '32px', fill: '#000' });
		}
		else if(playerID == 'player 2'){
			opponent = game.add.sprite(32, game.world.height - 150, opponent_character + '_no_purse');
			player = game.add.sprite(736, game.world.height - 150, player_character + '_no_purse');
			
			//  player score
			player_score_text = game.add.text(750, 750, String(player_score), { fontSize: '32px', fill: '#000' });
			//  opponent score
			opponent_score_text = game.add.text(50,750, String(opponent_score), { fontSize: '32px', fill: '#000' });
		}
		
		//This is for the fog that will play when a player gets 8 taunts

		//emitters for smoke effects that are added when a player reaches a score of 8

		emitter1 = game.add.emitter(160, 770, 400);
		emitter2 = game.add.emitter(205, 735, 400);
		emitter3 = game.add.emitter(276.25, 770, 400);
		emitter4 = game.add.emitter(392.5, 770, 400);
		emitter5 = game.add.emitter(508.75, 770, 400);
		emitter6 = game.add.emitter(580, 735, 400);
		emitter7 = game.add.emitter(625, 770, 400);

		emitter1.makeParticles('smoke');
		emitter2.makeParticles('smoke');
		emitter3.makeParticles('smoke');
		emitter4.makeParticles('smoke');
		emitter5.makeParticles('smoke');
		emitter6.makeParticles('smoke');
		emitter7.makeParticles('smoke');

		emitter1.minParticleScale = 0.40;
		emitter1.maxParticleScale = 0.40;
		emitter1.alpha = 0.3;
		emitter2.minParticleScale = 0.40;
		emitter2.maxParticleScale = 0.40;
		emitter2.alpha = 0.3;
		emitter3.minParticleScale = 0.40;
		emitter3.maxParticleScale = 0.40;
		emitter3.alpha = 0.3;
		emitter4.minParticleScale = 0.40;
		emitter4.maxParticleScale = 0.40;
		emitter4.alpha = 0.3;
		emitter5.minParticleScale = 0.40;
		emitter5.maxParticleScale = 0.40;
		emitter5.alpha = 0.3;
		emitter6.minParticleScale = 0.40;
		emitter6.maxParticleScale = 0.40;
		emitter6.alpha = 0.3;
		emitter7.minParticleScale = 0.40;
		emitter7.maxParticleScale = 0.40;
		emitter7.alpha = 0.3;


		emitter1.gravity = 50;
		emitter2.gravity = 50;
		emitter3.gravity = 50;
		emitter4.gravity = 50;
		emitter5.gravity = 50;
		emitter6.gravity = 50;
		emitter7.gravity = 50;

		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(opponent);
		game.physics.arcade.enable(purse);
		
		game.physics.arcade.OVERLAP_BIAS = 15;
		
		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
		//  Player physics properties. Give the little guy a slight bounce.

//		player.body.bounce.y = 0.2;
		player.body.gravity.y = 650;
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
		opponent.body.gravity.y = 650;
		opponent.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		opponent.animations.add('right', [0, 1, 2], 10, true);
		opponent.animations.add('left', [4, 5, 6], 10, true);
		opponent.animations.add('l_ass', [11], 10, true);
		opponent.animations.add('r_ass', [12], 10, true);
		opponent.animations.add('taunt', [7,8,9,8], 1, true);

		
		//assignments of the keys for player inputs
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
			if(p_or_o.purse == true){
				if(p_or_o == opponent){
					opponent_score += 1;
					opponent_score_text.text = String(opponent_score);
					if(opponent_score > 7){
						opponent_score_text.addColor('#f70505', 0);
						if(opponent_score > 7  || player_score > 7){
							emitter1.start(false, 2000, 20);
							emitter2.start(false, 2000, 20);
							emitter3.start(false, 2000, 20);
							emitter4.start(false, 2000, 20);
							emitter5.start(false, 2000, 20);
							emitter6.start(false, 2000, 20);
							emitter7.start(false, 2000, 20);
						}
					}
					
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
					if(player_score > 7){
						player_score_text.addColor('#f70505', 0);
						if(opponent_score > 7  || player_score > 7){
							emitter1.start(false, 2000, 20);
							emitter2.start(false, 2000, 20);
							emitter3.start(false, 2000, 20);
							emitter4.start(false, 2000, 20);
							emitter5.start(false, 2000, 20);
							emitter6.start(false, 2000, 20);
							emitter7.start(false, 2000, 20);
						}
					}
					
					if(player_score == 10){
						socket.emit('game end', playerID);
						socket.removeListener('purse swap', purse_swap_func);
						socket.removeListener('opponent input', opponent_input_func);
						game.state.start('game_end', false, true, 'win', player_score, opponent_score);
					}
				}
				game.time.events.add(Phaser.Timer.QUARTER * 2, stop_taunt, this);
			}
			else stop_taunt();
		}
		stop_taunt = function(){
			can_move = true;

		}

		player.purse = false;
		opponent.purse = false;
		player.dash = true;
		player.taunt = true;
		
		//timer that is used at the start of the game state
		can_move = false;
		start_counter_text = game.add.text(game.world.centerX, game.world.centerY, '3', { font: '75px Arial', fill: '#14fe14', align: 'center' });
		start_counter_text.anchor.setTo(0.5,0.5);
		game.time.events.add(Phaser.Timer.SECOND, function(){ start_counter_text.text = '2'; }, this);
		game.time.events.add(Phaser.Timer.SECOND*2, function(){ start_counter_text.text = '1'; }, this);
		game.time.events.add(Phaser.Timer.SECOND*3, function(){ start_counter_text.text = 'START!'; can_move = true; }, this);
		game.time.events.add(Phaser.Timer.SECOND*3.5, function(){ start_counter_text.destroy(); }, this);
		
	},
	
	update: function(){
		
		
		
		game.physics.arcade.collide(purse, platforms);
		
		purse_collide = game.physics.arcade.overlap(player, purse, null, null, this);
		opponent_collide = game.physics.arcade.overlap(purse, opponent, null, null, this);
		
		player_collide = game.physics.arcade.overlap(player, opponent, null, null, this);
		
		//check for purse collision
		if(purse_collide){
			purse.destroy();
			player.purse = true;
			player.loadTexture(player_character,0,true);
		}
		if(opponent_collide){
			purse.destroy();
			opponent.purse = true;
			opponent.loadTexture(opponent_character,0,true);
		}
		
		if(packet_queue.length > 0) opponent_packet = packet_queue.shift();
		
		// sync opponent position if significant discrepency
		if(opponent_packet.x != null){			
			//if( (opponent_packet.x - opponent.x) > 10 || (opponent_packet.x - opponent.x) < -10 ){
				opponent.x = opponent_packet.x;
			//}
			/* else
				opponent.x += (opponent_packet.x - opponent.x)*0.2; */
		}
		if(opponent_packet.y != null){
			//if( (opponent_packet.y - opponent.y) > 10 || (opponent_packet.y - opponent.y) < -10 && opponent.body.onFloor() ){
				if( opponent_packet.input == 'left' || opponent_packet.input == 'right' ) opponent.y = opponent_packet.y;
			//}
		}
		
		// opponent fall through platform?
		if(!game.physics.arcade.overlap(opponent, platforms, null, null, this)){
			opponent_fall_through = false;
		}
		if(!opponent_fall_through && opponent.body.velocity.y >= 0){
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
			player.loadTexture(player_character + '_onground', 0, false);
			opponent.loadTexture(opponent_character, 0, false);
			game.time.events.add(Phaser.Timer.SECOND * 2, function(){
				can_move = true;
				player.loadTexture(player_character + '_no_purse', 0, false);	
			}, this);
		}

		if (opponent_packet.input == 'left')
		{
			//  Move to the left
			opponent.body.velocity.x = -200;

			opponent.animations.play('left');
		}
		else if (opponent_packet.input == 'right')
		{
			//  Move to the right
			opponent.body.velocity.x = 200;

			opponent.animations.play('right');
		}
		else if (opponent_packet.input == 'taunt')
		{
			start_taunt_1(opponent);
		}
		else if (opponent_packet.input == 'l_dash')
		{
			opponent.body.velocity.x = -600;
			if(dash_count > 4){
				dash_count = 0;
			}
		}
		else if (opponent_packet.input == 'r_dash')
		{
			opponent.body.velocity.x = 600;
			if(dash_count > 4){
				dash_count = 0;
			}
		}
		else if (opponent_packet.input == 'ass_r')
		{
			opponent.body.velocity.x = 100;
			opponent.frame = 10;
		}
		else if (opponent_packet.input == 'ass_l')
		{
			opponent.body.velocity.x = -100;
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
			opponent.x = opponent_packet.x;
			opponent.body.velocity.y = -560;
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
		/* if(!frame) {
			frame = true;
			return;
		} */
		//  player ------------------------------------------------------------------------------------------------			
		
		// player fall through platform?
		if(!game.physics.arcade.overlap(player, platforms, null, null, this)){
			player_fall_through = false;
		}
		if(!player_fall_through && player.body.velocity.y >= 0){
			game.physics.arcade.collide(player, platforms);
		}
		else{
			game.physics.arcade.collide(player, platforms.children[0]);
		}
		
		player.body.velocity.x = 0;

		//player functions for animation swapping and sound effects
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
				player.body.velocity.x = -600;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if(d_key.isDown && player.dash == true){
				whoosh.play();
				r_dash();
				player.body.velocity.x = 600;
				game.time.events.add(Phaser.Timer.QUARTER *1, disable_dash, this);
			}
			else if (s_key.isDown && cursors.left.isDown && player_collide == false && player.purse == false){
				emit_ass_l(player.x, player.y);
				player.body.velocity.x = -100;
				player.frame = 11;
				
			}
			else if (s_key.isDown && cursors.right.isDown && player_collide == false && player.purse == false){
				emit_ass_r(player.x, player.y);
				player.body.velocity.x = 100;
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
				player.loadTexture(player_character, 0, false);
				opponent.loadTexture(opponent_character + '_onground', 0, false);
				game.time.events.add(Phaser.Timer.SECOND * 2, function(){
					can_move = true;
					opponent.loadTexture(opponent_character + '_no_purse', 0, false);	
				}, this);
			}
			else if (cursors.left.isDown)
			{			
				//  Move to the left
				player.body.velocity.x = -200;

				player.animations.play('left');
				
				left(player.x, player.y);
			}
			else if (cursors.right.isDown)
			{		
				//  Move to the right
				player.body.velocity.x = 200;

				player.animations.play('right');
				
				right(player.x, player.y);
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
				player.body.velocity.y = -560;
				up(player.x, player.y);
			}
			else if (cursors.down.isDown && player.body.touching.down)
			{
				player_fall_through = true;
				down(player.x, player.y);
			}
			
		}
		
		frame = false;

	}

}
