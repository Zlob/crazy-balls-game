define(['box2d'], function() {
    
    var ScoreArea = function(ctx, options){
        
        this.ctx = ctx;
        
        this.x = options.x;
        this.y = options.y;
        
        this.font = options.font;
        this.textAlign = options.textAlign;
        this.textBaseline = options.textBaseline;
        this.color = options.color;
        
    }
    
    ScoreArea.prototype.render = function(score){
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.textAlign = this.textAlign;
        this.ctx.textBaseline = this.textBaseline;
        this.ctx.fillText(score, this.x, this.y);
        this.ctx.restore();

    }
    
    return ScoreArea;
});