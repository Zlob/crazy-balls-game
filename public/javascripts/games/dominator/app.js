requirejs.config({
    baseUrl: 'javascripts/games/dominator',
    paths: {
        bootstrap: "../../../libs/bootstrap/dist/js/bootstrap",
        jquery: "../../../libs/jquery/dist/jquery",
        requirejs: "../../../libs/requirejs/require",
        box2d: "../../../libs/box2dweb/Box2D",
        io: "/socket.io/socket.io.js",
        QRCode: "../../../libs/qrcode-js/qrcode",
        swal: "../../../libs/sweetalert/dist/sweetalert.min",
        paper: "../../../libs/paper/dist/paper-full"
    },
    shim: {
        bootstrap: {
            deps: [ "jquery" ]
        },
        box2d: {
            exports: 'Box2D'
        }
    }
});


requirejs(["bootstrap", 'Game', '../GameController'], function(bootstrap, Game, GameControl){   
    $( document ).ready(function(){
        var playersNum = $('#players_num').attr('data-store');
        var gameControl = new GameControl(playersNum, Game);
        gameControl.init();
    });
});