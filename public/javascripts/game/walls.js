define(['wall'],function(Wall) {
    var walls = function(world, ctx, gameOptions, options){
        this.world = world;
        this.ctx = ctx;
        this.collection = {};
        
        this.gameOptions = gameOptions;
        
        this.options = options;
                
        this.getWallPosition = function(type){
            if(type == 'left'){
                return {
                    x            : 0,
                    y            : 0,
                    height       : this.gameOptions.height,
                    width        : this.options.size,
                    color        : this.options.color,
                    pixelsInMetr : this.gameOptions.pixelsInMetr
                }
            }
            if(type == 'top'){
                return {
                    x            : 0,
                    y            : 0,
                    height       : this.options.size,
                    width        : this.gameOptions.width,
                    color        : this.options.color,
                    pixelsInMetr : this.gameOptions.pixelsInMetr
                }
            }
            if(type == 'right'){
                return {
                    x            : this.gameOptions.width - this.options.size,
                    y            : 0,
                    height       : this.gameOptions.height,
                    width        : this.options.size,
                    color        : this.options.color,
                    pixelsInMetr : this.gameOptions.pixelsInMetr
                }   
            }

            if(type == 'bottom'){
                return {
                    x            : 0,
                    y            : this.gameOptions.height - this.options.size,
                    height       : this.options.size,
                    width        : this.gameOptions.width,
                    color        : this.options.color,
                    pixelsInMetr : this.gameOptions.pixelsInMetr
                }
            }            
        }
        
        this.init = function(){
            this.collection = {
                'left'   : new Wall(this.world, this.ctx, this.getWallPosition('left')).init(),
                'top'    : new Wall(this.world, this.ctx, this.getWallPosition('top')).init(),
                'right'  : new Wall(this.world, this.ctx, this.getWallPosition('right')).init(),
                'bottom' : new Wall(this.world, this.ctx, this.getWallPosition('bottom')).init()
            }   
            return this;
        }       
        
        this.render = function(){
            for(var wallName in this.collection){
                this.collection[wallName].render();
            }          
        }
        
    }
    return walls;
});