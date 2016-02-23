define([], function() {
    
    var ACTIVE = 0;
    var REMOVED = 1;
    
    var BonusAreaSlot = function(paper, position, r){
        this.paper = paper;
        this.x = position.x;
        this.y = position.y;
        this.r = r;
        
        this.bonus = undefined;
        
        this.status = ACTIVE;
        this.removeTime = 0;        
        
        this.isActive = function(){
            return this.status === ACTIVE;
        }
                
        this.clear = function(){
            this.status = REMOVED;
            this.removeTime = 0;
            this.bonus = undefined;
        }
        
        this.initBonus = function(constructor){
            this.status = ACTIVE;
            this.removeTime = 0;
            this.bonus = new constructor(this.paper, this.x, this.y, r);
        }
    }
    
    
    
    return BonusAreaSlot;
});