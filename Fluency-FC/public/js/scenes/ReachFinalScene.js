class ReachFinalScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.REACH_FINAL });
    }

    preload() {
        this.load.image('reach_final', 'images/reach_final.png');
    }

    create() {
        const finalScreen = this.add.image(400, 300, 'reach_final');
        const scaleX = this.cameras.main.width / finalScreen.width;
        const scaleY = this.cameras.main.height / finalScreen.height;
        const scale = Math.min(scaleX, scaleY);
        finalScreen.setScale(scale * 0.9);
        finalScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO CONTINUE', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: pressSpace,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SceneKeys.BARCELONA_MAP);
        });
    }
} 