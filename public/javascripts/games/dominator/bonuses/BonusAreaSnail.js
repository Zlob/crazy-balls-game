define(['bonuses/BonusAreaProto'], function(BonusAreaProto) {
    
    var BonusAreaSnail = function(){
        BonusAreaProto.apply(this, arguments);    
        
        this.type = 'size';
        
        this.circle.fillColor = '#795548';
        this.circle.strokeColor = '#4E342E';
        
        this.raster = new this.paper.Raster({
            source: '/dominator/imgs/bonuses/snail.png',
            position: new this.paper.Point(this.x, this.y)
        });
        
        this.activate = function(){
            var self = this;
            this.activated = true;
            this.player.speedKoef = 0.3;
            this.timeout = window.setTimeout(this.deactivate.bind(this), 10000);
        }

        this.deactivate = function(){
            window.clearTimeout(this.timeout);
            this.player.speedKoef = 1;
            console.log('deactivate');
        }

    }       
    
    return BonusAreaSnail;
});