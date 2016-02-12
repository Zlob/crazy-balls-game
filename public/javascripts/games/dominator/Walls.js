define(['Wall'],function(Wall) {
    var Walls = function(world, paper, width, height, options){
        this.world = world;
        this.paper = paper;
        
        this.width = width;
        this.height = height;
        this.size = options.size;
        this.color = options.color;
        this.density = options.density;
        this.friction = options.friction;
        this.restitution = options.restitution;
                
        this.collection = {};        
                
        this.getWallPosition = function(type){
            var result = {};
            if(type == 'left'){
                result.x            = 0;
                result.y            = 0;
                result.height       = this.height;
                result.width        = this.size;
            }
            if(type == 'top'){
                result.x            = 0;
                result.y            = 0;
                result.height       = this.size;
                result.width        = this.width;
            }
            if(type == 'right'){
                result.x            = this.width - this.size;
                result.y            = 0;
                result.height       = this.height;
                result.width        = this.size;
            }

            if(type == 'bottom'){
                result.x            = 0;
                result.y            = this.height - this.size;
                result.height       = this.size;
                result.width        = this.width;
            } 
            result.color = this.color;
            result.density = this.density;
            result.friction = this.friction;
            result.restitution = this.restitution;
            return result;
        }
                
        this.init = function(){
            this.collection = {
                'left'   : new Wall(this.world, this.paper, this.getWallPosition('left')),
                'top'    : new Wall(this.world, this.paper, this.getWallPosition('top')),
                'right'  : new Wall(this.world, this.paper, this.getWallPosition('right')),
                'bottom' : new Wall(this.world, this.paper, this.getWallPosition('bottom'))
            }   
            return this;
        }       
        
    }
    return Walls;
});