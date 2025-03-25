class PlayGameScene extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	create() {
		this.physics.world.setBounds(0, 20, this.scale.width, this.scale.height - 20)
		
		//Background
		this.background = this.add.tileSprite(0, 20, this.scale.width, this.scale.height, "background");
		this.background.setOrigin(0, 0);
		
		
		//-Enemy-//
		this.enemies = this.physics.add.group();
		
		
		//-Player-//
		this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "player");
		this.player.play("playerDown");
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.player.setCollideWorldBounds(true);
		this.playerSpeed = 1.6;
		this.playerInvincible = false;
		this.firing = false;
		this.fireDelay = 200;
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.projectiles = this.add.group();
		

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
		
		
		//-Wave-//
		this.start_wave();
		this.currentWave = 1;
		this.enemiesKilledThisWave = 0;
		this.enemiesPerWave = 10;
		this.enemiesAlive = 0;
		this.maxEnemiesAlive = 5;
		this.waveInProgress = false;
	}


	update() {
		//Enemy
		this.enemies.children.iterate((enemy) => {
			if (enemy && enemy.active) {
				this.move_enemy(enemy, enemy.speed + (0.05 * this.currentWave));
			}
		});
		//Player
		this.move_player(this.playerSpeed);
		
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.player_shoot();
		}
	}
	
	
	//-Wave-//
	start_wave() {
		const enemyArr = ["enemy1", "enemy2", "enemy3"];
		this.enemiesKilledThisWave = 0;
		this.waveInProgress = true;
		
		let spawnDelay = Math.max(1000 - (50 * this.currentWave), 100);
		this.spawnTimer = this.time.addEvent({
			delay: spawnDelay,
			callback: () => {
				if (this.enemiesAlive < this.maxEnemiesAlive && (this.enemiesKilledThisWave + this.enemiesAlive) < this.enemiesPerWave) {
					const enemyType = Phaser.Math.RND.pick(enemyArr);
					this.spawn_enemy(enemyType);
				}
			},
			callbackScope: this,
			loop: true
		});
	}

	spawn_enemy(enemyType) {
		let enemy;
		if (enemyType == "enemy1") {
			enemy = this.physics.add.sprite(0, 0, "enemy1");
			enemy.score = 5;
			enemy.initHealth = 1;
			enemy.speed = 1.5;
		} 
		else if (enemyType == "enemy2") {
			enemy = this.physics.add.sprite(0, 0, "enemy2");
			enemy.score = 10;
			enemy.initHealth = 2;
			enemy.speed = 1.25;
		} 
		else if (enemyType == "enemy3") {
			enemy = this.physics.add.sprite(0, 0, "enemy3");
			enemy.score = 15;
			enemy.initHealth = 3;
			enemy.speed = 1;
		}
		else {return;}
		
		enemy.health = enemy.initHealth; //Set enemy health
		enemy.play(`${enemyType}_anim`); //Set enemy animation
		
		//Spawn enemy
		enemy.x = Math.random() < 0.5 ? 0 : this.scale.width; //Spawn from left or right side of screen
		enemy.y = Math.random() * (this.scale.height - 20); //Set random y value
		this.enemies.add(enemy);
		
		//Add overlap detection
		this.physics.add.overlap(this.player, enemy, this.damage_player, null, this);
		this.physics.add.overlap(this.projectiles, enemy, this.damage_enemy, null, this);
		
		this.enemiesAlive++;
	}

	wave_clear_message() {
		let message = this.add.bitmapText(this.scale.width / 2, this.scale.height / 2, "pixelFont", "-Wave Cleared-", 32)

		message.setOrigin(0.5);
		message.setDepth(10); //Ensure it's above other elements
		message.setAlpha(0);  //Start invisible

		//Fade in
		this.tweens.add({
			targets: message,
			alpha: 1,
			duration: 500,
			yoyo: true,
			hold: 1500,
			onComplete: () => message.destroy()
		});
	}

	end_wave() {
		this.wave_clear_message()
		
		this.waveInProgress = false;
		this.spawnTimer.remove(); //Stop spawning
		
		this.currentWave++;
		this.waveLabel.text = "WAVE " + this.currentWave;
		
		//Increase difficulty
		this.enemiesPerWave += 5;
		this.maxEnemiesAlive++;
		
		//Short delay before next wave starts
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				this.start_wave();
			},
			callbackScope: this
		});
	}
	
	//--Player--//
	move_player(speed) {
		let xDir = 0;
		let yDir = 0;
		//Player can only move in 4 directions
		if (yDir == 0) {xDir = this.cursorKeys.right.isDown - this.cursorKeys.left.isDown;}
		if (xDir == 0) {yDir = this.cursorKeys.down.isDown - this.cursorKeys.up.isDown;}
		
		this.player_anim(xDir, yDir);
		
		this.player.x += xDir * speed;
		this.player.y += yDir * speed;
	}
	
	player_anim(xDir, yDir) {
		if (yDir == 1) {this.player.play("playerDown", true);}
		else if (yDir == -1) {this.player.play("playerUp", true);}
		else if (xDir == 1) {this.player.anims.play("playerRight", true);} 
		else if (xDir == -1) {this.player.play("playerLeft", true);}
		else {this.player.setFrame(0);}
	}
	
	player_shoot(){
		if (this.firing) {return;}
		this.firing = true;
		
		var bullet = new Bullet(this);
		this.projectiles.add(bullet);
		
		this.time.delayedCall(this.fireDelay, () =>{
			this.firing = false;
		});
	}
	
	damage_player(player, enemy) {
		if (this.invincible) {return;}
		this.invincible = true;
		
		//Subtract player health and check if player is dead
		if (--this.health <= 0) {
			//Subtract player life if health reaches 0 and has lives remaining
			if (--this.lives <= 0) {
				this.registry.set("score", this.score);
				this.scene.start("gameOver");
			}
			//Display lives left
			this.livesLabel.text = "LIVES x " + this.lives;
			var death = new Death(this, player.x, player.y);
			player.disableBody(true, true);
			//Reset player position
			this.time.addEvent({
				delay: 1000,
				callback: this.reset_player,
				callbackScope: this,
				loop: false
			});
		}
		
		this.healthLabel.text = "HEALTH " + this.health; //Update health display
		
		//Player flashes to indicate invincibility
		this.tweens.add({
			targets: player,
			alpha: 0.5,
			duration: 200,
			repeat: 5,
			yoyo: true,
			onComplete: () => {
				player.setAlpha(1);
				this.invincible = false;
			}
		});
	}
	
	reset_player() {
		this.player.enableBody(true, this.scale.width / 2, this.scale.height / 2, true, true); //Reset player co-ordinates
		//Set and display player health
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
	
	damage_enemy(projectile, enemy) {
		projectile.destroy();
		if (--enemy.health <= 0) {
			var death = new Death(this, enemy.x, enemy.y);
			enemy.destroy(); //Permanently remove
			this.enemiesAlive--;
			this.enemiesKilledThisWave++;
			this.score += enemy.score;
			this.scoreLabel.text = "SCORE " + this.score;
			
			//Check if wave completed
			if (this.enemiesKilledThisWave >= this.enemiesPerWave) {
				this.end_wave();
			}
		}
	}
}