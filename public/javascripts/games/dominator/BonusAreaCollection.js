define(['BonusSlot', 'bonuses/BonusAreaFrize', 'bonuses/BonusAreaSnail', 'bonuses/BonusAreaWave', 'bonuses/BonusAreaSpeed'], function(BonusSlot, BonusAreaFrize, BonusAreaSnail, BonusAreaWave, BonusAreaSpeed) {
    
    var BonusAreaCollection = function(paper, width, height, count){
        
        this.paper = paper;
        this.width = width;
        this.height = height;
        this.spawnTime = 150;
        this.bonusConstructors = [
//             BonusAreaFrize,
            BonusAreaSnail,
//             BonusAreaWave,
            BonusAreaSpeed
        ];
        
        this.slots = [];
        
        this.init = function(){
            for(var i = 0; i < count; i++){
                var slot = new BonusSlot(this.paper, this.getSlotPosition(i), 20);
                slot.initBonus(this.getRandomBonus());
                this.slots.push(slot);
            }            
            return this;
        }
        
        
        this.getSlotPosition = function(id){
            var position = {};
            if(id == 0){
                position.x = this.width/3;
                position.y = this.height/2;
            }
            if(id == 1){
                position.x = this.width/3 * 2;
                position.y = this.height/2;
            }
            return position;
        }
        
        this.getRandomBonus = function(index){
            var position = this.getSlotPosition(index);
            var rand = Math.floor(Math.random() * this.bonusConstructors.length);
            return this.bonusConstructors[rand];            
        }
        
        this.checkPlayerGetBonus = function(player){
            for(var i = 0; i < this.slots.length; i++){
                if(!this.slots[i].isActive()){
                    continue;
                }
                var xLen = player.x - this.slots[i].x;
                var yLen = player.y - this.slots[i].y;
                var minLen = player.r + this.slots[i].r;
                if(Math.sqrt(xLen*xLen + yLen*yLen) < minLen){
                    player.addBonus(this.slots[i].bonus);
                    this.slots[i].clear();                   
                }
            }
        }
        
        this.activateBonusArea = function(){
            for(var i = 0; i < this.slots.length; i++){
                if(this.slots[i].isActive()){
                    continue;
                }
                if(this.slots[i].removeTime >= this.spawnTime){
                    this.slots[i].initBonus(this.getRandomBonus());
                }
                else{
                    this.slots[i].removeTime++
                }
            } 
        }
        

        
    }
    
    return BonusAreaCollection;
});