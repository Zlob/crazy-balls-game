define([], function() {
        
    var BonusAreaProto = function(paper, x, y, r){
        this.paper = paper;
        this.x = x;
        this.y = y;
        this.r = r;
        
        this.activated = false;
        
        this.player = undefined;
        
        this.circle = new this.paper.Path.Circle(new this.paper.Point(this.x, this.y), this.r);
                        
        this.attach = function(player){
            this.circle.remove();
            this.raster.visible = false;
            this.player = player;
        }
    }
    
    
    
    return BonusAreaProto;
});