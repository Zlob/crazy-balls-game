requirejs.config({
    baseUrl: 'javascripts/game/',
    paths: {
        bootstrap: "/libs/bootstrap/dist/js/bootstrap",
        jquery: "/libs/jquery/dist/jquery",
        requirejs: "/libs/requirejs/require",
        io: "/socket.io/socket.io.js",
        
        player: "/javascripts/player/player"
    },
    shim: {
        bootstrap: {
            deps: [ "jquery" ]
        }
    }
});


requirejs(["bootstrap", 'player'], function(bootstrap, Player){   
    $( document ).ready(function(){
        
        var gameId = $('#game_id').html();
        var playerId = $('#player_id').html();
        var playerName = 'Player ' + (+playerId + 1);

        var player = new Player(gameId, playerId, playerName);
        player.init();
        
        
    });
});

