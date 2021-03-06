define(['../Helper','box2d'], function(Helper) {
    
    var LIGHTER = 1;
    var DARKER = 2;
        
    var Player = function(world, paper, scoreArea, scoreAudio, options){
                        
        this.type = 'Player';
        
        this.world = world;
        this.paper = paper;
        
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
        
        this.speedKoef = 1;
        
        this.bonus = undefined;
        
        this.circle = new this.paper.Path.Circle(new this.paper.Point(this.x, this.y), this.r);
        this.circle.strokeColor = this.borderColor;
        this.circle.fillColor = this.color;                
    }
    
    Player.prototype.move = function(x, y){
        this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(x*6*this.speedKoef, y*6*this.speedKoef), this.body.GetPosition());
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
        if(value == true){
            this.scoreAudio.play();    
            this.currentColor = this.getColor();
        }
        else if(value == false){  
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
        var position = this.body.GetPosition();
        this.x = this.toPixels(position.x);
        this.y = this.toPixels(position.y);
        this.circle.position.x = this.x;
        this.circle.position.y = this.y;
        this.scoreArea.render(this.getScore());
        this.circle.fillColor = this.currentColor;
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
    
    Player.prototype.addBonus = function(bonus){

        if(bonus.type == 'speed' || bonus.type == 'size'){
            if(this.bonus && this.bonus.activated){
                this.bonus.deactivate();
            }
            this.bonus = bonus;
            this.bonus.attach(this);
            this.bonus.activate();
            console.log(this.bonus.type);
        }
//         this.bonus = {type: bonus
                      
//                      };
//         if(this.bonus.type == 'speed'){
//             this.speedKoef = 3;
//             return;
//         }
//         if(this.bonus.type == 'size'){
//             this.circle.scale(2);
//         }
    }
    
    
    for(var property in Helper){
        Player.prototype[property] = Helper[property]; 
    }
    
    return Player;
});