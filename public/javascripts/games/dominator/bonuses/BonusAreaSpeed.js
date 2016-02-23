define(['bonuses/BonusAreaProto'], function(BonusAreaProto) {
    
    var BonusAreaSpeed = function(){
        BonusAreaProto.apply(this, arguments);    
        
        this.type = 'speed';
        
        this.circle.fillColor = '#FF9800';
        this.circle.strokeColor = '#EF6C00';
        
        this.raster = new this.paper.Raster({
            source: '/dominator/imgs/bonuses/speed.png',
            position: new this.paper.Point(this.x, this.y)
        });
        
        this.activate = function(){
            var self = this;
            this.activated = true;
            this.player.speedKoef = 3;
            this.timeout = window.setTimeout(this.deactivate.bind(this), 10000);
        }
        
        this.deactivate = function(){
            window.clearTimeout(this.timeout);
            this.player.speedKoef = 1;
        }

    }       
    
    return BonusAreaSpeed;
});