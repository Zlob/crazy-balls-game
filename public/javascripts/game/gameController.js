define(['io', 'swal', 'QRCode'], function (io, swal) {
    var gameController = function(playersNum, Game, config){
        this.playersNum = playersNum;
        this.config = config;
        this.gameId = null;
        this.game = null;
        this.players = [];  
        var self = this;

        this.init = function(){

            this.socket = io();

            this.socket.emit('addGame', {playersNum: self.playersNum});      
            this.socket.on('playerActions', this.playrsAction);
            this.socket.on('gameData', function(data){
                self.gameId = data.gameId;
                self.showLinks(data);
            });

            this.socket.on('addPlayer', function(data){
                self.playerReady(data.playerId, data.playerName);
                self.players.push(data);

                if(self.players.length == self.playersNum){
                    self.startGame();
                }
            }); 
            this.addMenuEventListener();
        }

        this.playrsAction = function(data){
            self.game.playerAction(data);
        }

        this.showLinks = function(data){
            data.links.forEach(function(link, index){
                var id = 'player-area-' + ++index;
                var cotainer = document.getElementById(id);
                $(cotainer).attr('href', link);
                $(cotainer).attr('target', '_blank');
                var qrcode = new QRCode(cotainer, {
                    text: link,
                    style: 'display: "inline-block"',
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                })
                });
        }

        this.playerReady = function(playerId, playerName){
            var id = '#player-area-' + ++playerId;
            $(id).empty().append('<p>READY ' + playerName + '</p>');
        }
        
        this.startGame = function(){
            $('body').empty().append('<canvas id="canvas" width="1920" height="1080" style="background-color:#202020;"></canvas>');   
            var canvas = $('#canvas').get(0);
            this.socket.emit('startGame', {gameId: this.gameId});
            this.game = new Game(this.config);
            this.game.init(canvas, this.players, this.gameOver);
            this.showCountDown();
        }
        
        this.restartGame = function(){
            this.socket.emit('restartGame', {gameId: this.gameId});
            this.startGame();
        }
        
        this.addMenuEventListener = function(){
            $('body').keypress(function(event){
                if(self.game != null && self.game.getStatus() === 1){
                    self.showMenu();
                    self.game.pauseGame();
                }
                else if(self.game != null && self.game.getStatus() === 0){
                    swal.close();
                    self.game.resumeGame();
                }
            });
        }
        
        this.showMenu = function(){
            var text = self.getPlayersScoreTable();
            text += '<p>Press any key to continue</p>'
            swal({   
                title: "Menu",
                text: text,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Restart",
                cancelButtonText: "Select another game",
                closeOnConfirm: false,
                closeOnCancel: false,
                customClass: 'menu-msg',
                allowEscapeKey: true,
                html: true
            }, function(isConfirm){
                if (isConfirm) {
                    self.restartGame();
                }
                else {
                    window.location = "/";   
                }});
        }
        
        this.gameOver = function(data){
            var text = self.getPlayersScoreTable();
            swal({   
                title: "Game Over",
                text: text,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Restart",
                cancelButtonText: "Select another game",
                closeOnConfirm: false,
                closeOnCancel: false,
                customClass: 'game-over',
                allowEscapeKey: false,
                html: true
            }, function(isConfirm){
                if (isConfirm) {
                    self.restartGame();
                }
                else {
                    window.location = "/";   
                }});
        }                      
        
        this.showCountDown = function(){
            swal({   
                title: "Game starts in",
                text: "<p class='counter-field'>5</p><p>Press any key to enter the menu</p>",
                showConfirmButton: false,
                html: true,
                customClass: 'count-down'
            });

            var intervalId = window.setInterval(function(){
                var countDownModal = $('.count-down');
                var countDownModalCounter = $('.counter-field').first();
                var counter = parseInt(countDownModalCounter.html());
                counter--;
                countDownModalCounter.html(counter);
                if(counter == 0){
                    swal.close();
                    window.clearInterval(intervalId);
                    self.game.startGame();
                }
            }, 1000);
        }
        
        this.getPlayersScoreTable = function(){
            var data = self.game.getPlayersScore();
            var text = data.reduce(function(result, player ){
                return result + "<tr>" + "<td>" + player.name + "</td>" + "<td>" + player.score + "</td>" + "</tr>";
            }, '<tr><th>Player</th><th>Score</th></tr>');
            text = '<table>' + text + '</table>';
            return text;
        }
    }

    return gameController;
});
