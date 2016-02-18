define(['io', 'swal', 'QRCode'], function (io, swal) {
    var GameController = function(playersNum, Game){
        this.playersNum = playersNum;
        this.gameId = null;
        this.game = null;
        this.canvas = null;
        this.players = [];  
        this.countDownIntervalId = null;
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

            var width = screen.width;
            var height = screen.height;
            this.canvas = this._getCanvas(width, height);            
            
            this.game = new Game(this.canvas, {height: height, width: width}, this.playersNum);

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
            $('body').empty().append(this.canvas);   
            var canvas = $('#canvas').get(0);
            this.socket.emit('startGame', {gameId: this.gameId});
            this.game.init(this.players, this.gameOver);
            this.showCountDown();
        }
        
        this.restartGame = function(){
            this.socket.emit('restartGame', {gameId: this.gameId});
            this.startGame();
        }
        
        this.addMenuEventListener = function(){           
            $('body').keypress(function(event){
                if(self.game.getStatus() === 1){
                    self.showMenu();
                    self.game.pauseGame();
                }
                else if(self.game.getStatus() === 0){
                    swal.close();
                    window.clearInterval(self.countDownIntervalId);
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
            this.countDownIntervalId = window.setInterval(function(){
                var countDownModal = $('.count-down');
                var countDownModalCounter = $('.counter-field').first();
                var counter = parseInt(countDownModalCounter.html());
                counter--;
                countDownModalCounter.html(counter);
                if(counter == 0){
                    swal.close();
                    window.clearInterval(self.countDownIntervalId);
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
        
        this._getCanvas = function(width, height){
            var canvas = document.createElement('canvas');
            var widthAttr = document.createAttribute('width');
            widthAttr.value = width;
            canvas.setAttributeNode(widthAttr);
            
            var heightAttr = document.createAttribute('height');
            heightAttr.value = height;
            canvas.setAttributeNode(heightAttr);
            canvas.setAttribute('id', 'canvas');
            return canvas;
        }
    }

    return GameController;
});
