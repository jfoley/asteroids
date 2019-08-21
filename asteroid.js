function Asteroid() {
	Asteroid.prototype.MIN_VERTS = 8;
	Asteroid.prototype.MAX_VERTS = 20;
	Asteroid.prototype.MIN_RADIUS = 10.0;
	Asteroid.prototype.MAX_RADIUS = 20.0;
	Asteroid.prototype.MIN_VELOCITY = 0.6;
	Asteroid.prototype.MAX_VELOCITY = 1.2;
	
	this.vertices = [];
	this.origin = new Point(0.0, 0.0);
	this.velocity = new Vector(0.0, 0.0);
	this.radius = 0.0;
	this.health = 10;
	this.draw_vectors = false;
	
	this.init = function() {
		
		var num_verts = random_range(8, 20);
		var multiplier = 360.0/num_verts;
		var radius = random_range(this.MIN_RADIUS, this.MAX_RADIUS);
		var max_radius = 0;
		
		for(var i=0; i < num_verts; i++) {
			var vert = new Vector(0.0, 1.0);
			vert.rotate(i*multiplier);
			var vert_radius = random_range(radius*0.50, radius);
			vert.multiply(vert_radius);
			if(vert_radius > max_radius)
				max_radius = vert_radius;

			this.vertices.push(vert);
		}
		this.radius = max_radius;
				
		this.origin.x = random_range(0, The_Engine.Screen.width);
		this.origin.y = random_range(0, The_Engine.Screen.height);
		
		this.fix();
		
		this.velocity.x = random_range(this.MIN_VELOCITY, this.MAX_VELOCITY);
		if(Math.random() < 0.5)
			this.velocity.x = -this.velocity.x;
			
		this.velocity.y = random_range(this.MIN_VELOCITY, this.MAX_VELOCITY);
		if(Math.random() < 0.5)
			this.velocity.y = -this.velocity.y;
	}
	
	this.is_alive = function() {
		if(this.health < 1) {
			return false;
		}
		return true;
	}
	
	this.damage = function(amount) {
		this.health -= amount;
	}
	
	this.step = function() {
		this.origin.x += this.velocity.x;
		this.origin.y += this.velocity.y;
		
		if(this.origin.x > The_Engine.Screen.width) {
			this.origin.x = 0;
		}
		if(this.origin.x < 0) {
			this.origin.x = The_Engine.Screen.width;
		}

		if(this.origin.y > The_Engine.Screen.height) {
			this.origin.y = 0;
		}
		if(this.origin.y < 0) {
			this.origin.y = The_Engine.Screen.height;
		}
		for(var i = 0; i < The_Engine.Enemy_Manager.Enemies.length; i++) {
			var enemy = The_Engine.Enemy_Manager.Enemies[i];
			
			//dont check against itself
			if(enemy === this)
				continue;
				
			//only bounce off of other asteroids
			if(Asteroid.prototype.isPrototypeOf(enemy)) {
				if(this.is_collision(enemy)) {
					this.collision(enemy);
				}
			}
		}
	}
	
	this.destroy = function() {
		Asteroid.prototype.destroy.call(this);
		var index = The_Engine.Enemy_Manager.Enemies.indexOf(this);
		The_Engine.Enemy_Manager.Enemies.splice(index, 1);
	}
	
	this.draw = function(ctx) {
	
		ctx.strokeStyle = "black";
		ctx.beginPath();
		for(var i = 0; i < this.vertices.length; i++) {
			var vert = this.vertices[i];
			if(i == 0) {
				var x = this.origin.x + vert.x;
				ctx.moveTo(this.origin.x + vert.x, this.origin.y + vert.y);
			}
			ctx.lineTo(this.origin.x + vert.x, this.origin.y + vert.y);
		}
		ctx.closePath();
		ctx.stroke();
		
		if(this.draw_vectors) {
			var vector_length = 15.0;

			//draw the velocity vector
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.origin.x, this.origin.y);
			ctx.lineTo(this.origin.x + this.velocity.x*vector_length, 
				this.origin.y + this.velocity.y*vector_length);
			ctx.stroke();
			
			//draw the bounding sphere
			ctx.beginPath();
			ctx.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.stroke();
		}
	}
}

Asteroid.prototype = new Actor;
Asteroid.prototype.constructor = Asteroid;
Asteroid.superclass = Actor.prototype;