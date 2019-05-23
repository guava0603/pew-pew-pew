var score = 0;
var CD = 0;
var scoreString = '';
var firingTimer = 0;
var livingEnemies = [];

var bg_music = null;

var menuState = {
  preload: function() {
    game.load.image('bg1', 'assets/_11_background.png');
    game.load.image('bg2', 'assets/_10_distant_clouds.png');
    game.load.image('bg3', 'assets/_09_distant_clouds1.png');
    game.load.image('bg4', 'assets/_08_clouds.png');

    game.load.audio('bg_music', 'assets/sound/bg.mp3');

    game.load.image('title', 'assets/title.png');
    game.load.spritesheet('me', 'assets/me.png', 50, 50);
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Add background
    for (var i = 1; i <= 4; i++) game.add.image(0, 0, `bg${i}`);
    game.add.image(50, game.height / 5, 'title');

    bg_music = game.add.audio('bg_music');
    bg_music.loopFull(1);
    
    // The hero!
    this.player = game.add.sprite(game.width / 2, game.height / 2, 'me');
    this.player.scale.setTo(2.0, 2.0);
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.animations.add('walk', [0, 1, 2, 3, 4], 8, true);
    this.player.animations.add('shoot', [8, 9, 10, 11, 12], 40, true);

    // And some controls to play the game with
    this.cursor = game.input.keyboard.createCursorKeys();
    this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {
    this.player.body.velocity.setTo(0, 0);

    if (this.cursor.left.isDown) this.player.body.velocity.x = -200;
    else if (this.cursor.right.isDown) this.player.body.velocity.x = 200;
    if (this.cursor.up.isDown) this.player.body.velocity.y = -200;
    else if (this.cursor.down.isDown) this.player.body.velocity.y = 200;

    //  Firing?
    if (this.fireButton.isDown) game.state.start('main');
    else this.player.animations.play('walk');
  }
}

var mainState = {
  preload: function() {
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemyBullet', 'assets/enemy-bullet.png');
    
    game.load.image('bg5', 'assets/_07_huge_clouds.png');
    game.load.image('bg6', 'assets/_06_hill2.png');
    game.load.image('bg7', 'assets/_05_hill1.png');
    game.load.image('bg8', 'assets/_03_distant_trees.png');
    game.load.image('bg9', 'assets/_02_trees_and_bushes.png');
    game.load.image('bg10', 'assets/_04_bushes.png');
    game.load.image('bg11', 'assets/_04_1.png');

    game.load.image('heart', 'assets/heart.png');
    game.load.image('on', 'assets/on.png');
    game.load.image('off', 'assets/off.png');
    game.load.image('volume_gray', 'assets/volume_gray.png');
    game.load.image('volume_white', 'assets/volume_white.png');
    game.load.image('pause', 'assets/pause.png');
    game.load.image('wings', 'assets/wing.png'); 
    game.load.image('auto', 'assets/auto.png');
    game.load.image('helper', 'assets/helper.png');
    game.load.image('special', 'assets/special.png');
    
    game.load.spritesheet('enemy0', 'assets/enemy_bee.png', 50, 38);
    game.load.spritesheet('enemy1', 'assets/enemy_green.png', 50, 39);
    game.load.spritesheet('kaboom', 'assets/exp.png', 64, 64);
    game.load.image('blood', 'assets/blood.png');

    game.load.audio('birds', 'assets/sound/birds.wav');
    game.load.audio('ah_me', 'assets/sound/ah_me.wav');
  },

  create: function() {
    console.log('game');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.create_bg();
    this.create_volume();
    this.create_pause();
    this.create_count();

    //  Our bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(100, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(30, 'enemyBullet');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 1);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    //  The emitter
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('blood');
    this.emitter.setYSpeed(-100, 100);
    this.emitter.setXSpeed(-150, -50);
    this.emitter.setScale(0.5, 0, 0.5, 0, 600);
    this.emitter.gravity = 0;

    //  The hero!
    this.player = game.add.sprite(50, game.height / 2, 'me');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.speed = 200;

    this.player.animations.add('walk', [0, 1, 2, 3, 4], 8, true);
    this.player.animations.add('shoot', [8, 9, 10, 11, 12], 8, true);
    this.player.animations.add('die', [15, 16, 17, 18, 19, 20, 21, 22], 8, true);
    this.player.animations.add('change', [0, 1, 2, 5, 3, 4, 5, 0, 1, 5, 6, 2, 5, 3, 5, 6], 3, true);

    //  The helper!
    this.helper = game.add.sprite(50, game.height / 2, 'me');
    this.helper.scale.setTo(1.5, 1.5);
    this.helper.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.helper, Phaser.Physics.ARCADE);
    this.helper.animations.add('walk', [0, 1, 2, 3, 4], 8, true);
    this.helper.visible = false;

    this.helper.animations.add('walk', [0, 1, 2, 3, 4], 8, true);

    //  The baddies!
    this.aliens = game.add.group();
    this.aliens.enableBody = true;
    this.aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
    //  The fruit!
    this.fruits = game.add.group();
    this.fruits.enableBody = true;
    this.fruits.physicsBodyType = Phaser.Physics.ARCADE;

    // Generate
    this.level = 1;
    this.auto = false;

    //  An explosion pool
    this.explosions = game.add.group();
    this.explosions.createMultiple(10, 'kaboom');
    this.explosions.forEach(exp => {
      exp.anchor.x = 0.5;
      exp.anchor.y = 0.5;
      exp.animations.add('kaboom');
    });

    //  And some controls to play the game with
    this.cursor = game.input.keyboard.createCursorKeys();
    this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.bigFireButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
  },

  create_bg() {
    //  The scrolling starfield background
    this.bg = [];
    for (var i = 1; i <= 7; i++) this.bg.push(game.add.tileSprite(0, 0, game.width, game.height, `bg${i}`));
    this.bg.push(game.add.tileSprite(0, 60, game.width, game.height, 'bg8'));
    this.bg.push(game.add.tileSprite(0, 50, game.width, game.height, 'bg9'));
    this.bg.push(game.add.tileSprite(0, 70, game.width, game.height, 'bg10'));
    this.bg.push(game.add.tileSprite(0, 100, game.width, game.height, 'bg11'));
    this.bg_speed = [0, 0, 0, 0.05, 0.1, 0.2, 0.4, 0.7, 0.8, 1.0, 1.4];

    //  The score
    this.scoreText = game.add.text(10, 10, score, { font: '15px Arial', fill: '#fff' });
    this.cdText = game.add.text(10, 40, '可以使用絕招了！', { font: '15px Arial', fill: '#fff' });
    //  Text
    this.stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

    this.lives = game.add.group();
    for (var i = 0; i < 10; i++) {
        var heart = this.lives.create(game.world.width - 250 + (25 * i), 20, 'heart');
        heart.anchor.setTo(1, 0);
    }
    this.live_count = 10;
  },

  create_count() {
    this.bulletTime = game.time.now;
    this.bigFireTime = game.time.now;
    this.generateTime = [game.time.now, game.time.now];
    this.g_time = [1000, 5000];
    this.fruitTime = [game.time.now + 8000, game.time.now + 15000, game.time.now, game.time.now, game.time.now];
    this.f_time = [8000, 15000, 20000, 15000, 8000];
    this.speedupTime = 0;
    this.autoTime = 0;
    this.helperTime = 0;
    this.specTime = 0;
  },

  create_pause() {
    this.pause = game.add.image(game.width - 25, game.height - 25, 'wings');
    this.pause.anchor.setTo(0.5, 0.5);
    this.pause.inputEnabled = true;
    this.pause.events.onInputDown.add(function() {
      game.paused = true
    });

    game.input.onDown.add(function() {
      game.paused = false;
      console.log('success');
    });
  },

  create_volume() {
    this.volume_on = game.add.image(20, game.height - 20, 'on');
    this.volume_on.anchor.setTo(0.5, 0.5);
    this.volume_on.scale.setTo(0.8, 0.8);
    this.volume_on.inputEnabled = true;
    this.volume_on.events.onInputDown.add(this.off_music, this);

    this.volume_off = game.add.image(20, game.height - 20, 'off');
    this.volume_off.anchor.setTo(0.5, 0.5);
    this.volume_off.scale.setTo(0.8, 0.8);
    this.volume_off.inputEnabled = true;
    this.volume_off.events.onInputDown.add(this.on_music, this);
    this.volume_off.visible = false;

    this.tmp_volume = 0.8;
    this.cur_volume = this.tmp_volume;
    
    var v_white = [];
    for (var i = 0; i < 10; i++) {
      var v_g = game.add.image(40 + i * 10, game.height - 20, 'volume_gray');
      var v_w = game.add.image(40 + i * 10, game.height - 20, 'volume_white');
      if (i > 8) v_w.visible = false;
      v_g.scale.setTo(0.8, 0.8);
      v_w.scale.setTo(0.8, 0.8);
      v_g.anchor.setTo(0.5, 0.5);
      v_w.anchor.setTo(0.5, 0.5);
      v_g.idx = i;
      v_g.inputEnabled = true;
      v_g.events.onInputDown.add(this.set_volume, this);
      v_w.idx = i;
      v_w.inputEnabled = true;
      v_w.events.onInputDown.add(this.set_volume, this);
      v_white.push(v_w);
    }
    this.v_white = v_white;

    // Sound
    this.birds = game.sound.play('birds');
  },

  set_volume(gray) {
    this.tmp_volume = gray.idx / 10;
    if (!this.volume_off.visible) this.on_music();
    for (var i = 0; i < gray.idx+1; i++) this.v_white[i].visible = true;
    for (var i = gray.idx+1; i < 10; i++) this.v_white[i].visible = false;
  },

  on_music() {
    this.volume_off.visible = false;
    this.volume_on.visible = true;
    this.cur_volume = this.tmp_volume;
  },

  off_music() {
    this.volume_off.visible = true;
    this.volume_on.visible = false;
    this.cur_volume = 0;
  },

  generateFruits: function(idx) {
    var img = '';
    switch(idx) {
      case 0:
        img = 'wings';
        break;
      case 1:
        img = 'auto';
        break;
      case 2:
        img = 'helper';
        break;
      case 3:
        img = 'heart';
        break;
      case 4:
        img = 'special';
        break;
    }
    var fruit = this.fruits.create(game.width - 20, Math.random() * (game.height - 150) + 75, img);
    fruit.anchor.setTo(0.5, 0.5);
    fruit.body.moves = false;
    fruit.speed = 3;
    fruit.idx = idx;
    this.fruitTime[idx] = game.time.now + this.f_time[idx];
  },

  generateEnemies: function(lv) {
      var alien = this.aliens.create(game.width - 20, Math.random() * (game.height - 150) + 75, `enemy${lv}`);
      alien.anchor.setTo(0.5, 0.5);
      alien.body.moves = false;
      alien.dir_x = -1;
      alien.dir_y = (Math.random() < 0.5) ? -1 : 1;
      this.generateTime[lv] = game.time.now + this.g_time[lv]; 
      switch(lv) {
        case 0:
          alien.animations.add('fly', [ 0, 1, 2, 3, 4, 5 ], 10, true);
          alien.score = 10;
          alien.speed = 4;
          break;
        case 1:
          alien.animations.add('fly', [ 0, 1, 2, 3 ], 10, true);
          alien.score = 20;
          alien.speed = 5;
          break;
      }
      alien.play('fly');
  },

  update: function() {
    // console.log(this.level, this.generateTime);
    //  Moving
    for (var i = 0; i < 11; i++) this.bg[i].tilePosition.x -= this.bg_speed[i];
    this.enemyMove();

    bg_music.volume = this.cur_volume;
    this.birds.volume = this.cur_volume;

    if (this.player.alive) {
      //  Reset the player, then check for movement keys
      this.player.body.velocity.setTo(0, 0);

      if (this.cursor.left.isDown && this.player.x >= 0) {
        this.player.body.velocity.x = -this.player.speed;
      } else if (this.cursor.right.isDown && this.player.x <= game.width) {
        this.player.body.velocity.x = this.player.speed;
      }
      if (this.cursor.up.isDown && this.player.y >= 0) {
        this.player.body.velocity.y = -this.player.speed;
      } else if (this.cursor.down.isDown && this.player.y <= game.height) {
        this.player.body.velocity.y = this.player.speed;
      }

      //  Firing?
      if (this.fireButton.isDown) {
        this.player.animations.play('shoot');
        this.fireBullet();
      } else this.player.animations.play('walk');
      if (this.bigFireButton.isDown) this.bigFireBullet();

      if (game.time.now > firingTimer) this.enemyFires();


      //  Run collision
      game.physics.arcade.overlap(this.bullets, this.aliens, this.collisionHandler, null, this);
      game.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.fruits, this.player, this.playerEatFruit, null, this);
    }

    if (this.bigFireTime > game.time.now) {
      this.cdText.text = 'CD時間 ' + (String)(Math.ceil((this.bigFireTime - game.time.now) / 1000)) + 's';
    } else this.cdText.text = '可以使用絕招了！';
    // console.log(this.bigFireTime, game.time.now)

    this.generate_all();
    this.update_effect();

    this.level = Math.ceil(score / 200) + 1;
  },

  update_effect() {
    if (this.speedupTime < game.time.now) this.player.speed = 200;
    if (this.autoTime > game.time.now) {
      console.log('auto');
      var enemy = this.aliens.getFirstAlive(false);
      // var bullet = this.bullets.getFirstExists(false);
      // this.bullets.forEach(game.physics.moveToObject(enemy), game.physics, false, 300);
      if (enemy && bullet) {
        this.bullets.forEachAlive(bullet => {
          var x = enemy.centerX - bullet.centerX;
          var y = enemy.centerY - bullet.centerY;
          var mid = Math.sqrt(x*x + y*y);
          bullet.body.velocity.x = 400 * x / mid;
          bullet.body.velocity.y = 400 * y / mid;
          // game.physics.arcade.moveToObject(bullet, enemy, 120);
        });
      }
      else console.log('no enemy or bullet');
    }
    if (this.helperTime > game.time.now) {
      this.helper.body.velocity.x = this.player.body.velocity.x;
      this.helper.body.velocity.y = this.player.body.velocity.y;
      game.physics.arcade.overlap(this.enemyBullets, this.helper, this.enemyHitsHelper, null, this);
    } else this.helper.visible = false;
  },

  generate_all() {
    // console.log(this.generateTime[0], game.time.now)
    if (game.time.now > this.generateTime[0]) this.generateEnemies(0);
    if (this.level > 1 && game.time.now > this.generateTime[1]) this.generateEnemies(1);
    if (game.time.now > this.fruitTime[0]) this.generateFruits(0);
    if (this.level > 1 && game.time.now > this.fruitTime[1]) this.generateFruits(1);
    if (this.level > 2 && game.time.now > this.fruitTime[2]) this.generateFruits(2);
    if (this.level > 5 && game.time.now > this.fruitTime[3]) this.generateFruits(3);
    if (this.level > 2 && game.time.now > this.fruitTime[4]) this.generateFruits(4);

    this.g_time.forEach(time => {
      if (time > 200) {
        time -= 100;
      }
    })
  },

  enemyMove: function() {
    this.aliens.forEachAlive(alien => {
      if (alien.x <= 100) alien.dir_x = 1;
      else if (alien.x >= game.width - 100) alien.dir_x = -1;
      if (alien.y <= 100) alien.dir_y = 1;
      else if (alien.y >= game.height - 100) alien.dir_y = -1;
      var random = Math.random();
      alien.x += alien.speed * random * alien.dir_x;
      alien.y += alien.speed * (1 - random) * alien.dir_y;
    });
    this.fruits.forEachAlive(fruit => {
      fruit.x -= fruit.speed;
    })
  },

  playerEatFruit(player, fruit) {
    switch(fruit.idx) {
      case 0:
        this.speedupTime = game.time.now + 5000;
        player.speed *= 2;
        break;
      case 1:
        this.autoTime = game.time.now + 3000;
        break;
      case 2:
        this.helper.reset(this.player.x + 80, this.player.y);
        this.helper.visible = true;
        this.helperTime = game.time.now + 10000;
        this.helper.animations.play('walk');
        break;
      case 3:
        if (this.lives.countLiving() < 10) this.lives.getFirstExists(false).revive();
        break;
      case 4:
        this.specTime = game.time.now + 4000;
    }
    fruit.kill();
    player.play('change', 4, false);
  },
  
  collisionHandler(bullet, alien) {
    //  Increase the score
    this.scoreText.text = score;
    score += alien.score;

    //  When a bullet hits an alien we kill them both
    if (this.specTime > game.time.now) bullet.kill();
    alien.kill();

    //  And create an explosion :)
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 45, false, true);

    if (this.aliens.countLiving() == 0) {
      // score += 1000;
      this.scoreText.text = score;

      // this.enemyBullets.callAll('kill',this);
      // this.stateText.text = " You Won, \n Click to restart";
      this.stateText.visible = true;

      //the "click to restart" handler
      // game.input.onTap.addOnce(this.restart,this);
    }
  },

  enemyHitsHelper(helper, bullet) {
    bullet.kill();
    console.log('kill');
  },

  enemyHitsPlayer(player, bullet) {
    var ah = game.sound.play('ah_me', this.cur_volume);
    bullet.kill();

    live = this.lives.getFirstAlive();

    if (live) {
      live.kill();
    }

    //  And create an explosion
    // var explosion = this.explosions.getFirstExists(false);
    // explosion.reset(player.body.x, player.body.y);
    // explosion.play('kaboom', 45, false, true);
    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 800, null, 15);

    // When the player dies
    if (this.lives.countLiving() < 1) {
      game.state.start('end');
        // player.kill();
        // this.enemyBullets.callAll('kill');

        // this.stateText.text=" GAME OVER \n Click to restart";
        // this.stateText.visible = true;

        // //the "click to restart" handler
        // game.input.onTap.addOnce(this.restart,this);
    }
  },

  enemyFires() {
    //  Grab the first bullet we can from the pool
    enemyBullet = this.enemyBullets.getFirstExists(false);

    livingEnemies.length = 0;

    this.aliens.forEachAlive(function(alien){
      // put every living enemy in an array
      livingEnemies.push(alien);
    });

    if (enemyBullet && livingEnemies.length > 0) {
      var random = game.rnd.integerInRange(0,livingEnemies.length-1);

      // randomly select one of them
      var shooter=livingEnemies[random];
      // And fire the bullet from this enemy
      enemyBullet.reset(shooter.body.x, shooter.body.y);

      game.physics.arcade.moveToObject(enemyBullet, this.player, 120);
      firingTimer = game.time.now + 2000;
    }
  },

  bigFireBullet() {
    if (game.time.now > this.bigFireTime) {
      for (var i = 0; i < 20; i ++) {
        bullet = this.bullets.getFirstExists(false);

        if (bullet) {
          bullet.reset(this.player.x, this.player.y + 8);
          bullet.body.velocity.x = 400 * Math.cos(2 * Math.PI * i / 20);
          bullet.body.velocity.y = 400 * Math.sin(2 * Math.PI * i / 20);
        }
      }
      this.bigFireTime += 10000;
    }
  },

  fireBullet() {
    if (game.time.now > this.bulletTime) {
      //  Grab the first bullet we can from the pool
      bullet = this.bullets.getFirstExists(false);

      if (bullet) {
        //  And fire it
        bullet.reset(this.player.x, this.player.y + 8);
        bullet.body.velocity.x = +400;
        this.bulletTime = game.time.now + 400;
      }
    }
  }
}

var endState = {
  preload: function() {
    game.load.image('bg', 'assets/endding.png');
    game.load.image('board', 'assets/scoreboard.png');
  },

  create: function() {
    game.add.image(0, 0, 'bg');
    this.board = game.add.image(game.width / 2 + 15, game.height - 120, 'board');
    this.board.jumpCount = 0;
    this.scoreText = game.add.text(game.width / 2 + 35, game.height - 55, score, { font: '35px Arial', fill: '#aaa' });

    this.RESTART = game.add.sprite(game.width - 230, game.height - 120, 'me');
    this.RESTART.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.RESTART, Phaser.Physics.ARCADE);
    this.RESTART.animations.add('walk', [0, 1, 2, 3, 4], 8, true);
    this.RESTART.inputEnabled = true;
		this.RESTART.events.onInputOver.add(this.over_r, this);
    this.RESTART.events.onInputOut.add(this.out, this);
    this.RESTART.events.onInputDown.add(this.restart, this);

    this.QUIT = game.add.sprite(game.width - 50, game.height - 120, 'me');
    this.QUIT.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.QUIT, Phaser.Physics.ARCADE);
    this.QUIT.animations.add('dead', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 5, true);
    this.QUIT.inputEnabled = true;
		// this.QUIT.events.onInputOver.add(this.over_q, this);
    this.QUIT.events.onInputOut.add(this.out, this);
    this.QUIT.events.onInputDown.add(this.reMenu, this);
  },

  update: function() {
    // if (this.board.jumpCount >= 100) {
    //   this.board.y -= (105 - this.board.jumpCount) / 3;
    //   this.scoreText.y -= (105 - this.board.jumpCount) / 3;
    // }
    // if (this.board.jumpCount == 110) this.board.jumpCount = 0;
    // this.board.jumpCount ++;
  },

  over_r: function(button) {
    console.log('walk');
    button.animations.play('walk');
  },
  over_q: function(button) {
    console.log('dead');
    button.animations.play('dead');
  },
  out: function(button) {
    console.log('out');
    button.animations.stop();
  },

  restart() {
    //  A new level starts
    
    //resets the life count
    this.lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    this.aliens.removeAll();
    this.generateEnemies0();

    //revives the player
    this.player.revive();
    //hides the text
    this.stateText.visible = false;
    this.state.start('main');
  },

  // restart: function() {

  //   this.state.start('main');
  // },
  reMenu: function() {
    this.state.start('menu');
  }
}

var game = new Phaser.Game(650, 500, Phaser.AUTO, 'canvas');
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.add('end', endState);
game.state.start('menu');