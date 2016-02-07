define(['Helper', 'box2d'], function(Helper) {
        
    var Wall = function(world, ctx, options){
        this.type = 'Wall';
        this.world = world;
        this.ctx = ctx;
        
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.density = options.density;
        this.friction = options.friction;
        this.restitution = options.restitution;
        
        this.body = this._getBody();
            
    }
    
    Wall.prototype._getBody = function(){
        var fixDef = this._getFixDef(); 
        fixDef.shape = this._getShape();
        var bodyDef = this._getBodydef();

        this.body = this.world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);
        this.body.SetUserData(this);
        return this;
    }
    
    Wall.prototype._getFixDef = function(){
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.density = this.density;
        fixDef.friction = this.friction;
        fixDef.restitution = this.restitution; 
        
        return fixDef;
    }
    
    Wall.prototype._getShape = function(){
        var shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsBox(this.toMetr(this.width) / 2, this.toMetr(this.height)/2);
        
        return shape;
    }
    
    Wall.prototype._getBodydef = function(){
        var bodyDef = new Box2D.Dynamics.b2BodyDef();            
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.Set(this.toMetr(this.x + this.width/2), this.toMetr(this.y + this.height/2));
        
        return bodyDef;
    }
    
    Wall.prototype.render = function(){
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();
    }

    for(var property in Helper){
       Wall.prototype[property] = Helper[property]; 
    }
    
    return Wall;
});