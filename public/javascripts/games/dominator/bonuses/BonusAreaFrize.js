define(['bonuses/BonusAreaProto'], function(BonusAreaProto) {
    
    var BonusAreaFrize = function(){
        BonusAreaProto.apply(this, arguments);    
        
        this.type = 'frize';
        
        this.circle.fillColor = '#00BCD4';
        this.circle.strokeColor = '#00838F';
        
        this.raster = new this.paper.Raster({
            source: '/dominator/imgs/bonuses/frize.png',
            position: new this.paper.Point(this.x, this.y)
        });

    }       
    
    return BonusAreaFrize;
});