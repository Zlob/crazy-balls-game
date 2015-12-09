requirejs.config({
    baseUrl: 'javascripts/index/',
    paths: {
        bootstrap: "../../libs/bootstrap/dist/js/bootstrap",
        jquery: "../../libs/jquery/dist/jquery",
        requirejs: "../../libs/requirejs/require",
    },
    shim: {
        bootstrap: {
            deps: [ "jquery" ]
        }
    }
});


requirejs(["bootstrap"], function(bootstrap){   
    $('.play-button').on('click', function(){
        var playersNum = $('#players-num').val();
        var gameType = $('#game-type').val();
        var url = 'https://neutral-sierra-9500.codio.io/game?playersNum=' + playersNum + '&gameType=' + gameType;
        window.open(url,"_self")
    })
});

