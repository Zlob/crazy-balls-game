define(['box2d'], function() {
        
    var wall = function(game, position){
        this.position = position;
        
        this.toMetr = function(pixels){
            return pixels / this.position.metr;
        }
        
        this.fixDef = new Box2D.Dynamics.b2FixtureDef();

        this.fixDef.density = 1.0;
        this.fixDef.friction = 0.5;
        this.fixDef.restitution = 0.2; 
        this.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        this.fixDef.shape.SetAsBox(this.toMetr(this.position.width) / 2, this.toMetr(this.position.height)/2);

        this.bodyDef = new Box2D.Dynamics.b2BodyDef();            
        this.bodyDef.type = Box2D.Dynamics.b2BodyDef.b2_staticBody;
        this.bodyDef.position.Set(this.toMetr(this.position.x + this.position.width/2), this.toMetr(this.position.y + this.position.height/2));
        game.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
        
        this.render = function(){
            game.ctx.fillStyle = 'red';
            game.ctx.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
        }
        

    }
    return wall;
});