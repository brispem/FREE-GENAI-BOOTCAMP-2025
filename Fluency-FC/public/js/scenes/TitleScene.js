class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.TITLE });
        this.playerName = '';
    }

    preload() {
        // Load all initial images
        this.load.image('title_screen', 'images/title_screen.png');
        this.load.image('contract_screen', 'images/contract_screen.png');
        this.load.image('newspaper', 'images/newspaper_announcement.png');
        
        // Add loading bar
        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, 800 * value, 60);
        });
        
        this.load.on('complete', () => {
            progress.destroy();
        });
    }

    create() {
        // Add title screen and scale to fit
        const titleScreen = this.add.image(400, 300, 'title_screen');
        
        // Scale image to fit while maintaining aspect ratio
        const scaleX = this.cameras.main.width / titleScreen.width;
        const scaleY = this.cameras.main.height / titleScreen.height;
        const scale = Math.min(scaleX, scaleY);
        titleScreen.setScale(scale * 0.9); // Slightly smaller to ensure fit
        
        // Center the image
        titleScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Create text for name input - adjusted Y position to match gray box
        this.nameText = this.add.text(400, 515, '_', {  // Changed Y from 545 to 515
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Handle keyboard input
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter' && this.playerName.length > 0) {
                localStorage.setItem('playerName', this.playerName);
                this.scene.start(SceneKeys.CONTRACT);
            } else if (event.key === 'Backspace') {
                this.playerName = this.playerName.slice(0, -1);
            } else if (event.key.length === 1 && this.playerName.length < 10) {
                this.playerName += event.key.toUpperCase();
            }
            this.nameText.setText(this.playerName + '_');
        });
    }
} 