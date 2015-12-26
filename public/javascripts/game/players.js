define(['player', 'scoreArea'], function(Player, ScoreArea) {
    var players = function(world, ctx, gameOptions, options, scoreOptions ){
        
        this.world = world;
        this.ctx =  ctx;
        this.collection = [];
        
        this.gameOptions = gameOptions;
        this.options = options;
        this.scoreOptions = scoreOptions;
        var self = this;
          
        
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
        
        this.init = function(players){
            players.forEach(function(player, index){
                var scoreArea = new ScoreArea(self.world, self.ctx, self.getScoreAreaOptions(index)).init();
                var playerOptions = self.getPlayerOptions(index);
                playerOptions.name = player.playerName;
                playerOptions.id = player.playerId;
                self.collection.push( new Player( self.world, self.ctx, self.gameOptions, scoreArea, playerOptions ).init() )
            });
            return this;
        };     
        
        this.find = function(id){
            return this.collection[id];
        }
        
        this.all = function(){
            return this.collection;
        }
        
        this.getScores = function(){
            return this.collection
                .map(function(player, id){
                return {
                    name    : player.name,
                    score   : player.getScore()
                }
            })
                .sort(function(a,b){
                if(a.score < b.score){
                    return 1;
                }
                if(a.score > b.score){
                    return -1;
                }
                return 0;
            });
        }
        
        this.render = function(){  
            this.collection.forEach(function(player){
                player.render();
            })
        }        
        
    }
    return players;
});