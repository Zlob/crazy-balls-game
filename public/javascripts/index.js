$(document).ready(function(){
    $('.play-button').on('click', function(){
        console.log('click');
        var playersNum = $('#players-num').val();
        var gameType = $('#game-type').val();
        var url = 'https://neutral-sierra.codio.io:9500/game?playersNum=' + playersNum + '&gameType=' + gameType;
        window.open(url,"_self")
    })
});