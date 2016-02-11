define(['../Helper','box2d'], function(Helper) {
    
    var LIGHTER = 1;
    var DARKER = 2;
        
    var Player = function(world, ctx, scoreArea, scoreAudio, options){
                        
        this.type = 'Player';
        
        this.world = world;
        this.ctx = ctx;
        
        this.r = options.r;
        this.x = options.x;
        this.y = options.y;
        
        this.density = options.density;
        this.friction = options.friction;
        this.restitution = options.restitution;
        this.linearDamping = options.linearDamping;
        
        this.color = options.color;
        this.flashColor = options.flashColor;
        this.borderColor = options.borderColor;
        this.currentColor = options.color;
        
        this.name = options.name;
        this.id = options.id;
        
        this.body = this._getBody();   
        
        this.isFlashing = false;
        this.flashingStage = LIGHTER;
        this.flashingCount = 0;
        this.maxFlashingCount = 10;
        
        this.score = 0;
        this.lastFire = 0;
        this.scoreArea = scoreArea;
        this.scoreAudio = scoreAudio;        
                
    }
    
    Player.prototype.move = function(x, y){
        this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(x, y), this.body.GetPosition());
    }

    Player.prototype.fire = function(){
        if(this.lastFire  + 10000 < Date.now()){
            var velocityVector = this.body.GetLinearVelocity();    
            this.move(velocityVector.x * 10, velocityVector.y * 10);
            this.lastFire  = Date.now();
        }           
    }

    Player.prototype.addScore = function(score){
        this.score += score;
    }

    Player.prototype.getScore = function(){
        return this.score;
    }

    Player.prototype.setIsFlashing = function(value){
        if(value == true && this.isFlashing != value){
            this.scoreAudio.play({loop : true});    
            this.currentColor = this.getColor();
        }
        else if(value == false){
            this.scoreAudio.setOptions({loop : false});      
            this.currentColor = this.color;
        }
        this.isFlashing = value;
    }
    
    
    Player.prototype.getColor = function(){
        if(this.flashingStage == LIGHTER){
            this.flashingCount++;
            if(this.flashingCount >= this.maxFlashingCount){
                this.flashingStage = DARKER;
            }
            return this.flashColor;
        }
        else{
            this.flashingCount--;
            if(this.flashingCount <= 0){
                this.flashingStage = LIGHTER;
            }
            return this.color;
        }
    }

    Player.prototype.render = function(){
        this.ctx.save();
        var position = this.body.GetPosition();
        var x = this.toPixels(position.x);
        var y = this.toPixels(position.y);
        this.ctx.fillStyle = this.currentColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.stroke();
        this.ctx.restore();
        this.scoreArea.render(this.getScore());
    }


        
    Player.prototype._getBody = function(){
        var fixDef = this._getFixDef(); 
        fixDef.shape = this._getShape();
        var bodyDef = this._getBodydef();

        var body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        body.SetUserData(this);
        return body;
    }

    Player.prototype._getFixDef = function(){
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.density = this.density;
        fixDef.friction = this.friction;
        fixDef.restitution = this.restitution; 
        return fixDef;
    }

    Player.prototype._getShape = function(){
        var shape = new Box2D.Collision.Shapes.b2CircleShape();
        shape.SetRadius(this.toMetr(this.r));

        return shape;
    }

    Player.prototype._getBodydef = function(){
        var bodyDef = new Box2D.Dynamics.b2BodyDef();            
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.linearDamping = this.linearDamping;
        bodyDef.position.Set(this.toMetr(this.x), this.toMetr(this.y));

        return bodyDef;
    }
    
    for(var property in Helper){
        Player.prototype[property] = Helper[property]; 
    }
    
    return Player;
});