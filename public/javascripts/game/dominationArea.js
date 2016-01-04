define(function() {
    
    var DP_NORMAL = 1;
    var DP_HIDING = 2;
    var DP_SHOWING = 3;    
    
    DominationArea = function(ctx, gameOptions, wallOptioms, options){
        this.ctx = ctx;
        
        this.position = {
            x : null,
            y : null
        };
        
        this.options = options;
        
        this.gameOptions = gameOptions;
        this.wallOptions = wallOptioms;
        

        this.lifeTime = null;
        this.status = null;   
        this.backgroundImage = null;
        this.backgroundAngle = 0;
        
        this.init = function(){
            this.position =  {
                x: this.gameOptions.width / 2,
                y: this.gameOptions.height / 2
            };
            
            this.maxR = this.options.r;
            
            this.lifeTime = 600;        
            
            this.status = DP_NORMAL;   
            this.backgroundImage = new Image();
            this.backgroundImage.src = "/dominator/imgs/radial.png";
            
            return this;
        }
        
        this.move = function(x, y){
            this.position.x = x;
            this.position.y = y;
        }
        
        this.getRandom = function(min, max){
            return Math.floor(Math.random() * (max - min) + min );
        }
        
        this.moveRandom = function(){
            //30 - толщина стен
            var xMax = this.gameOptions.width - this.wallOptions.size - this.maxR;
            var xMin = this.maxR + this.wallOptions.size;
            var yMax = this.gameOptions.height - this.wallOptions.size - this.maxR;
            var yMin = this.maxR + this.wallOptions.size;
            var x = this.getRandom(xMin, xMax);
            var y = this.getRandom(yMin, yMax);
            this.move(x,y);
        }
        
        this.isInArea = function(x,y){
            return (Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.options.r, 2) );
        }
        
        
        this.checkAndToggle = function(){
            if(this.status == DP_NORMAL && this.lifeTime < 0){
                this.status = DP_HIDING;
            }
            if(this.status == DP_HIDING){
                if(this.options.r > 1){
                    this.options.r -= 1;    
                }
                else{
                    this.moveRandom();
                    this.status = DP_SHOWING;
                }                
            }
            if(this.status == DP_SHOWING){
                if(this.options.r < this.maxR){
                    this.options.r +=1;
                }
                else{
                    this.lifeTime = this.getRandom(this.options.minLifeTime, this.options.maxLifeTime) * 60;
                    this.status = DP_NORMAL;
                }                
            } 
            this.lifeTime--;
            this.backgroundAngle +=0.005;
        }


        
        this.render = function(){ 
            this.ctx.save();
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, this.options.r, 0, Math.PI * 2);
            this.ctx.clip();
//             this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.translate(this.position.x, this.position.y);
            this.ctx.rotate(this.backgroundAngle);
            this.ctx.drawImage(this.backgroundImage ,- this.maxR, -this.maxR, this.maxR*2, this.maxR*2 );
            this.ctx.rotate(-this.backgroundAngle);
            this.ctx.translate(-this.position.x, -this.position.y);         
            this.ctx.globalAlpha = 0.2;
            this.ctx.fill();
            this.ctx.restore();
        }
        
    }
    
    return DominationArea;
});