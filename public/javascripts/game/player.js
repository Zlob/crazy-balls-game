define(['box2d'], function() {
    
    var LIGHTER = 1;
    var DARKER = 2;
        
    var Player = function(world, ctx, gameOptions, scoreArea, options){
                        
        this.type = 'Player';
        this.world = world;
        this.ctx = ctx;
        this.options = options; 
        this.gameOptions = gameOptions;
        this.body = null;   
        
        this.name = options.name;
        this.id = options.id;
        this.isFlashing = false;
        this.flashingStage = LIGHTER;
        this.flashingCount = 0;
        this.maxFlashingCount = 10;
        
        this.score = 0;
        this.lastFire = 0;
        this.scoreArea = scoreArea;
        this.scoreAudio = null;
        this.bounceAudios = [];
        
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
            this.body.SetUserData(this);
            this.scoreAudio = new Audio(this.gameOptions.scoreSound);
            
            //load audio 5 times to simulate a number bounces per time
            this.bounceAudios.push(new Audio(this.gameOptions.bounceSound));
            this.bounceAudios.push(new Audio(this.gameOptions.bounceSound));
            this.bounceAudios.push(new Audio(this.gameOptions.bounceSound));
            this.bounceAudios.push(new Audio(this.gameOptions.bounceSound));
            this.bounceAudios.push(new Audio(this.gameOptions.bounceSound));
            
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
        
        this.setIsFlashing = function(value){
            if(value == true && this.isFlashing != value){
                this.scoreAudio.loop = true;
                this.scoreAudio.play();                
            }
            else if(value == false && this.isFlashing != value){
                this.scoreAudio.loop = false;
            }
            this.isFlashing = value;
        }
     
        this.render = function(){
            this.ctx.save();
            var position = this.body.GetPosition();
            var x = position.x * 30;
            var y = position.y * 30;
            this.ctx.fillStyle = this.getColor();
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.options.r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = this.options.borderColor;
            this.ctx.stroke();
            this.ctx.restore();
            this.scoreArea.render(this.getScore());
        }
        
        this.getColor = function(){
            if(this.isFlashing){
                if(this.flashingStage == LIGHTER){
                    this.flashingCount++;
                    if(this.flashingCount >= this.maxFlashingCount){
                        this.flashingStage = DARKER;
                    }
                    return this.options.flashColor;
                }
                else{
                    this.flashingCount--;
                    if(this.flashingCount <= 0){
                        this.flashingStage = LIGHTER;
                    }
                    return this.options.color;
                }
            }
            else{
                return this.options.color;
            }
        }
        
        this.playBounce = function(){
            for(var i = 0; i  < this.bounceAudios.length; i++){
                var audio = this.bounceAudios[i];
                if(audio.paused){
                    audio.play();
                    break;
                }
            }
        }
        
        
        this.toMetr = function(pixels){
            return pixels / this.gameOptions.pixelsInMetr;
        }
    }
    
    return Player;
});