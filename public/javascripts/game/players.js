define(['player', 'scoreArea'], function(Player, ScoreArea) {
    var players = function(world, ctx, gameOptions, options, scoreOptions ){
        
        this.world = world;
        this.ctx =  ctx;
        this.collection = [];
        
        this.gameOptions = gameOptions;
        this.options = options;
        this.scoreOptions = scoreOptions;
          
        
        this.getPlayerOptions = function(number){
            if(number == '0'){
                return {
                    x      : this.options.r * 4,
                    y      : this.options.r * 4,
                    r      : this.options.r,
                    color  : this.options.color[number] 
                }
            }
            if(number == '1'){
                return {
                    x      : this.gameOptions.width - this.options.r * 4,
                    y      : this.options.r * 4,
                    r      : this.options.r,
                    color  : this.options.color[number]
                }
            }
            if(number == '2'){
                return {
                    x      : this.options.r * 4,
                    y      : this.gameOptions.height - this.options.r * 4,
                    r      : this.options.r,
                    color  : this.options.color[number]
                }
            }

            if(number == '3'){
                return {
                    x      : this.gameOptions.width - this.options.r * 4,
                    y      : this.gameOptions.height - this.options.r * 4,
                    r      : this.options.r,
                    color  : this.options.color[number]
                }
            }            
        };
        
        this.getScoreAreaOptions = function(number){
            if(number == '0'){
                return {
                    x      : this.options.r,
                    y      : this.options.r - 4,
                    font   : this.scoreOptions.font,
                    color  : this.scoreOptions.color[number]
                }
            }
            if(number == '1'){
                return {
                    x      : this.gameOptions.width - this.options.r,
                    y      : this.options.r - 4,
                    font   : this.scoreOptions.font,
                    color  : this.scoreOptions.color[number]
                }
            }
            if(number == '2'){
                return {
                    x      : this.options.r,
                    y      : this.gameOptions.height - 4,
                    font   : this.scoreOptions.font,
                    color  : this.scoreOptions.color[number]
                }
            }

            if(number == '3'){
                return {
                    x      : this.gameOptions.width - this.options.r,
                    y      : this.gameOptions.height - 4,
                    font   : this.scoreOptions.font,
                    color  : this.scoreOptions.color[number]
                }
            }
        }
        
        this.init = function(count){
            for(var i = 0; i < count; i++){
                var scoreArea = new ScoreArea(this.world, this.ctx, this.getScoreAreaOptions(i)).init();
                this.collection.push( new Player( this.world, this.ctx, this.gameOptions, scoreArea, this.getPlayerOptions(i) ).init() )
            }
            return this;
        };     
        
        this.find = function(id){
            return this.collection[id];
        }
        
        this.all = function(){
            return this.collection;
        }
        
        this.render = function(){  
            this.collection.forEach(function(player){
                player.render();
            })
        }        
        
    }
    return players;
});