var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'jade');
app.use(express.static('public'));

///////////////////////////////////////////////////////////////////

var games = []; //remove from global scope, module?
var sendActions = function(){
    games.forEach(function(game){
        if(game.isStarted()){
            game.sendPlayerActions();
        }
    })
}

Game = function(id, gameSocket){
    var IS_CREATED = 0;
    var IS_STARTED = 1;
    
    this.id = id;
    this.gameSocket = gameSocket;
    this.status = IS_CREATED;
    this.players = {};
    this.actions = {};
    
    this.addPlayer = function(id, player){
        this.players[id] = player;
    }
    
    this.getPlayer = function(id){
        return this.players[id];
    }
    
    this.addPlayerAction = function(playerId, playerAction, data){
        this.getPlayer(playerId).addAction(playerAction, data);
    }
    
    this.sendPlayerActions = function(){
        for(var playerId in this.players){
            if (this.players.hasOwnProperty(playerId)) {
                var player = this.getPlayer(playerId);
                this.actions[playerId] = player.actions;
//                 player.clearActions();
            }
        }
        this.gameSocket.emit('playerActions', this.actions);
    }
    
    this.startGame = function(){
        this.status = IS_STARTED;
    }
    
    this.isStarted = function(){
        return this.status == IS_STARTED;
    }
}

Player = function(id, socket){
    this.id = id;
    this.socket = socket;
    this.actions = {};
    
    this.addAction = function(action, data){
        this.actions[action] = data;
    }
    
    this.clearActions = function(){
        for(var actionName in this.actions){
            delete this.actions[actionName];
        }
    }
}


///////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/game/:gameId/player/:playerId', function(req, res){
    res.render('player.jade', { gameId: req.params.gameId, playerId: req.params.playerId});
});

app.get('/game', function(req, res){
  res.render('game.jade', req.query);
});


//////////////////////////////////////////////////////////////////////


io.on('connection', function(socket){
    console.log('connection');
    
    socket.on('addGame', function(data){
        var playersNum = data.playersNum;
        var gameId = Object.keys(games).length + 1; //Date.now().toString()
        games[gameId] = new Game(gameId, socket);
        
        data = {
            gameId: gameId,
            links : []
        }
        
        for(var i = 1; i <= playersNum; i++){
            data.links.push('https://neutral-sierra-9500.codio.io/game/'+gameId+'/player/'+ i);
        }
        socket.emit('gameData', data);
    })
    
    socket.on('addPlayer', function(data){
        console.log('addPlayer', data );
        var game = games[data.gameId];
        var player = new Player(data.playerId, socket);
        game.addPlayer(data.playerId, player);
        game.gameSocket.emit('addPlayer', data);
    })
    
    socket.on('playerAction', function(action){
        var game = games[action.gameId];
        game.addPlayerAction(action.playerId, action.type, action.data)
    })  
    
    socket.on('startGame', function(data){      
        var game = games[data.gameId];
        game.startGame();
    })
    
    socket.on('disconnect', function(){
        console.log('user disconnected'); //todo if game socket - remove game, if playersocket - send remove message to game client
    });        
    
});

// setInterval(sendActions, 1000 / 60);
setInterval(sendActions, 1000 / 60);

////////////////////////////////////////////////////////////////////////////

http.listen(9500, function(){
  console.log('listening on *:9500');
});