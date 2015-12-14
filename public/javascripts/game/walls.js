define(['wall'],function(Wall) {
    var walls = function(game, width, height, metr){
        this.game = game;
        
        this.options = {
            width  : width  || 1920,
            height : height || 1080,
            metr   : metr   || 30
        }  
        
        this.getWallPosition = function(type){
            if(type == 'left'){
                return {
                    x      : 0,
                    y      : 0,
                    height : this.options.height,
                    width  : this.options.metr,
                    metr   : this.options.metr
                }
            }
            if(type == 'top'){
                return {
                    x      : 0,
                    y      : 0,
                    height : this.options.metr,
                    width  : this.options.width,
                    metr   : this.options.metr
                }
            }
            if(type == 'right'){
                return {
                    x      : this.options.width - this.options.metr,
                    y      : 0,
                    height : this.options.height,
                    width  : this.options.metr,
                    metr   : this.options.metr
                }   
            }

            if(type == 'bottom'){
                return {
                    x      : 0,
                    y      : this.options.height - this.options.metr,
                    height : this.options.metr,
                    width  : this.options.width,
                    metr   : this.options.metr
                }
            }
            
        }
        
        this.collection = {
            'left'   : new Wall(game, this.getWallPosition('left')),
            'top'    : new Wall(game, this.getWallPosition('top')),
            'right'  : new Wall(game, this.getWallPosition('right')),
            'bottom' : new Wall(game, this.getWallPosition('bottom'))
        }        
        

        
        this.render = function(){
            for(var wallName in this.collection){
                this.collection[wallName].render();
            }          
        }
        
    }
    return walls;
});