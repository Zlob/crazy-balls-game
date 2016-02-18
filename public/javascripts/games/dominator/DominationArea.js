define(function() {
    
    var DP_NORMAL = 1;
    var DP_HIDING = 2;
    var DP_SHOWING = 3;    
    
    DominationArea = function(paper, width, height, options){
        this.paper = paper;
        
        this.width = width;
        this.height = height;
        this.x = this.width / 2;
        this.y = this.height / 2;

        this.indent = options.indent;
        
        this.currentRadius = 1;
        this.maxRadius = options.r;
        
        this.maxLifeTime = options.maxLifeTime;
        this.minLifeTime = options.minLifeTime;
        this.lifeTime = 600;  
        
        this.color = options.color;   
        this.shadowColor = options.shadowColor;   

        this.status = DP_SHOWING;    
   
        this.circle = new this.paper.Path.Circle(new this.paper.Point(this.x, this.y), this.currentRadius);
        this.circle.strokeColor = this.color;
        this.circle.strokeWidth = 1;
        this.circle.shadowColor = this.shadowColor;
        this.circle.shadowBlur = 3;

        
    }

    DominationArea.prototype.isInArea = function(x,y){
        return (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.currentRadius, 2) );
    }

    DominationArea.prototype.checkAndToggle = function(fps){
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
        this.lifeTime-= fps*60;
    }
    
    DominationArea.prototype.render = function(){ 
        this.circle.bounds.width = this.currentRadius*2;
        this.circle.bounds.height = this.currentRadius*2;
        this.circle.position.x = this.x;
        this.circle.position.y = this.y;
        this.circle.strokeWidth = this.currentRadius/12;
        this.circle.shadowBlur = this.currentRadius/12*3;
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