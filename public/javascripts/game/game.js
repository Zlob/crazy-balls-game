define(['box2d'],function(){
    
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
        
        fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 3.0;
        fixDef.restitution = 0.5;       
        fixDef.shape = new b2CircleShape;
        fixDef.shape.SetRadius(1);

        
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);    
        this.score = 0;
        this.scoreArea = scoreArea;
        
        this.move = function(x, y){
            this.body.ApplyImpulse(new b2Vec2(x, y), this.body.GetPosition());
        }
        
        this.fire = function(){
            console.log('Fire');
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
        this.ctx = null;
        
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
                }

            }
        }

        this.startGame = function(context){
            this.ctx = context;
            this.buildWorld();
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

        this.buildWorld = function() {
            this.buildWall(32, 1, 32, 1);//top
            this.buildWall(32, 1, 32, 35);//bottom
            this.buildWall(1, 35, 1, 35);//left
            this.buildWall(1, 35, 63, 35);//right
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
            this.showPlayersScore();
            this.dominationPoint.render(this.ctx);
        }
        
        this.checkGameOver = function(){
            var gameIsOver = this.players.some(function(player){
                return player.getScore() >= 1000;
            });
            if(gameIsOver){
                console.log("GAME_OVER");
            }
        }
    }
    return Game;
})
