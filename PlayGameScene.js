class PlayGameScene extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	create() {
		this.physics.world.setBounds(0, 20, this.scale.width, this.scale.height - 20)
		
		//Background
		this.background = this.add.tileSprite(0, 20, this.scale.width, this.scale.height, "background");
		this.background.setOrigin(0, 0);
		
		//-Enemies-//
		this.spawn_enemy(this.enemy1 = this.add.sprite(this.scale.width + 10, 0, "enemy1"));
		this.spawn_enemy(this.enemy2 = this.add.sprite(this.scale.width + 10, 0, "enemy2"));
		this.spawn_enemy(this.enemy3 = this.add.sprite(this.scale.width + 10, 0, "enemy3"));
		
		this.enemies = this.physics.add.group();
		this.enemies.add(this.enemy1);
		this.enemies.add(this.enemy2);
		this.enemies.add(this.enemy3);
		//Score
		this.enemy1.score = 5;
		this.enemy2.score = 10;
		this.enemy3.score = 15;
		//Health
		this.enemy1.initHealth = 1;
		this.enemy2.initHealth = 2;
		this.enemy3.initHealth = 3;
		this.enemy1.health = this.enemy1.initHealth;
		this.enemy2.health = this.enemy2.initHealth;
		this.enemy3.health = this.enemy3.initHealth;
		//Animation
		this.enemy1.play("enemy1_anim");
		this.enemy2.play("enemy2_anim");
		this.enemy3.play("enemy3_anim");

		this.enemy1.setInteractive();
		this.enemy2.setInteractive();
		this.enemy3.setInteractive();
		
		//-Player-//
		this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "player");
		this.player.play("playerDown");
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.player.setCollideWorldBounds(true);
		
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.projectiles = this.add.group();
		this.physics.add.overlap(this.player, this.enemies, this.damage_player, null, this);
		this.physics.add.overlap(this.projectiles, this.enemies, this.damage_enemy, null, this);
		

		//-UI-//
		var graphics = this.add.graphics();
		graphics.fillStyle("Black");
		graphics.fillRect(0, 0, this.scale.width, 20);
		//Display player health
		this.health = 3;
		this.healthLabel = this.add.bitmapText(10, 5, "pixelFont", "HEALTH ", 16);
		this.healthLabel.text = "HEALTH " + this.health;
		//Display current Wave
		this.currentWave = 1;
		this.waveLabel = this.add.bitmapText(180, 5, "pixelFont", "WAVE ", 16);
		this.waveLabel.text = "WAVE " + this.currentWave;
		//Display score
		this.score = 0;
		this.scoreLabel = this.add.bitmapText(240, 5, "pixelFont", "SCORE ", 16);
		this.scoreLabel.text = "SCORE " + this.score;
		//Display lives
		this.lives = 3;
		this.livesLabel = this.add.bitmapText(420, 5, "pixelFont", "LIVES x ", 16);
		this.livesLabel.text = "LIVES x " + this.lives;
		
		//this.start_wave();
	}


	update() {
		//Enemy
		this.move_enemy(this.enemy1, 1.5);
		this.move_enemy(this.enemy2, 1.25);
		this.move_enemy(this.enemy3, 1);
		//Player
		this.move_player(1.6);
		
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.player_shoot();
		}
	}
	
	/*
	//-Wave-//
	start_wave() {
		let enemiesPerWave = 10 * this.currentWave;
		let enemiesSpawned = 0;
		let enemiesLeftInWave = this.enemiesPerWave;
		let spawnInterval = 500;
		
		this.time.addEvent({
            delay: spawnInterval,
            callback: this.spawn_wave_enemy(this.enemy3),
            callbackScope: this,
            repeat: enemiesPerWave - 1 //Spawn the total number of enemies
        });
    }
	
	spawn_wave_enemy(enemy) {
		if (enemy == 
	}
	*/
	
	//--Player--//
	move_player(speed) {
		let xDir = 0;
		let yDir = 0;
		//this.player.setVelocity(0);
		if (yDir == 0) {
			xDir = this.cursorKeys.right.isDown - this.cursorKeys.left.isDown;
		}
		if (xDir == 0) {
			yDir = this.cursorKeys.down.isDown - this.cursorKeys.up.isDown;
		}
		this.player_anim(xDir, yDir);
		
		this.player.x += xDir * speed;
		this.player.y += yDir * speed;
		
		//this.player.setVelocityX(xDir * speed);
		//this.player.setVelocityY(yDir * speed);
	}
	
	player_anim(xDir, yDir) {
		if (yDir == 1) {this.player.play("playerDown", true);}
		else if (yDir == -1) {this.player.play("playerUp", true);}
		else if (xDir == 1) {this.player.anims.play("playerRight", true);} 
		else if (xDir == -1) {this.player.play("playerLeft", true);}
		else {this.player.setFrame(0);}
	}
	
	player_shoot(){
		var bullet = new Bullet(this);
		this.projectiles.add(bullet);
	}
	
	damage_player(player, enemy) {
		this.spawn_enemy(enemy);
		//Subtract player health and check if player is dead
		if (--this.health <= 0) {
			//Update and display score
			if (this.score >= 100) {this.score -= 100;}
			else if (this.score < 100) {this.score = 0;}
			this.scoreLabel.text = "SCORE " + this.score;
			
			//Subtract player life if health reaches 0
			if (--this.lives <= 0) {
				this.registry.set("score", this.score);
				this.scene.start("gameOver");
			}
			//Display lives left
			this.livesLabel.text = "LIVES x " + this.lives;
			var death = new Death(this, player.x, player.y);
			player.disableBody(true, true);
			
			this.time.addEvent({
				delay: 1000,
				callback: this.reset_player,
				callbackScope: this,
				loop: false
			});
		}
		//Update health display
		this.healthLabel.text = "HEALTH " + this.health;
	}
	
	reset_player() {
		//Reset player co-ordinates
		this.player.enableBody(true, this.scale.width / 2, this.scale.height / 2, true, true);
		//Set player health
		this.health = 3;
		this.healthLabel.text = "HEALTH " + this.health;
	}
	
	
	//--Enemy--//
	move_enemy(enemy, speed) {
		const threshold = 2; //Threshold to stop enemy from flipping when either its x or y matches the player's
		let xDir = 0;
		let yDir = 0;
		//x
		if (Math.abs(enemy.x - this.player.x) > threshold) {
			if (enemy.x < this.player.x) {
				enemy.setFlipX(false);
				xDir = 1;
			} else if (enemy.x > this.player.x) {
				enemy.setFlipX(true);
				xDir = -1;
			}
		}
		//y
		if (Math.abs(enemy.y - this.player.y) > threshold) {
			if (enemy.y < this.player.y) {yDir = 1;} 
			else if (enemy.y > this.player.y) {yDir = -1;}
		}
		//Ensure that diagonal movement does not exceed intended speed
		const magnitude = Math.sqrt(xDir * xDir + yDir * yDir);
		if (magnitude !== 0) {
			xDir /= magnitude;
			yDir /= magnitude;
		}
		
		enemy.x += xDir * speed;
		enemy.y += yDir * speed;
	}
	
	
	spawn_enemy(enemy) {
		enemy.x = Math.random() < 0.5 ? 0 : this.scale.width; //Spawn from left or right side of screen
		enemy.y = Math.random() * this.scale.height; //Set random y value
	}
	
	damage_enemy(projectile, enemy) {
		projectile.destroy();
		if (--enemy.health <= 0){
			var death = new Death(this, enemy.x, enemy.y);
			this.spawn_enemy(enemy);
			enemy.health = enemy.initHealth;
			this.score += enemy.score;
			this.scoreLabel.text = "SCORE " + this.score;
		}
	}
}