define(function() {
    var Options = function(){
        var backgroundAudio = new Audio('/dominator/sounds/music_1.ogg');
        backgroundAudio.load();
        
        var scoreAudio = new Audio('/dominator/sounds/coin_2.wav');
        scoreAudio.load();
        
        var bounceAudio = new Audio('/dominator/sounds/bounce_1.wav');
        bounceAudio.load();
        this.gameOptions = {
            backgroundAudio : backgroundAudio,
            scoreAudio : scoreAudio,
            bounceAudio : bounceAudio
        };
        this.scoresOptions = {
        };
        
    }
    return Options;
});