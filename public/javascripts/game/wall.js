define(['box2d'], function() {
        
    var wall = function(world, ctx, options){
        this.type = 'Wall';
        this.world = world;
        this.ctx = ctx;
        this.options = options;   
        
        this.body = null;

        this.init = function(){
            var fixDef = new Box2D.Dynamics.b2FixtureDef();

            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2; 
            fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
            fixDef.shape.SetAsBox(this.toMetr(this.options.width) / 2, this.toMetr(this.options.height)/2);

            var bodyDef = new Box2D.Dynamics.b2BodyDef();            
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
            bodyDef.position.Set(this.toMetr(this.options.x + this.options.width/2), this.toMetr(this.options.y + this.options.height/2));
            this.body = this.world.CreateBody(bodyDef);
            this.body.CreateFixture(fixDef);
            this.body.SetUserData(this);
            return this;
        }
        
        this.render = function(){
            this.ctx.save();
            this.ctx.fillStyle = this.options.color;
            this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height);
            this.ctx.restore();
        }
        
        this.toMetr = function(pixels){
            return pixels / this.options.pixelsInMetr;
        }
        

    }
    return wall;
});