const GAME_CONFIG = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a4c89',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        TitleScene,
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
};

const QUIZ_CONFIG = {
    timePerQuestion: 30000,
    successThresholds: {
        perfect: 0.9,  // 3 correct = 90% success
        good: 0.7,     // 2 correct = 70%
        fair: 0.5,     // 1 correct = 50%
        poor: 0.3      // 0 correct = 30%
    }
}; 