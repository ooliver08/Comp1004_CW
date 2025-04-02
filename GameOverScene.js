class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        //Add background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
        //Display Game Over
        this.add.bitmapText(this.scale.width / 2, this.scale.height / 2 - 50, "pixelFont", "-GAME OVER-", 32).setOrigin(0.5);
        //Display final score
        const score = this.registry.get("score") || 0;  //Get final score
        this.add.bitmapText(this.scale.width / 2, this.scale.height / 2, "pixelFont", `FINAL SCORE: ${score}`, 24).setOrigin(0.5);
        let returnButton = this.add.bitmapText(this.scale.width / 2, this.scale.height / 2 + 50, "pixelFont", "Return to Menu", 16)
			.setOrigin(0.5)
			.setInteractive();
   
        //Click
        returnButton.on("pointerdown", () => {
            this.scene.start("startMenu");
        });
        //Hover
        returnButton.on("pointerover", () => {
            returnButton.alpha = 0.5; //Transparent on hover
        });
        returnButton.on("pointerout", () => {
            returnButton.alpha = 1; //Restore alpha
        });
    }
}
