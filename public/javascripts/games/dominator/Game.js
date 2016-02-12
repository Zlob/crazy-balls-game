define([
    'box2d',
    'paper',
    'Sound',
    'Walls',
    'Players',
    'DominationArea',
    'ScoreAreaFactory',

], function(box,
             paper,
             Sound, 
             Walls, 
             Players, 
             DominationArea, 
             ScoreAreaFactory
            )
{


    
    var PAUSED = 0;
    var IN_PROCESS = 1;
    var FINISHED =2;
    
    var FPS_PAUSED = 0;
    var FPS_IN_PROCESS  = 1/60;
    
    Game = function(canvas, playersNum){
        
        var self = this;
        
        this.status = null;
        
        this.gameOverCallback = null;
        
        this.interval = 1/60;
        
        this.maxScore = 1000;      
        
        this.gameOptions = {
            width : 1920,
            height : 1080,
            pixelsInMetr : 30, //todo убрать
            backgroundColor : '#000',// '#CFD8DC',
            backgroundAudio : '/dominator/sounds/music_1.ogg',
            scoreAudio      : '/dominator/sounds/coin_2.wav',
            bounceAudio     : '/dominator/sounds/bounce_1.wav'
        };
                
        this.wallsOptions = {
            size  : this.gameOptions.pixelsInMetr*1.5,
            color : '#263238',
            density : 1.0,
            friction : 0.5,
            restitution : 0.2
        }
        
        this.playersOptions = {
            r     :  this.gameOptions.pixelsInMetr,
            density : 1,
            friction : 0.5,
            restitution : 0.5,
            linearDamping : 0.5,
            color : ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'],
            borderColor : ['#B71C1C', '#0D47A1', '#1B5E20', '#F57F17', '#4A148C', '#E65100'],
            flashColor : ['#FFCDD2', '#BBDEFB', '#C8E6C9', '#FFF9C4', '#E1BEE7', '#FFE0B2']
        }
        
        this.scoreOptions = {
            font : "'Press Start 2P'",
            fontSize : "24",
            indent : this.wallsOptions.size,
            color: 'white'            
        }
        
        this.dominationAreaOptions = {
            indent : 60,
            r : this.gameOptions.pixelsInMetr * 2,
            color : '#263238',
            maxLifeTime : 30,
            minLifeTime : 5,
            imageSrc : "/dominator/imgs/radial.png"
        }
        
        this.ctx = canvas.getContext('2d'); //todo
        this.canvas = canvas; //todo
        this.paper = paper;
        
        this.world = null;    
        this.players = null;
        this.walls = null;
        this.dominationArea = null;
        this.countDown = null;
        this.playersScore = null;

        this.backgroundAudio = new Sound({url : this.gameOptions.backgroundAudio});
        this.bounceAudio = new Sound({
            url : this.gameOptions.bounceAudio,
            multiShot : true
        });
        this.scoreAudios = [];
        for(var i =  0; i < playersNum; i++){
            var scoreAudio = new Sound({
                url : this.gameOptions.scoreAudio
            })
            this.scoreAudios.push(scoreAudio);
        };

        
        this.init = function(players, gameOverCallback){
            this.paper.setup(this.canvas);
            
            this.status = PAUSED;
            this.world = new Box2D.Dynamics.b2World( new Box2D.Common.Math.b2Vec2(0, 0) ,true);    // doSleep флаг.               
            this.walls = new Walls(this.world, this.paper, this.gameOptions.width, this.gameOptions.height, this.wallsOptions).init();            
            this.dominationArea = new DominationArea(this.paper, this.gameOptions.width, this.gameOptions.height, this.dominationAreaOptions);
            
            var scoreAreaFactory = new ScoreAreaFactory(this.paper, this.gameOptions.width, this.gameOptions.height, this.scoreOptions);
            this.players = new Players(this.world, this.paper, scoreAreaFactory, this.gameOptions.width, this.gameOptions.height, this.playersOptions, this.scoreAudios).init(players);
            
            this.gameOverCallback = gameOverCallback;    
            this._setCollisionListener();  
            if(this.intervalId){
                window.clearInterval(this.intervalId);
            }
            
            this._showBackGround();
            
            this.intervalId = window.setInterval(this._update, 1000 / 60);
        };
        
        this.startGame = function(){
            this.backgroundAudio.play({loop : true});
            self.status = IN_PROCESS;
            this._startPhysic();
        }
        
        this.pauseGame = function(){
            this.status = PAUSED;
            this._stopPhysic();  
            Sound.pause();
        }
        
        this.resumeGame = function(){
            this.status = IN_PROCESS;
            Sound.resume();
            this._startPhysic();
        }        
        
        this.endGame = function(){
            this.status = FINISHED;
            this._stopPhysic();
            window.clearInterval(this.intervalId);
        }
                
        this.getStatus = function(){
            return this.status;
        }
        
        this.getPlayersScore = function(){
            return this.players.getScores();
        }
        
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
        
        this._setCollisionListener = function(){
            var listener = new Box2D.Dynamics.b2ContactListener;
            listener.BeginContact = function(contact) {
              
            }
            listener.EndContact = function(contact) {

            }
            listener.PostSolve = function(contact, impulse) {
                var objectA = contact.GetFixtureA().GetBody().GetUserData();
                var objectB = contact.GetFixtureB().GetBody().GetUserData();
                if(objectA.type == 'Player' || objectB.type == 'Player' && impulse.normalImpulses[0] >= 1 ){
                    //todo нормировать относительно максимального импульса исходя их конфигов массы и макисмального ускорения?
                    var player = objectA.type == 'Player' ? objectA : objectB;
                    var volume = impulse.normalImpulses[0] <= 50 ? impulse.normalImpulses[0] / 50 : 1;
                    self.bounceAudio.play({volume : volume});
                    console.log(impulse.normalImpulses[0]);
                    
                } 
            }
            listener.PreSolve = function(contact, oldManifold) {

            }
            this.world.SetContactListener(listener);
        }
        
        this._stopPhysic = function(){
            this.interval = FPS_PAUSED;    
        }
        
        this._startPhysic = function(){
            this.interval = FPS_IN_PROCESS;
        }
        
        
        this._update = function() {
            self.world.Step(self.interval, 10, 20);            
            self._calculateScore();    
            if(self.status == IN_PROCESS){     
                self._checkGameOver();
                self.dominationArea.checkAndToggle();
            }
            
            self._render();
            
            self.world.ClearForces();            
        };            
        
                
        this._calculateScore = function(){
            var self = this;
            this.players.all().forEach(function(player, index){
                var playerPosition = player.body.GetPosition();
                if(self.status == IN_PROCESS && self.dominationArea.isInArea(self._toPixels(playerPosition.x), self._toPixels(playerPosition.y))){
                    player.setIsFlashing(true);
                    player.addScore(1);
                }
                else{
                    player.setIsFlashing(false);
                }
            });
        }
        
        this._render = function(){        
            this.dominationArea.render();  
            this.players.render();  
            this.paper.view.draw();
        }
        

        
        this._clearCtx = function(){
            this.ctx.clearRect(0, 0, this.gameOptions.width, this.gameOptions.height);  
        }
        
        this._toPixels = function(metr){
            return metr * this.gameOptions.pixelsInMetr;
        }
        
        this._checkGameOver = function(){
            var gameIsOver = this.players.all().some(function(player){
                var score = player.getScore();
                return score >= self.maxScore;
            });
            if(gameIsOver){
                this.endGame();
                this.gameOverCallback();
            }
        }
        
        this._showBackGround = function(){
            var rect = new this.paper.Path.Rectangle({
                point: [0, 0],
                size: [this.gameOptions.width, this.gameOptions.height],
                strokeColor: this.gameOptions.backgroundColor,
            });
            rect.sendToBack();
            rect.fillColor = this.gameOptions.backgroundColor;
        }
    };
        
    return Game;
})
