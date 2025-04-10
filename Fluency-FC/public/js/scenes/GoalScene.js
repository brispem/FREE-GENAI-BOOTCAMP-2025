class GoalScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.GOAL });
    }

    preload() {
        // Add loading event handlers
        this.load.on('complete', () => {
            console.log('Assets loaded successfully');
        });

        this.load.on('loaderror', (fileObj) => {
            console.error('Error loading:', fileObj.src);
        });

        this.load.image('progress_next', 'images/progress_to_next_round.png');
    }

    create() {
        // Set background color just in case
        this.cameras.main.setBackgroundColor('#000000');

        // Add background with error handling
        try {
            const bg = this.add.image(400, 300, 'progress_next');
            // Adjust scale to fit screen while maintaining aspect ratio
            const scaleX = this.cameras.main.width / bg.width;
            const scaleY = this.cameras.main.height / bg.height;
            const scale = Math.min(scaleX, scaleY);
            bg.setScale(scale);
        } catch (error) {
            console.error('Error displaying background:', error);
        }

        // Add prompt text with shadow for better visibility
        const promptText = this.add.text(400, 500, 'Press SPACE to continue', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Add text shadow
        promptText.setShadow(2, 2, '#000000', 2, true, true);

        // Make text blink
        this.tweens.add({
            targets: promptText,
            alpha: 0,
            duration: 500,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        // Add space bar handler with fixed progression logic
        this.input.keyboard.once('keydown-SPACE', () => {
            console.log('Current city before transition:', this.game.gameState.currentCity);
            
            // Determine next scene based on current city
            let nextScene;
            switch(this.game.gameState.currentCity) {
                case 0: // Just beat Sevilla
                    nextScene = SceneKeys.MALLORCA_MAP;
                    break;
                case 1: // Just beat Mallorca
                    nextScene = SceneKeys.MADRID_MAP;
                    break;
                case 2: // Just beat Madrid
                    nextScene = SceneKeys.BARCELONA_MAP; // For future implementation
                    break;
                default:
                    nextScene = SceneKeys.TITLE; // Fallback to title if something goes wrong
            }

            // Increment the city counter before transitioning
            this.game.gameState.currentCity++;
            console.log('Transitioning to:', nextScene);
            console.log('Current city after increment:', this.game.gameState.currentCity);
            
            this.scene.start(nextScene);
        });

        // Debug info
        console.log('GoalScene created');
        console.log('Current game state:', this.game.gameState);
    }

    update() {
        // Add any frame-by-frame updates here if needed
    }
} 