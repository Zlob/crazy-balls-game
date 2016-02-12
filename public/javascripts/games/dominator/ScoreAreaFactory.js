define(['ScoreArea'],function(ScoreArea) {
    var ScoreAreaFactory = function(paper, width, height, scoreOptions){
        this.paper = paper;
        
        this.width = width;
        this.height = height;
        
        this.font = scoreOptions.font;
        this.fontSize = scoreOptions.fontSize;
        this.indent = scoreOptions.indent;
        this.color = scoreOptions.color;         
    }

    ScoreAreaFactory.prototype.createScoreArea = function(id){
        return new ScoreArea(this.paper, this.getScoreAreaOptions(id));
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
        return this.indent/2 + this.fontSize/2;
    }

    ScoreAreaFactory.prototype.getBottom = function(){
        return this.height - this.indent/2 + this.fontSize/2; 
    }


    ScoreAreaFactory.prototype.getScoreAreaOptions = function(number){
        var result = {};
        if(number == '0'){
            result.x      = this.getLeft();
            result.y      = this.getTop();
            result.justification = 'left';
        }
        if(number == '1'){
            result.x      = this.getRight();
            result.y      = this.getTop();
            result.justification = 'right';
        }
        if(number == '2'){
            result.x      = this.getLeft();
            result.y      = this.getBottom();
            result.justification = 'left';
        }
        if(number == '3'){
            result.x      = this.getRight();
            result.y      = this.getBottom();
            result.justification = 'right';
        }
        if(number == '4'){
            result.x      = this.getMiddle();
            result.y      = this.getTop();
            result.justification = 'center';
        }
        if(number == '5'){
            result.x      = this.getMiddle();
            result.y      = this.getBottom();
            result.justification = 'center';
        }
        result.color = this.color;
        result.font = this.font;
        result.fontSize = this.fontSize;
        return result;
    }

    return ScoreAreaFactory;
});