var Player = function(game_id, player_id, playerName){
    
    this.socket = io();
    this.game_id = game_id;
    this.player_id = player_id;   
    this.playerName = playerName;
    
    this.lastSend = Date.now();
    
    this.init = function(){
        var self = this;
        if (window.DeviceOrientationEvent) {
            
            self.sendAddPlayer();           

            document.getElementById("doEvent").innerHTML = "DeviceOrientation";
            // Listen for the deviceorientation event and handle the raw data
            window.addEventListener('deviceorientation', function(eventData) {
                if(Date.now() - self.lastSend > 100){
                    console.log('send');
                    self.lastSend = Date.now();
                    // gamma is the left-to-right tilt in degrees, where right is positive
                    var tiltLR = eventData.gamma;

                    // beta is the front-to-back tilt in degrees, where front is positive
                    var tiltFB = eventData.beta;

                    // alpha is the compass direction the device is facing in degrees
                    var dir = eventData.alpha

                    // call our orientation event handler
                    self.deviceOrientationHandler(tiltLR, tiltFB, dir);
                    self.playerAction(tiltFB, -1*tiltLR);
                }

            }, false);
        } else {
            document.getElementById("doEvent").innerHTML = "Not supported."
        }
    }
    
    this.sendAddPlayer = function(){
        this.socket.emit('addPlayer', {game_id: this.game_id, player_id: this.player_id, player_name: this.playerName});  
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
    
    this.playerAction = function(x, y){
        var data = {
            player_id: this.player_id,
            game_id: this.game_id,
            x: this.nomalize(x),
            y: this.nomalize(y)
        }
        this.socket.emit('playerMove', data);
        return false;
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


$(document).ready(function(){
    var game_id = $('#game_id').html();
    var player_id = $('#player_id').html();
    var player_name = 'Player ' + player_id;
    
    var player = new Player(game_id, player_id, player_name);
    player.init();

});







