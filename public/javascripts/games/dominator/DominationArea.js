define(function() {
    
    var DP_NORMAL = 1;
    var DP_HIDING = 2;
    var DP_SHOWING = 3;    
    
    DominationArea = function(ctx, width, height, options){
        this.ctx = ctx;
        
        this.width = width;
        this.height = height;
        this.x = this.width / 2;
        this.y = this.height / 2;

        this.indent = options.indent;
        
        this.currentRadius = options.r;
        this.maxRadius = options.r;
        
        this.maxLifeTime = options.maxLifeTime;
        this.minLifeTime = options.minLifeTime;
        this.lifeTime = 600;  
        
        this.color = options.color;
        
        this.backgroundImage = new Image();
        this.backgroundImage.src = options.imageSrc;
        this.backgroundAngle = 0;         

        this.status = DP_NORMAL;        
        
    }

    DominationArea.prototype.isInArea = function(x,y){
        return (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.currentRadius, 2) );
    }

    DominationArea.prototype.checkAndToggle = function(){
        if(this.status == DP_NORMAL){
            if(this.lifeTime < 0){
                this.status = DP_HIDING;    
            }                
        }
        if(this.status == DP_HIDING){
            if(this.currentRadius > 1){
                this.currentRadius -= 1;    
            }
            else{
                this._moveRandom();
                this.status = DP_SHOWING;
            }                
        }
        if(this.status == DP_SHOWING){
            if(this.currentRadius < this.maxRadius){
                this.currentRadius +=1;
            }
            else{
                this.lifeTime = this._getRandom(this.minLifeTime, this.maxLifeTime) * 60;
                this.status = DP_NORMAL;
            }                
        } 
        this.lifeTime--;
        this.backgroundAngle +=0.005;
    }

    DominationArea.prototype.render = function(){ 
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.backgroundAngle);
        this.ctx.drawImage(this.backgroundImage ,- this.maxRadius, -this.maxRadius, this.maxRadius*2, this.maxRadius*2 );
        this.ctx.rotate(-this.backgroundAngle);
        this.ctx.translate(-this.x, -this.y);         
        this.ctx.globalAlpha = 0.2;
        this.ctx.fill();
        this.ctx.restore();
    }
    
    DominationArea.prototype._move = function(x, y){
        this.x = x;
        this.y = y;
    }

    DominationArea.prototype._getRandom = function(min, max){
        return Math.floor(Math.random() * (max - min) + min );
    }

    DominationArea.prototype._moveRandom = function(){
        var xMax = this.width - this.indent - this.maxRadius;
        var xMin = this.maxRadius + this.indent;
        var yMax = this.height - this.indent - this.maxRadius;
        var yMin = this.maxRadius + this.indent;
        var x = this._getRandom(xMin, xMax);
        var y = this._getRandom(yMin, yMax);
        this._move(x,y);
    }

    return DominationArea;
});