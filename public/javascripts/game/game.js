define(['box2d', 'walls', 'players', 'dominationArea', 'countDown'], function(box, Walls, Players, DominationArea, CountDown){

    
    var BEGINING = 0;
    var IN_PROCESS = 1;
    var GAME_OVER =2;
    
    Game = function(playersNum){
        
        var self = this;
        
        this.status = BEGINING;

        this.playersNum = playersNum;
        
        this.gameOptions = {
            width : 1920,
            height : 1080,
            pixelsInMetr : 30,
            backgroundColor : '#202020'
        };
        
        this.wallsOptions = {
            size  : this.gameOptions.pixelsInMetr,
            color : 'grey'
        }
        
        this.playersOptions = {
            r     :  this.gameOptions.pixelsInMetr,
            color : ['green', 'yellow', 'blue', 'brown']
        }
        
        this.scoreOptions = {
            font : "24px Arial",
            color: ['white', 'white', 'white', 'white']            
        }
        
        this.dominationAreaOptions = {
            r : this.gameOptions.pixelsInMetr * 2,
            color : 'red',
            maxLifeTime : 30,
            minLifeTime : 5,
        }
        
        this.counterOptions = {
            initialCounter : 3,
            fontColor : 'green',
            font : "50px Arial",
        }
        
        
        this.world =  null;        
        this.players = null;
        this.walls = null;
        this.dominationArea = null;
        this.countDown = null;
        this.canvas = null;
        this.ctx = null;       

        this.init = function(canvas){
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.world =  new Box2D.Dynamics.b2World( new Box2D.Common.Math.b2Vec2(0, 0) ,true); // doSleep флаг.
            
            this.walls = new Walls(this.world, this.ctx, this.gameOptions, this.wallsOptions).init();

            this.players = new Players(this.world, this.ctx, this.gameOptions, this.playersOptions, this.scoreOptions).init(this.playersNum);
            
            this.dominationArea = new DominationArea(this.ctx, this.gameOptions, this.wallsOptions, this.dominationAreaOptions).init();
            
            this.countDown = new CountDown(this.ctx, this.gameOptions, this.counterOptions, this.startGame).init();
            
            window.setInterval(this.update, 1000 / 60);
        };
        
        this.startGame = function(){
            self.status = IN_PROCESS;
        }
        
        this.update = function() {
            self.world.Step(1/60, 10, 10);
            self.calculateScore();
            
            self.checkGameOver();
            
            self.render();
            
            self.world.ClearForces();            
        };              
        
        this.playerAction = function(data){
            if (this.status != IN_PROCESS){
                return;
            }
            for(var playerId in data)
            {
                var playerActions = data[playerId];
                var player = this.players.find(playerId);
                for(var action in playerActions){
                    if(action == 'playerMove'){
                        var actionData = playerActions[action];
                        player.move(actionData.x, actionData.y);
                    }
                    if(action == 'playerFire'){
                        player.fire();
                    }
                }
            }
        }


                
        this.calculateScore = function(){
            var self = this;
            this.players.all().forEach(function(player){
                var playerPosition = player.body.GetPosition();
                if(self.dominationArea.isInArea(self.toPixels(playerPosition.x), self.toPixels(playerPosition.y))){
                    player.addScore(1);
                }
            });
        }
        
        this.render = function(){  
            this.clearCtx();          
            this.showBackGround();
            this.walls.render();
            this.dominationArea.render();            
            this.players.render();
            if(this.status == BEGINING){
                this.countDown.render();    
            }     
            if(this.status == GAME_OVER){
                this.gameOver()
            }
        }
        
        this.clearCtx = function(){
            this.ctx.clearRect(0, 0, this.gameOptions.width, this.gameOptions.height);  
        }
        
        this.toPixels = function(metr){
            return metr * this.gameOptions.pixelsInMetr;
        }
        
        this.checkGameOver = function(){
//             var gameIsOver = this.players.some(function(player){
//                 return player.getScore() >= 1000;
//             });
//             if(gameIsOver){
//                 this.status = GAME_OVER;
//             }
        }
        
        this.showBackGround = function(){
            this.ctx.fillStyle = this.gameOptions.backgroundColor;
            this.ctx.fillRect(0, 0, this.gameOptions.width, this.gameOptions.height);
        }
    }
    return Game;
})
