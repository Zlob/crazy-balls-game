var socket = io();

var game_id = document.getElementById('game_id').innerHTML;
var player_id = document.getElementById('player_id').innerHTML;
socket.emit('addPlayer', {game_id: game_id, player_id: player_id});

var deviceOrientationHandler = function(tiltLR, tiltFB, dir){
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);
    // Apply the transform to the image
    var logo = document.getElementById("imgLogo");
    logo.style.webkitTransform =                
        "rotate3d(0,1,0, "+ (tiltLR)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
}
var playerAction = function(x, y){
    var data = {
        player_id: player_id,
        game_id: game_id,
        x: x,
        y, y
    }
    socket.emit('playerMove', data);
    return false;
}
var lastSend = Date.now();
if (window.DeviceOrientationEvent) {
    document.getElementById("doEvent").innerHTML = "DeviceOrientation";
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
        if(Date.now() - lastSend > 16){
            console.log('send');
            lastSend = Date.now();
                    // gamma is the left-to-right tilt in degrees, where right is positive
        var tiltLR = eventData.gamma;

        // beta is the front-to-back tilt in degrees, where front is positive
        var tiltFB = eventData.beta;

        // alpha is the compass direction the device is facing in degrees
        var dir = eventData.alpha

        // call our orientation event handler
        deviceOrientationHandler(tiltLR, tiltFB, dir);
        playerAction(tiltLR, tiltFB);
        }

    }, false);
} else {
    document.getElementById("doEvent").innerHTML = "Not supported."
}