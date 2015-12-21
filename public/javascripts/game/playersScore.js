define(function() {
    var playersScore = function(ctx, gameOptions, options){
        var self = this;
        this.ctx = ctx;
        this.gameOptions = gameOptions;
        this.options = options;
        this.lineHeight = parseInt(this.options.font)
        this.score = null;
        
        this.init = function(){

        }
        
        this.render = function(){
            this.showPopUp();
            this.score.forEach(function(scoreLine, lineNum, players){
                self.showLine(scoreLine, lineNum, players.length);
            });

        }
        
        this.showPopUp = function(){
            
        }
        
        this.showLine = function(scoreLine, lineNum, length){
            var currentLine = lineNum++;
            this.ctx.save();
            this.ctx.font  = this.options.font;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline  = 'middle';
            this.ctx.fillStyle = this.options.fontColor;            
            this.ctx.fillText(this.getLineMsg(), this.gameOptions.width/2, (this.gameOptions.height/2 - length/2 * this.lineHeight)  + (currentLine * this.lineHeight));
            this.ctx.restore();
        }
        
        this.setScore = function(score){
            this.score = score;
        }
        
        this.getLineMsg = function(){
            return '#1: Player 1 547';
        }
    }
    return playersScore;
});