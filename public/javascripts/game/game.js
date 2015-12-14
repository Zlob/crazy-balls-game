define(['box2d', 'walls'], function(box, Walls){
    
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
    
    Player = function(world, x, y, scoreArea){
        
        bodyDef = new b2BodyDef();   
        bodyDef.type = b2Body.b2_dynamicBody;    
        bodyDef.position.x = x;
        bodyDef.position.y = y;
        bodyDef.linearDamping = 0.5;
        
        fixDef = new b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.5;       
        fixDef.shape = new b2CircleShape;
        fixDef.shape.SetRadius(1);

        
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);    
        this.score = 0;
        this.scoreArea = scoreArea;
        this.lastFire = 0;
        
        this.move = function(x, y){
            this.body.ApplyImpulse(new b2Vec2(x, y), this.body.GetPosition());
        }
        
        this.fire = function(){
            if(this.lastFire  + 10000 < Date.now()){
                var velocityVector = this.body.GetLinearVelocity();    
                this.move(velocityVector.x * 10, velocityVector.y * 10);
                this.lastFire  = Date.now();
            }           
        }
        
        this.addScore = function(score){
            this.score += score;
        }
        
        this.getScore = function(){
            return this.score;
        }
        
        this.getScoreArea = function(){
            return this.scoreArea;
        }
    }
    
    var DP_NORMAL = 1;
    var DP_HIDING = 2;
    var DP_SHOWING = 3;
    
    DominationPoint = function(x, y, r){
        this.position = {x: x, y: y};
        this.maxR = r;
        this.r = r;
        this.renderTime = Date.now();
        this.status = DP_NORMAL;       
        this.lifeTime = 10000;
        
        
        this.move = function(x, y){
            this.position.x = x;
            this.position.y = y;
        }
        
        this.getRandom = function(min, max){
            return Math.floor(Math.random() * (max - min) + min );
        }
        
        this.moveRandom = function(){
            //30 - толщина стен
            var xMax = 1920 - 30 - this.maxR;
            var xMin = this.maxR + 30;
            var yMax = 1080 - 30 - this.maxR;
            var yMin = this.maxR + 30;
            x = this.getRandom(xMin, xMax);
            y = this.getRandom(yMin, yMax);
            this.move(x,y);
        }
        
        this.isInArea = function(x,y){
            x = x*30;
            y = y*30;
            return (Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.r, 2) );
        }
        
        this.render = function(ctx){
            if(this.status == DP_NORMAL && Date.now() - this.renderTime > this.lifeTime){
                this.status = DP_HIDING;
            }
            if(this.status == DP_HIDING){
                if(this.r > 1){
                    this.r -= 1;    
                }
                else{
                    this.moveRandom();
                    this.status = DP_SHOWING;
                }                
            }
            if(this.status == DP_SHOWING){
                if(this.r < this.maxR){
                    this.r +=1;
                }
                else{
                    this.renderTime = Date.now();
                    this.lifeTime = this.getRandom(5, 30) * 1000;
                    this.status = DP_NORMAL;
                }                
            }
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
        
    }


    Game = function(playersNum){
        
        var self = this;

        this.playersNum = playersNum;
        this.players = [];
        this.canvas = null;
        this.ctx = null;
        this.parametrs = {
            backgroundColor : '#202020',
            width : 1920,
            height : 1080,
            metr : 30
        }
        
        this.playersSrartPosition = [
            {x: 5, y: 5, scoreArea: {x: 65, y: 40}},
            {x: 59, y: 5, scoreArea: {x: 1785, y: 40}},
            {x: 5, y: 31, scoreArea: {x: 65, y: 1060}},
            {x: 59, y: 31, scoreArea: {x: 1785, y: 1060}}
        ];
        

        this.world =  new b2World( new b2Vec2(0, 0) ,true); // doSleep флаг.

        this.playerAction = function(data){
            for(var playerId in data)
            {
                var playerActions = data[playerId];
                var player = this.players[playerId];
                for(var action in playerActions){
                    if(action == 'playerMove'){
                        var actionData = playerActions[action];
                        player.move(actionData.x, actionData.y);
                    }
                    if(action == 'playerFire'){
//                         var actionData = playerActions[action];
//                         player.fire(actionData.x, actionData.y);
                        player.fire();
                    }
                }

            }
        }

        this.startGame = function(canvas){
            this,canvas = canvas;
            this.ctx = canvas.getContext('2d');
            
            this.walls = new Walls(this);
            this.buildLevel();
            this.initDraw();
            window.setInterval(this.update, 1000 / 60);
            console.log('start');
        }

        this.update = function() {
            self.world.Step(1/60, 10, 10);
            self.world.DrawDebugData();
            self.calculateScore();
            
            self.checkGameOver();
            
            self.render();
            
            self.world.ClearForces();            
        }

        this.initDraw = function() {
            debugDraw = new b2DebugDraw();

            debugDraw.SetSprite(this.ctx);
            debugDraw.SetDrawScale(30.0);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(debugDraw);   
        }

        this.buildLevel = function() {
            for(var i = 0; i < this.playersNum; i++){
                var position = this.playersSrartPosition[i];
                this.players[i] = new Player(this.world, position.x, position.y, position.scoreArea);  
            }     
            this.dominationPoint = new DominationPoint(960, 540, 75);
        }
        
        this.showPlayersScore = function(){
            var self = this;
            this.players.forEach(function(player){
                var score = player.getScore();
                var scoreArea  = player.getScoreArea();
                self.showScore(score, scoreArea);
            });
        }
        
        this.showScore = function(score, scoreArea){
            this.ctx.font = "30px Arial";
            this.ctx.fillText(score, scoreArea.x, scoreArea.y);
        }
                
        this.calculateScore = function(){
            var self = this;
            this.players.forEach(function(player){
                var playerPosition = player.body.GetPosition();
                if(self.dominationPoint.isInArea(playerPosition.x, playerPosition.y)){
                    player.addScore(1);
                }
            });
        }
        
        this.render = function(){      
//             this.ctx.clearRect(0, 0, this.parametrs.width, this.parametrs.height);
            
//             this.showBackGround();
            
            this.walls.render();
            this.showPlayersScore();
            this.dominationPoint.render(this.ctx);
//             this.ctx.restore();
        }
        
        this.checkGameOver = function(){
            var gameIsOver = this.players.some(function(player){
                return player.getScore() >= 1000;
            });
            if(gameIsOver){
                console.log("GAME_OVER");
            }
        }
        
        this.showBackGround = function(){
            this.ctx.fillStyle = this.parametrs.backgroundColor;
            this.ctx.fillRect(0, 0, this.parametrs.width, this.parametrs.height);
        }
    }
    return Game;
})
