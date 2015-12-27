define(['box2d'], function() {
    
    var scoreArea = function(world, ctx, options){
        
        this.world = world;
        this.ctx = ctx;
        this.options = options;
        
        this.init = function(){
            
            return this;
        }
        
        this.render = function(score){
            this.ctx.save();
            this.ctx.fillStyle = this.options.color;
            this.ctx.font = this.options.font;
            this.ctx.textAlign = this.options.textAlign;
            this.ctx.textBaseline = this.options.textBaseline;
            this.ctx.fillText(score, this.options.x, this.options.y);
            this.ctx.restore();

        }
        
    }
    
    return scoreArea;
});