/**
* Created with crazyBalls.
* User: vamakin
* Date: 2015-12-20
* Time: 03:25 PM
* To change this template use Tools | Templates.
*/
define(function() {
    var countDown = function(ctx, gameOptions, options, callback){
        this.ctx = ctx;
        this.gameOptions = gameOptions;
        this.counter = options.initialCounter;
        this.options = options;
        this.callback = callback;
        
        var self = this;
        
        this.decrementCounter = function(){    
            self.counter--;
            if(self.counter == 0){
                self.callback();
            }
        }
        
        this.init = function(){
            window.setInterval(this.decrementCounter, 1000);            
            return this;
        }
        
        this.render = function(){
            this.showBlur();
            this.showCounter();          
        }
        
        this.showBlur = function(){
            this.ctx.save();
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillRect(0, 0, this.gameOptions.width, this.gameOptions.height);
            this.ctx.restore();
        }
        
        this.showCounter = function(){
            this.ctx.save();
            this.ctx.font  = this.options.font;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline  = 'middle';
            this.ctx.fillStyle = this.options.fontColor;            
            this.ctx.fillText(this.getCounterMessage(), this.gameOptions.width/2, this.gameOptions.height/2);
            this.ctx.restore();
        }
        
        this.getCounterMessage = function(){
            return 'START IN ' + this.counter;
        }
        
        
    }
    
    return countDown;
});