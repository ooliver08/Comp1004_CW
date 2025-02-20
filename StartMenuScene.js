class StartMenuScene extends Phaser.Scene {
    constructor() {
        super("startMenu");
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setScale(1);

        //Title
        this.add.bitmapText(20, 40, "pixelFont", "GAME", 32);
        //Start button
        let startButton = this.add.bitmapText(40, 90, "pixelFont", "START", 16)
            .setInteractive();

        startButton.on("pointerdown", () => { //Click
            this.scene.start("playGame");
        });
        startButton.on("pointerover", () => { //Hover
            startButton.alpha = 0.5; //Transparent on hover
        });
        startButton.on("pointerout", () => {
            startButton.alpha = 1; //Restore alpha
        });

        //Controls
        this.add.bitmapText(40, 120, "pixelFont", "Use Arrow Keys to Move\nPress Space to Shoot", 16);
    }
}
