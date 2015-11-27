Player = function(id){
    this.id = id;       
}

Game = function(){
    this.players = {};


    var self = this;

    this.init = function(){
        this.socket = io();
        this.socket.emit('addGame');
        this.socket.on('playerLinks', function(msg){
            self.showLinks(msg);
        });
        this.socket.on('addPlayer', function(msg){
            self.players[msg.player_id] = new Player( msg.player_id);
            if(Object.keys(self.players).length == 1){
                self.startGame();
            }
            console.log(msg);
        });
        


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
            
            
            self.socket.on('playerMove', function(msg){
                var id = msg.player_id;
                var index = parseInt(id) - 1 ;
                var player = players[index];
                Body.applyForce(player, player.position, {x:(msg.x/500),y:(msg.y/500)})
//                 Body.translate(player1, {x:msg.x,y:msg.y})
                console.log('playerMove', msg)
//                 self.players[msg.id-1].move(msg.x, msg.y);
            });
            
        }
    };

    this.showLinks = function(data){
        var container = $('.game-field');
        data.links.forEach(function(link, index){
//             var baseDiv = document.createElement( "div" );
            var linkDiv = document.createElement( "div" );
            var a = document.createElement( "a" );
            a.href = link;
            a.target = '_blank';
            a.text = 'link';
            
            $(linkDiv).append(a);

            $(linkDiv).addClass('link');
            var id = 'link-' + ++index;
            linkDiv.id = id;
            container.append(linkDiv);

            var qrcode = new QRCode(document.getElementById(id), {
                text: link,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            })
            });
    }



}

var game = new Game();
game.init();