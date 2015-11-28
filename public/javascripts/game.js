Game = function(players_num){
    this.players_num = players_num;
    
    this.playerAction = function(playerId, action, data){
        console.log(playerId, action, data);
//                     var id = data.player_id;
//             var index = parseInt(id) - 1 ;
//             var player = players[index];
//             Body.applyForce(player, player.position, {x:(data.x/500),y:(data.y/500)})
//             console.log('playerMove', data)
    }
    
    this.startGame = function(){
        console.log('start');
        $('#game-field').empty();
        // Matter.js - http://brm.io/matter-js/

        // Matter module aliases
        var Engine = Matter.Engine,
            World = Matter.World,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composites = Matter.Composites,
            MouseConstraint = Matter.MouseConstraint;
        Vector = Matter.Vector;


        // create a Matter.js engine
        var engine = Engine.create(document.getElementById('game-field'), {
            render: {
                options: {
                    height : 1080,
                    width : 1920
                }
            }
        });

        // add a mouse controlled constraint 
        var mouseConstraint = MouseConstraint.create(engine); //todo comment
        World.add(engine.world, mouseConstraint);

        var offset = 10,
            options = { 
                isStatic: true,
                render: {
                    visible: true
                }
            };

        engine.world.bodies = [];

        engine.world.gravity.y = 0;


        // these static walls will not be rendered in this sprites example, see options
        World.add(engine.world, [
            Bodies.rectangle(960, -offset, 1920.5 + 2 * offset, 50.5, options),
            Bodies.rectangle(960, 1080 + offset, 1920.5 + 2 * offset, 50.5, options),
            Bodies.rectangle(1920 + offset, 540, 50.5, 1080.5 + 2 * offset, options),
            Bodies.rectangle(-offset, 540, 50.5, 1080.5 + 2 * offset, options)
        ]);

        var playerOptions =  {
            density: 0.0005,
            frictionAir: 0.06,
            restitution: 0.5,
            friction: 0.01,
            render: {
                sprite: {
                    texture: 'http://brm.io/matter-js-demo-master/img/ball.png'
                }
            }
        };

        var players = [];

        players.push(Bodies.circle(100, 100, 46, playerOptions));
        players.push(Bodies.circle(100, 300, 46, playerOptions));
        players.push(Bodies.circle(300, 100, 46, playerOptions));
        players.push(Bodies.circle(300, 300, 46, playerOptions));          






        World.add(engine.world, players);

        var renderOptions = engine.render.options;
        renderOptions.background = 'http://brm.io/matter-js-demo-master/img/wall-bg.jpg';
        renderOptions.showAngleIndicator = false;
        renderOptions.wireframes = false;            
        renderOptions.height = 1080;
        renderOptions.width = 1920;

        engine.world.bounds.min.x = -Infinity;
        engine.world.bounds.min.y = -Infinity;
        engine.world.bounds.max.x = Infinity;
        engine.world.bounds.max.y = Infinity;

        // run the engine
        Engine.run(engine);
    }
}



GameControl = function(players_num, game){
    this.players_num = players_num;
    this.game = game;
    this.players = 0;  

    this.init = function(){
        var self = this;
        this.socket = io();
        
        this.socket.emit('addGame', {players_num: self.players_num});
        
        this.socket.on('playerLinks', function(data){
            self.showLinks(data);
        });
        
        this.socket.on('addPlayer', function(data){
            self.playerReady(data.player_id);
            self.players++;
            
            if(self.players == self.players_num){
                self.game.startGame();
            }
            console.log(data);
        });
        
        this.socket.on('playerMove', function(data){
            self.game.playerAction(data.player_id, 'playerMove', {x: data.x, y: data.y} );
        });
    }
       
    this.showLinks = function(data){
        data.links.forEach(function(link, index){
            var id = 'player-area-' + ++index;
            var cotainer = document.getElementById(id);
            $(cotainer).attr('href', link);
            $(cotainer).attr('target', '_blank');
            var qrcode = new QRCode(cotainer, {
                text: link,
                style: 'display: "inline-block"',
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            })
            });
    }
    
    this.playerReady = function(player_id){
        console.log(player_id);
        var id = '#player-area-' + player_id;
        $(id).empty().append('<p>READY</p>');
    }
}

$(document).ready(function(){
    var t = $('#players_num');
    var players_num = $('#players_num').attr('data-store');
    var game = new Game(players_num);
    var gameControl = new GameControl(players_num, game);
    gameControl.init();
}
);

