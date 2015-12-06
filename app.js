var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'jade');
app.use(express.static('public'));

///////////////////////////////////////////////////////////////////

var games = {};

Game = function(id, gameSocket){
    this.id = id;
    this.gameSocket = gameSocket;
    this.players = {};
    this.addPlayer = function(player){
        console.log('add player')
        
    }
}


///////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/game/:game_id/player/:player_id', function(req, res){
    res.render('player.jade', { game_id: req.params.game_id, player_id: req.params.player_id});
});

app.get('/game', function(req, res){
  res.render('game.jade', req.query);
});


//////////////////////////////////////////////////////////////////////


io.on('connection', function(socket){
    console.log('connection');
    
    socket.on('addGame', function(data){
//         console.log('addGame', data);
        var players_num = data.players_num;
        var roomNumber = Object.keys(games).length + 1; //Date.now().toString() + Math.random().toString();
        games[roomNumber] = new Game(roomNumber, socket);
        
        data = {
            roomNumber: roomNumber,
            links : []
        }
        
        for(var i = 1; i <= players_num; i++){
            data.links.push('https://neutral-sierra-9500.codio.io/game/'+roomNumber+'/player/'+ i);
        }
        socket.emit('playerLinks', data);   
    })
    
    socket.on('addPlayer', function(data){
        console.log('addPlayer', data);
        var game = games[data.game_id];
        game.players[data.player_id] = socket;
        game.gameSocket.emit('addPlayer', data);
    })
    
    socket.on('playerMove', function(data){
        console.log('playerMove', data);
        var game = games[data.game_id];
        game.gameSocket.emit('playerMove', data);
    })  
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });    
    
    
});

////////////////////////////////////////////////////////////////////////////

http.listen(9500, function(){
  console.log('listening on *:9500');
});