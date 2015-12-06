Game = function(players_num){
    var self = this;
    
    this.players_num = players_num;
    this.players = [];
    this.playersSrartPosition = {
        1: {x: 5, y: 5},
        2: {x: 8, y: 8},
        3: {x: 11, y: 11},
        4: {x: 14, y: 14}
    }
    
    b2AABB  = Box2D.Collision.b2AABB;
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    b2Body = Box2D.Dynamics.b2Body;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
    b2ContactListener = Box2D.Dynamics.b2ContactListener;
    
    this.world =  new b2World( new b2Vec2(0, 0) ,true); // doSleep флаг.
    
    this.playerAction = function(playerId, action, data){
        console.log(playerId, action, data);
        var index = parseInt(playerId);
        var player = this.players[index];
        player.ApplyImpulse(new b2Vec2(data.x, data.y), player.GetPosition());
    }
    
    this.startGame = function(){
            
        $('body').empty().append('<canvas id="canvas" width="1920" height="1080" style="background-color:#333333;"></canvas>');       
        var canvas = $('#canvas').get(0);
        var context = canvas.getContext('2d');

        this.buildWorld();
        this.buildLevel();
        this.initDraw();
        window.setInterval(this.update, 1000 / 60);
        console.log('start');
    }
        
    this.update = function() {
        self.world.Step(1/60, 10, 10);
        self.world.DrawDebugData();
        self.world.ClearForces();            
    }
    
    this.initDraw = function() {
        debugDraw = new b2DebugDraw();

        debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);   
    }

    this.buildWorld = function() {
        this.buildWall(32, 1, 32, 1);//top
        this.buildWall(32, 1, 32, 35);//bottom
        this.buildWall(1, 35, 1, 35);//left
        this.buildWall(1, 35, 64, 35);//right
    }
    
    this.buildWall = function(height, width, x, y){
        fixDef = new b2FixtureDef();

        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;    

        bodyDef = new b2BodyDef();            
        bodyDef.type = b2Body.b2_staticBody;

        fixDef = new b2FixtureDef();
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(height, width);
        bodyDef.position.Set(x, y);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
    
    this.buildLevel = function() {
        for(var i = 1; i <= this.players_num; i++){
            var position = this.playersSrartPosition[i];
            this.players[i] = this.createPlayer(position.x, position.y, 1);    
        }        
    }
    
    this.createPlayer = function(x,y, r) {
        bodyDef = new b2BodyDef();   
        fixDef = new b2FixtureDef();
        
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 1.0;    
        
        bodyDef.type = b2Body.b2_dynamicBody;       
        fixDef.shape = new b2CircleShape;
        fixDef.shape.SetRadius(1);

        bodyDef.position.x = x;
        bodyDef.position.y = y;
        var player = this.world.CreateBody(bodyDef);
        player.CreateFixture(fixDef);    
        return player;
    }
    
}


GameControl = function(players_num, game){
    this.players_num = players_num;
    this.gameId = null,
    this.game = game;
    this.players = 0;  

    this.init = function(){
        var self = this;
        this.socket = io();
        
        this.socket.emit('addGame', {players_num: self.players_num});
        
        
        
        this.socket.on('gameData', function(data){
            self.gameId = data.gameId;
            self.showLinks(data);
        });
        
        this.socket.on('addPlayer', function(data){
            self.playerReady(data.player_id, data.player_name);
            self.players++;
            
            if(self.players == self.players_num){
                self.socket.emit('startGame', {gameId: self.gameId});
//                 self.game = new Game();
                self.registerPlayerMove();
                self.game.startGame();
            }
            console.log(data);
        });       
    }
       
    this.registerPlayerMove = function(){
        var self = this;
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
    
    this.playerReady = function(player_id, player_name){
        console.log(player_id);
        var id = '#player-area-' + player_id;
        $(id).empty().append('<p>READY ' + player_name + '</p>');
    }
}

$( document ).ready(function(){
    var players_num = $('#players_num').attr('data-store');
    var game = new Game(players_num);
//     var game = {};
    var gameControl = new GameControl(players_num, game);
    gameControl.init();
}
);

