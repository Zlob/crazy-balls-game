define(['Player'], function(Player) {
    var Players = function(world, ctx, scoreAreaFactory, width, height, playerOptions, scoreAudios){
        
        this.world = world;
        this.ctx =  ctx;
        
        this.scoreAreaFactory = scoreAreaFactory;
        this.scoreAudios = scoreAudios;
        
        this.width = width;
        this.height = height;
        
        this.r = playerOptions.r;

        this.density = playerOptions.density;
        this.friction = playerOptions.friction;
        this.restitution = playerOptions.restitution;
        this.linearDamping = playerOptions.linearDamping;
        
        this.color = playerOptions.color;
        this.borderColor = playerOptions.borderColor;
        this.flashColor = playerOptions.flashColor;      

        this.collection = [];
    
        var self = this;          
        
        this.getPlayerOptions = function(number){
            var result = {};
            if(number == '0'){
                result.x           = this.r * 4;
                result.y           = this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            }
            if(number == '1'){
                result.x           = this.width - this.r * 4;
                result.y           = this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            }
            if(number == '2'){
                result.x           = this.r * 4;
                result.y           = this.height - this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            }

            if(number == '3'){
                result.x           = this.width - this.r * 4;
                result.y           = this.height - this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            } 
            if(number == '4'){
                result.x           = this.width/2;
                result.y           = this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            }   
            if(number == '5'){
                result.x           = this.width/2;
                result.y           = this.height - this.r * 4;
                result.color       = this.color[number];
                result.flashColor  = this.flashColor[number];
                result.borderColor = this.borderColor[number];
            }  
            result.r = this.r;
            result.density = this.density;
            result.friction = this.friction;
            result.restitution = this.restitution;
            result.linearDamping = this.linearDamping;
            return result;
        };
        

        
        this.init = function(players){
            players.forEach(function(player, index){
                var scoreArea = self.scoreAreaFactory.createScoreArea(index);
                var playerOptions = self.getPlayerOptions(index);
                playerOptions.name = player.playerName;
                playerOptions.id = player.playerId;
                self.collection.push( new Player( self.world, self.ctx, scoreArea, self.scoreAudios[index], playerOptions ))
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
    return Players;
});