define(['io', 'swal', 'QRCode'], function (io, swal) {
    var gameController = function(playersNum, game){
        this.playersNum = playersNum;
        this.gameId = null;
        this.game = game;
        this.players = 0;  
        var self = this;

        this.init = function(){

            this.socket = io();

            this.socket.emit('addGame', {playersNum: self.playersNum});      

            this.socket.on('gameData', function(data){
                self.gameId = data.gameId;
                self.showLinks(data);
            });

            this.socket.on('addPlayer', function(data){
                self.playerReady(data.playerId, data.playerName);
                self.players++;

                if(self.players == self.playersNum){
                    self.startGame();
                }
            });       
        }

        this.registerPlayerAction = function(){
            var self = this;
            this.socket.on('playerActions', function(data){
                self.game.playerAction(data);
            });
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
            this.registerPlayerAction();
            this.game.init(canvas, this.gameOver);
            this.showCountDown();
        }
        
        this.gameOver = function(data){
            var text = data.reduce(function(result, player ){
                return result + "<tr>" + "<td>" + player.name + "</td>" + "<td>" + player.score + "</td>" + "</tr>";
            }, '<tr><th>Player</th><th>Score</th></tr>');
            text = '<table>' + text + '</table>';
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
                html: true
            }, function(isConfirm){
                if (isConfirm) {
                    window.location.reload();
                }
                else {
                    window.location = "/";   
                }});
        }            
            
        
        this.showCountDown = function(){
            swal({   
                title: "Game starts in",
                text: "1",
                showConfirmButton: false,
                customClass: 'count-down'
            });

            var intervalId = window.setInterval(function(){
                var countDownModal = $('.count-down');
                var countDownModalCounter = $('.count-down > p').first();
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
    }

    return gameController;
});
