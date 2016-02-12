define(['box2d'], function() {
    
    var ScoreArea = function(paper, options){
        
        this.paper = paper;
        
        this.x = options.x;
        this.y = options.y;
        
        this.font = options.font;
        this.fontSize = options.fontSize;
        this.textAlign = options.textAlign;
        this.textBaseline = options.textBaseline;
        this.color = options.color;
        this.justification = options.justification;
        
        this.text = new this.paper.PointText({
            point: [this.x, this.y],
            content: '0',
            font: this.font,
            fontSize: this.fontSize,
            fillColor: this.color,
            justification: this.justification
        });
    }
    
    ScoreArea.prototype.render = function(score){
        this.text.content = score;
    }
    
    return ScoreArea;
});