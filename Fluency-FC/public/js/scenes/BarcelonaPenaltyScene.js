class BarcelonaPenaltyScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.BARCELONA_PENALTY });
        this.state = 'SETUP';
        this.powerBarValue = { value: 0 };
        this.shotDirection = 0;
    }

    preload() {
        this.load.image('barcelona_penalty_bg', 'images/barcelona_penalty.png');
        this.load.atlas('ball_sprite', 'images/ball_sprite.png', 'images/ball_sprites.json');
        this.load.atlas('kicker_sprite', 'images/kicker_sprite.png', 'images/kicker_sprite.json');
        this.load.atlas('keeper_sprite', 'images/keeper_sprite.png', 'images/keeper_sprite.json');
    }

    create() {
        console.log('BarcelonaPenaltyScene created');
        this.input.keyboard.removeAllKeys(true);
        
        this.state = 'SETUP';
        this.powerBarValue = { value: 0 };
        this.shotDirection = 0;

        const bg = this.add.image(400, 300, 'barcelona_penalty_bg');
        bg.setScale(this.scale.width / bg.width);

        const PENALTY_SPOT_X = 400;
        const PENALTY_SPOT_Y = 450;
        
        this.ball = this.add.sprite(PENALTY_SPOT_X, PENALTY_SPOT_Y - 150, 'ball_sprite', 'ball1');
        this.ball.setScale(0.15);

        this.powerBar = this.add.graphics();
        this.powerBarBg = this.add.graphics();
        
        this.powerBarConfig = {
            x: 250,
            y: 550,
            width: 300,
            height: 20
        };

        this.powerBarBg.lineStyle(2, 0xFFFFFF);
        this.powerBarBg.strokeRect(this.powerBarConfig.x, this.powerBarConfig.y, this.powerBarConfig.width, this.powerBarConfig.height);
        this.powerBarBg.setVisible(false);

        this.instructionText = this.add.text(400, 650, 'PRESS SPACE TO SHOOT', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const spaceKey = this.input.keyboard.addKey('SPACE');
        spaceKey.on('down', () => {
            switch (this.state) {
                case 'SETUP':
                    this.startRunUp();
                    break;
                case 'AIMING':
                    this.startPowerBar();
                    break;
                case 'POWER':
                    this.takeShot();
                    break;
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.createAnimations();

        const PLAYER_START_Y = 500;
        this.player = this.add.sprite(PENALTY_SPOT_X, PLAYER_START_Y, 'kicker_sprite', 'idle1');
        this.player.setScale(0.5);
        this.player.play('player_idle');

        this.keeper = this.add.sprite(400, 120, 'keeper_sprite', 'idle');
        this.keeper.setScale(0.25);
        this.keeper.play('keeper_idle');

        this.createInstructionsBox();
    }

    createAnimations() {
        this.anims.create({
            key: 'ball_spin',
            frames: this.anims.generateFrameNames('ball_sprite', {
                prefix: 'ball',
                start: 1,
                end: 9,
                zeroPad: 0
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNames('kicker_sprite', {
                prefix: 'idle',
                start: 1,
                end: 6,
                zeroPad: 0
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player_celebrate',
            frames: this.anims.generateFrameNames('kicker_sprite', {
                prefix: 'celebrate',
                start: 1,
                end: 2,
                zeroPad: 0
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'player_cry',
            frames: this.anims.generateFrameNames('kicker_sprite', {
                prefix: 'cry',
                start: 1,
                end: 1,
                zeroPad: 0
            }),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_idle',
            frames: [{ key: 'keeper_sprite', frame: 'idle' }],
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_celebrate',
            frames: [{ key: 'keeper_sprite', frame: 'celebrate1' }],
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_cry',
            frames: [{ key: 'keeper_sprite', frame: 'cry1' }],
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_left',
            frames: [
                { key: 'keeper_sprite', frame: 'left1' },
                { key: 'keeper_sprite', frame: 'left2' }
            ],
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_right',
            frames: [
                { key: 'keeper_sprite', frame: 'right1' },
                { key: 'keeper_sprite', frame: 'right2' }
            ],
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'keeper_centre',
            frames: [{ key: 'keeper_sprite', frame: 'centre1' }],
            frameRate: 1,
            repeat: 0
        });
    }

    createInstructionsBox() {
        const instructions = [
            '1. SPACE to start',
            '2. ← → to aim',
            '3. SPACE for power',
            '4. SPACE to shoot'
        ];

        const instructionsBox = this.add.graphics();
        instructionsBox.fillStyle(0x000000, 0.7);
        instructionsBox.fillRect(600, 20, 180, 100);

        instructions.forEach((line, i) => {
            this.add.text(610, 30 + (i * 22), line, {
                fontSize: '14px',
                fontFamily: 'Press Start 2P',
                color: '#ffffff'
            });
        });
    }

    update() {
        if (this.state === 'AIMING' || this.state === 'POWER') {
            if (this.cursors.left.isDown) {
                this.shotDirection = -1;
            } else if (this.cursors.right.isDown) {
                this.shotDirection = 1;
            } else {
                this.shotDirection = 0;
            }
        }
    }

    startRunUp() {
        this.state = 'AIMING';
        this.shotDirection = 0;
        this.instructionText.setText('USE ARROWS TO AIM, SPACE FOR POWER');
        
        this.tweens.add({
            targets: this.player,
            y: this.ball.y + 40,
            duration: 1500,
            ease: 'Linear',
            onComplete: () => {
                this.player.play('player_idle');
            }
        });
    }

    startPowerBar() {
        this.state = 'POWER';
        this.powerBarValue = 0;
        this.powerBarBg.setVisible(true);
        this.instructionText.setText('PRESS SPACE TO SET POWER');

        this.powerBarTween = this.tweens.add({
            targets: this,
            powerBarValue: 100,
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                this.powerBar.clear();
                const width = (this.powerBarValue / 100) * this.powerBarConfig.width;
                let color = this.powerBarValue < 33 ? 0x00FF00 : this.powerBarValue < 66 ? 0xFFFF00 : 0xFF0000;
                this.powerBar.fillStyle(color);
                this.powerBar.fillRect(
                    this.powerBarConfig.x,
                    this.powerBarConfig.y,
                    width,
                    this.powerBarConfig.height
                );
            }
        });
    }

    takeShot() {
        const finalPower = this.powerBarValue / 100;
        if (this.powerBarTween) {
            this.powerBarTween.stop();
        }
        this.powerBar.clear();
        this.powerBarBg.setVisible(false);
        
        this.state = 'KICK';
        this.instructionText.setVisible(false);
        
        let direction = 0;
        if (this.cursors.left.isDown) {
            direction = -1;
        } else if (this.cursors.right.isDown) {
            direction = 1;
        }
        
        const targetX = 400 + (direction * 100);
        const targetY = 80;
        
        this.tweens.add({
            targets: this.player,
            x: this.player.x + (direction * 50),
            duration: 500,
            ease: 'Linear'
        });

        let keeperDirection;
        const saveChance = Math.random();
        
        // Make the final even harder - only 10% chance keeper guesses right
        if (saveChance < 0.1) {
            if (direction < 0) keeperDirection = 'left';
            else if (direction > 0) keeperDirection = 'right';
            else keeperDirection = 'centre';
        } else {
            if (direction <= 0) keeperDirection = 'right';
            else keeperDirection = 'left';
        }
        
        this.keeper.play(`keeper_${keeperDirection}`);
        
        let keeperX = this.keeper.x;
        if (keeperDirection === 'left') {
            keeperX -= 100;
        } else if (keeperDirection === 'right') {
            keeperX += 100;
        }
        
        this.tweens.add({
            targets: this.keeper,
            x: keeperX,
            duration: 500,
            ease: 'Quad.easeOut'
        });

        const shotSpeed = 600 + (finalPower * 200);
        
        this.tweens.add({
            targets: this.ball,
            x: targetX,
            y: targetY,
            duration: Math.max(400, 1000 - (finalPower * 400)),
            ease: 'Quad.easeOut',
            onComplete: () => {
                const isSaved = (
                    (keeperDirection === 'left' && direction < 0) ||
                    (keeperDirection === 'right' && direction > 0) ||
                    (keeperDirection === 'centre' && direction === 0)
                );

                if (isSaved) {
                    this.tweens.add({
                        targets: this.ball,
                        x: this.ball.x + (direction * -50),
                        y: this.ball.y + 50,
                        duration: 500,
                        ease: 'Bounce.easeOut'
                    });
                    this.keeper.play('keeper_celebrate');
                } else {
                    this.tweens.add({
                        targets: this.ball,
                        y: targetY - 10,
                        duration: 300,
                        ease: 'Linear',
                        yoyo: true
                    });
                    this.keeper.play('keeper_cry');
                }
                
                this.player.play(isSaved ? 'player_cry' : 'player_celebrate');
                this.showResult(!isSaved);
            }
        });
    }

    showResult(isGoal) {
        const resultText = isGoal ? '¡GOOOOOOL!' : '¡SALVADO!';
        this.add.text(400, 300, resultText, {
            fontSize: '48px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.continueText = this.add.text(400, 400, 'Press SPACE to continue', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const spaceKey = this.input.keyboard.addKey('SPACE');
        spaceKey.once('down', () => {
            if (isGoal) {
                this.scene.start(SceneKeys.VICTORY_TROPHY);
            } else {
                // Set a flag in game state to indicate we're in the final
                this.game.gameState.inBarcelonaFinal = true;
                this.scene.start(SceneKeys.MISS);
            }
        });

        this.tweens.add({
            targets: this.continueText,
            alpha: 0,
            duration: 500,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
    }
} 