class VictoryTrophyScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.VICTORY_TROPHY });
    }

    preload() {
        this.load.image('victory_trophy', 'images/victory_trophy_scene.png');
    }

    create() {
        const victoryScreen = this.add.image(400, 300, 'victory_trophy');
        const scaleX = this.cameras.main.width / victoryScreen.width;
        const scaleY = this.cameras.main.height / victoryScreen.height;
        const scale = Math.min(scaleX, scaleY);
        victoryScreen.setScale(scale * 0.9);
        victoryScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

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
            this.scene.start(SceneKeys.CHAMPION);
        });
    }
} 