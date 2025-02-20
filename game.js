window.onload = function() {
	
	var config = {
		type: Phaser.AUTO,
		width: 480,
		height: 270,
		pixelArt: true,
		backgroundColor: 0x000000,
		audio: {
			noAudio: true,
		},
		scene: [LoadGameScene, StartMenuScene, PlayGameScene, GameOverScene],
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		} 
	}
	
	var game = new Phaser.Game(config);
}