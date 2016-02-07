requirejs.config({
    baseUrl: 'javascripts/game/',
    paths: {
        bootstrap: "../../libs/bootstrap/dist/js/bootstrap",
        jquery: "../../libs/jquery/dist/jquery",
        requirejs: "../../libs/requirejs/require",
        box2d: "../../libs/box2dweb/Box2D",
        io: "/socket.io/socket.io.js",
        QRCode: "../../libs/qrcode-js/qrcode",
        swal: "../../libs/sweetalert/dist/sweetalert.min",
    },
    shim: {
        bootstrap: {
            deps: [ "jquery" ]
        }
    }
});


requirejs(["bootstrap", 'Game', 'GameController'], function(bootstrap, Game, GameControl){   
    $( document ).ready(function(){
        var playersNum = $('#players_num').attr('data-store');
        var gameControl = new GameControl(playersNum, Game);
        gameControl.init();
    });
});

