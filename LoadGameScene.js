class LoadGameScene extends Phaser.Scene {
	constructor() {
		super("loadGame");
	}
	
	preload() {
		this.load.image("background", "assets/images/background.png");
		//--Spritesheet--//
		//Enemy
		this.load.spritesheet("enemy1", "assets/spritesheets/enemy1.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("enemy2", "assets/spritesheets/enemy2.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("enemy3", "assets/spritesheets/enemy3.png", {frameWidth: 32,frameHeight: 32});
		
		this.load.spritesheet("death", "assets/spritesheets/explosion.png", {frameWidth: 16, frameHeight: 16});
		
		//Player
		this.load.spritesheet("playerUp", "assets/spritesheets/player_up.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("playerDown", "assets/spritesheets/player_down.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("playerRight", "assets/spritesheets/player_right.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("playerLeft", "assets/spritesheets/player_left.png", {frameWidth: 16, frameHeight: 16});
		
		
		this.load.image("bullet", "assets/images/bullet.png", {frameWidth: 8, frameHeight: 8});
	
		this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
	}
	
	create() {
		this.add.text(20, 20, "Loading...");
		this.scene.start("startMenu");
		
		//--Animation--//
		//Enemy
		this.anims.create({
			key: "enemy1_anim",
			frames: this.anims.generateFrameNumbers("enemy1"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "enemy2_anim",
			frames: this.anims.generateFrameNumbers("enemy2"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "enemy3_anim",
			frames: this.anims.generateFrameNumbers("enemy3"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "death",
			frames: this.anims.generateFrameNumbers("death"),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true
		});
		
		//Player
		this.anims.create({
			key: "playerUp",
			frames: this.anims.generateFrameNumbers("playerUp"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "playerDown",
			frames: this.anims.generateFrameNumbers("playerDown"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "playerRight",
			frames: this.anims.generateFrameNumbers("playerRight"),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "playerLeft",
			frames: this.anims.generateFrameNumbers("playerLeft"),
			frameRate: 8,
			repeat: -1
		});
	}
}
