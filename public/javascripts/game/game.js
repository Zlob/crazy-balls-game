define(['box2d', 'walls', 'players', 'dominationArea'], function(box, Walls, Players, DominationArea){

    
    var PAUSED = 0;
    var IN_PROCESS = 1;
    var FINISHED =2;
    
    var FPS_PAUSED = 0;
    var FPS_IN_PROCESS  = 1/60;
    
    Game = function(){
        
        var self = this;
        
        this.status = PAUSED;

        this.playersNum = null;
        
        this.gameOverCallback = null;
        
        this.interval = 1/60;
        
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
        
        
        
        this.world =  null;        
        this.players = null;
        this.walls = null;
        this.dominationArea = null;
        this.countDown = null;
        this.playersScore = null;
        this.canvas = null;
        this.ctx = null;       

        this.init = function(canvas, playersNum, gameOverCallback){
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.playersNum = playersNum;
            this.gameOverCallback = gameOverCallback;
            this.world =  new Box2D.Dynamics.b2World( new Box2D.Common.Math.b2Vec2(0, 0) ,true); // doSleep флаг.
            
            this.walls = new Walls(this.world, this.ctx, this.gameOptions, this.wallsOptions).init();

            this.players = new Players(this.world, this.ctx, this.gameOptions, this.playersOptions, this.scoreOptions).init(this.playersNum);
            
            this.dominationArea = new DominationArea(this.ctx, this.gameOptions, this.wallsOptions, this.dominationAreaOptions).init();
                        
            this.intervalId = window.setInterval(this.update, 1000 / 60);
        };
        
        this.startGame = function(){
            self.status = IN_PROCESS;
        }
        
        this.pauseGame = function(){
            this.status = PAUSED;
            this.stopPhysic();        
        }
        
        this.resumeGame = function(){
            this.status = IN_PROCESS;
            this.startPhysic();
        }
        
        
        this.endGame = function(){
            this.status = FINISHED;
            this.stopPhysic();
        }
        
        this.getStatus = function(){
            return this.status;
        }
        
        this.stopPhysic = function(){
            this.interval = FPS_PAUSED;    
        }
        
        this.startPhysic = function(){
            this.interval = FPS_IN_PROCESS;
        }
        
        
        this.update = function() {
            self.world.Step(self.interval, 10, 10);
            
            if(self.status == IN_PROCESS){
                self.calculateScore();            
                self.checkGameOver();
                self.dominationArea.checkAndToggle();
            }
            
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
        }
        

        
        this.clearCtx = function(){
            this.ctx.clearRect(0, 0, this.gameOptions.width, this.gameOptions.height);  
        }
        
        this.toPixels = function(metr){
            return metr * this.gameOptions.pixelsInMetr;
        }
        
        this.checkGameOver = function(){
            var gameIsOver = this.players.all().some(function(player){
                return player.getScore() >= 10;
            });
            if(gameIsOver){
                this.endGame();
                this.gameOverCallback(this.players.getScores());
            }
        }
        
        this.showBackGround = function(){
            this.ctx.fillStyle = this.gameOptions.backgroundColor;
            this.ctx.fillRect(0, 0, this.gameOptions.width, this.gameOptions.height);
        }
    };
        
    return Game;
})
