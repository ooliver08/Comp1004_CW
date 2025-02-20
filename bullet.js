class Bullet extends Phaser.GameObjects.Sprite{
	constructor(scene) {
		var x = scene.player.x;
		var y = scene.player.y;
		var faceDir = scene.player.anims.currentAnim.key;
		
		super(scene, x, y, "bullet");
		scene.add.existing(this);
		scene.physics.world.enableBody(this);
		
		if (faceDir == "playerUp") {this.body.velocity.y =- 250;}
		else if (faceDir == "playerRight") {this.body.velocity.x =+ 250;}
		else if (faceDir == "playerDown") {this.body.velocity.y =+ 250;}
		else if (faceDir == "playerLeft") {this.body.velocity.x =- 250;}
		
		//Ensure that all bullets are destroyed
		this.setActive(true);
        this.setVisible(true);
        scene.time.delayedCall(2000, () => {
            this.destroy();
        });
	}
}
