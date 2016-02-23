define(['bonuses/BonusAreaProto'], function(BonusAreaProto) {
    
    var BonusAreaWave = function(){
        BonusAreaProto.apply(this, arguments);   
        
        this.type = 'wave';
        
        this.circle.fillColor = '#009688';
        this.circle.strokeColor = '#00695C';
        
        this.raster = new this.paper.Raster({
            source: '/dominator/imgs/bonuses/wave.png',
            position: new this.paper.Point(this.x, this.y)
        });

    }       
    
    return BonusAreaWave;
});