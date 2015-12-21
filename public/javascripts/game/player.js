define(['box2d'], function() {
        
    var Player = function(world, ctx, gameOptions, scoreArea, options){
                        
        this.world = world;
        this.ctx = ctx;
        this.options = options; 
        this.gameOptions = gameOptions;
        this.body = null;       
        
        this.score = 0;
        this.lastFire = 0;
        this.scoreArea = scoreArea;
        
        this.init = function(){
            var fixDef = new Box2D.Dynamics.b2FixtureDef();
            fixDef.density = 1;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.5;       
            fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape;
            fixDef.shape.SetRadius(this.toMetr(this.options.r));
            
            var bodyDef = new Box2D.Dynamics.b2BodyDef();   
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;    
            bodyDef.linearDamping = 0.5;
            bodyDef.position.Set(this.toMetr(this.options.x), this.toMetr(this.options.y));
            this.body = this.world.CreateBody(bodyDef);    
            this.body.CreateFixture(fixDef);  

            return this;
        }    

        
        this.move = function(x, y){
            this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(x, y), this.body.GetPosition());
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
     
        this.render = function(){
            this.ctx.save();
            var position = this.body.GetPosition();
            var x = position.x * 30;
            var y = position.y * 30;
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.options.r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            this.scoreArea.render(this.getScore());
        }
        
        this.toMetr = function(pixels){
            return pixels / this.gameOptions.pixelsInMetr;
        }
    }
    
    return Player;
});