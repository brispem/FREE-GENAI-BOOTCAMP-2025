class MissScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.MISS });
    }

    preload() {
        this.load.image('defeat_retry', 'images/defeat_retry_screen.png');
    }

    create() {
        // Add background
        const bg = this.add.image(400, 300, 'defeat_retry');
        bg.setScale(this.scale.width / bg.width);

        // Create container for buttons - adjust Y position as needed
        const buttonContainer = this.add.container(400, 420);

        // Add retry button on the left
        const retryButton = this.add.text(-100, 0, 'RETRY', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Add retro border for retry button
        const retryBorder = this.add.graphics();
        retryBorder.lineStyle(3, 0xffffff);
        retryBorder.strokeRect(
            retryButton.x - retryButton.width/2 - 10,
            retryButton.y - retryButton.height/2 - 5,
            retryButton.width + 20,
            retryButton.height + 10
        );

        // Add quit button on the right
        const quitButton = this.add.text(100, 0, 'QUIT', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Add retro border for quit button
        const quitBorder = this.add.graphics();
        quitBorder.lineStyle(3, 0xffffff);
        quitBorder.strokeRect(
            quitButton.x - quitButton.width/2 - 10,
            quitButton.y - quitButton.height/2 - 5,
            quitButton.width + 20,
            quitButton.height + 10
        );

        // Add buttons and borders to container
        buttonContainer.add([retryBorder, retryButton, quitBorder, quitButton]);

        // Make buttons interactive
        retryButton.setInteractive();
        quitButton.setInteractive();

        // Button hover effects
        retryButton.on('pointerover', () => {
            retryButton.setColor('#ffff00');
            retryBorder.clear();
            retryBorder.lineStyle(3, 0xffff00);
            retryBorder.strokeRect(
                retryButton.x - retryButton.width/2 - 10,
                retryButton.y - retryButton.height/2 - 5,
                retryButton.width + 20,
                retryButton.height + 10
            );
        });

        retryButton.on('pointerout', () => {
            retryButton.setColor('#ffffff');
            retryBorder.clear();
            retryBorder.lineStyle(3, 0xffffff);
            retryBorder.strokeRect(
                retryButton.x - retryButton.width/2 - 10,
                retryButton.y - retryButton.height/2 - 5,
                retryButton.width + 20,
                retryButton.height + 10
            );
        });

        quitButton.on('pointerover', () => {
            quitButton.setColor('#ffff00');
            quitBorder.clear();
            quitBorder.lineStyle(3, 0xffff00);
            quitBorder.strokeRect(
                quitButton.x - quitButton.width/2 - 10,
                quitButton.y - quitButton.height/2 - 5,
                quitButton.width + 20,
                quitButton.height + 10
            );
        });

        quitButton.on('pointerout', () => {
            quitButton.setColor('#ffffff');
            quitBorder.clear();
            quitBorder.lineStyle(3, 0xffffff);
            quitBorder.strokeRect(
                quitButton.x - quitButton.width/2 - 10,
                quitButton.y - quitButton.height/2 - 5,
                quitButton.width + 20,
                quitButton.height + 10
            );
        });

        // Modify the retry button click handler
        retryButton.on('pointerdown', () => {
            retryButton.setX(-102); // Slight push right effect
            this.time.delayedCall(100, () => {
                // Check if we're in the Barcelona final
                if (this.game.gameState.inBarcelonaFinal) {
                    this.scene.start(SceneKeys.BARCELONA_PENALTY);
                } else {
                    // Original logic for other cities
                    const currentCity = this.game.gameState.currentCity;
                    switch(currentCity) {
                        case 0: // Sevilla
                            this.scene.start(SceneKeys.SEVILLA_PENALTY);
                            break;
                        case 1: // Mallorca
                            this.scene.start(SceneKeys.MALLORCA_PENALTY);
                            break;
                        case 2: // Madrid
                            this.scene.start(SceneKeys.MADRID_PENALTY);
                            break;
                        default:
                            this.scene.start(SceneKeys.SEVILLA_PENALTY);
                    }
                }
            });
        });

        quitButton.on('pointerdown', () => {
            quitButton.setX(102); // Slight push right effect
            this.time.delayedCall(100, () => {
                window.close();
            });
        });

        // Update cursor position for horizontal layout
        const cursor = this.add.text(retryButton.x - retryButton.width/2 - 30, retryButton.y, '>', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Make cursor blink
        this.tweens.add({
            targets: cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
} 