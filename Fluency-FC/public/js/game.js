// Create game instance
const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        TitleScene,
        ContractScene,
        NewspaperScene,
        ChangingRoomScene,
        SevillaMapScene,
        WelcomeSevillaScene,
        VSSevillaScene,
        SevillaPenaltyScene,
        MissScene,
        GoalScene,
        MallorcaMapScene,
        WelcomeMallorcaScene,
        VSMallorcaScene,
        MallorcaPenaltyScene,
        MadridMapScene,
        WelcomeMadridScene,
        VSMadridScene,
        MadridPenaltyScene,
        ReachFinalScene,
        BarcelonaMapScene,
        WelcomeBarcelonaScene,
        VSBarcelonaScene,
        BarcelonaPenaltyScene,
        VictoryTrophyScene,
        ChampionScene
    ]
});

// Add global game state
game.gameState = {
    playerName: '',
    currentCity: 0,
    cities: ['sevilla', 'mallorca', 'madrid', 'barcelona'],
    quizResults: {},
    progress: null
};