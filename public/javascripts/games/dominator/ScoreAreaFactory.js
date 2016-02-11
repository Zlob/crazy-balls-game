define(['ScoreArea'],function(ScoreArea) {
    var ScoreAreaFactory = function(ctx, width, height, scoreOptions){
        this.ctx = ctx;
        
        this.width = width;
        this.height = height;
        
        this.font = scoreOptions.font;
        this.indent = scoreOptions.indent;
        this.color = scoreOptions.color;         
    }

    ScoreAreaFactory.prototype.createScoreArea = function(id){
        return new ScoreArea(this.ctx, this.getScoreAreaOptions(id));
    }
    
    ScoreAreaFactory.prototype.getLeft = function(){
        return this.width/2 - (this.width/2 - this.indent);
    }
    
    ScoreAreaFactory.prototype.getMiddle = function(){
        return this.width/2;
    }

    ScoreAreaFactory.prototype.getRight = function(){
        return this.width/2 + (this.width/2 - this.indent);
    }

    ScoreAreaFactory.prototype.getTop = function(){
        return this.indent/2;
    }

    ScoreAreaFactory.prototype.getBottom = function(){
        return this.height - this.indent/2; 
    }


    ScoreAreaFactory.prototype.getScoreAreaOptions = function(number){
        var result = {};
        if(number == '0'){
            result.x      = this.getLeft();
            result.y      = this.getTop();
            result.textAlign = 'start';
        }
        if(number == '1'){
            result.x      = this.getRight();
            result.y      = this.getTop();
            result.textAlign = 'end';
        }
        if(number == '2'){
            result.x      = this.getLeft();
            result.y      = this.getBottom();
            result.textAlign = 'start';
        }
        if(number == '3'){
            result.x      = this.getRight();
            result.y      = this.getBottom();
            result.textAlign = 'end';
        }
        if(number == '4'){
            result.x      = this.getMiddle();
            result.y      = this.getTop();
            result.textAlign = 'center';
        }
        if(number == '5'){
            result.x      = this.getMiddle();
            result.y      = this.getBottom();
            result.textAlign = 'center';
        }
        result.textBaseline = 'middle';
        result.color = this.color;
        result.font = this.font;
        return result;
    }

    return ScoreAreaFactory;
});