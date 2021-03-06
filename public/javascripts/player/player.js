define(['io'], function(io) {
    
    var Player = function(gameId, playerId, playerName){

        this.socket = io();
        this.gameId = gameId;
        this.playerId = playerId;   
        this.playerName = playerName;
        
        this.playerActions = {}
        
        this.vector = {
            x : 0,
            y : 0
        };

        this.lastSend = Date.now();

        this.init = function(){
            var self = this;
            self.sendAddPlayer();  

            if (window.DeviceOrientationEvent) {
                document.getElementById("doEvent").innerHTML = "DeviceOrientation";
                // Listen for the deviceorientation event and handle the raw data
                window.addEventListener('deviceorientation', function(eventData) {
                    if(Date.now() - self.lastSend > 1000/30){
                        self.lastSend = Date.now();
                        // gamma is the left-to-right tilt in degrees, where right is positive
                        var tiltLR = eventData.gamma;

                        // beta is the front-to-back tilt in degrees, where front is positive
                        var tiltFB = eventData.beta;

                        // alpha is the compass direction the device is facing in degrees
                        var dir = eventData.alpha

                        // call our orientation event handler
                        self.deviceOrientationHandler(tiltLR, tiltFB, dir);
                        self.playerActions.move = {}
                        self.playerMove(tiltFB, -1*tiltLR);
                    }

                }, false);
                
            } else {
                document.getElementById("doEvent").innerHTML = "Orientation Not supported."
            }
            
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion',function deviceMotionHandler(eventData) {
                    var info, xyz = "[X, Y, Z]";

                    // Grab the acceleration from the results
                    var acceleration = eventData.acceleration;

                    info = xyz.replace("X", acceleration.x);
                    info = info.replace("Y", acceleration.y);
                    info = info.replace("Z", acceleration.z);
                    document.getElementById("moAccel").innerHTML = info;

     
                }, false);
            } else {
                document.getElementById("dmEvent").innerHTML = "Motion Not supported."
            }


            
            window.addEventListener('click', function(){
                self.playerFire();
            });
            

        }

        this.sendAddPlayer = function(){
            this.socket.emit('addPlayer', {gameId: this.gameId, playerId: this.playerId, playerName: this.playerName});  
        }

        this.deviceOrientationHandler = function(tiltLR, tiltFB, dir){
            document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
            document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
            document.getElementById("doDirection").innerHTML = Math.round(dir);
            // Apply the transform to the image
            var logo = document.getElementById("imgLogo");
            logo.style.webkitTransform =                
                "rotate3d(0,1,0, "+ (tiltLR)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
        }

        this.playerMove = function(x, y){
            this.vector.x = this.nomalize(x);
            this.vector.y = this.nomalize(y);
            
            var action = {
                type: 'playerMove',
                playerId: this.playerId,
                gameId: this.gameId,
                data: this.vector          
            }
            
            this.playerAction(action);
            return false;
        }
        
        this.playerFire = function(data){
            var action = {
                type: 'playerFire',
                playerId: this.playerId,
                gameId: this.gameId,
                data: this.vector          
            }
            
            this.playerAction(action);
            return false;
        }

        this.playerAction = function(data){
            this.socket.emit('playerAction', data);
        }

        this.nomalize = function(x){
            if(x == 0){
                return 0;
            }
            if(x > 45){
                x = 45;
            }
            if(x<-45){
                x=-45;
            }
            return x/45;
        }
    }
    
    return Player;
});