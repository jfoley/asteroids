function Big_Asteroid() {
	Big_Asteroid.prototype.MIN_RADIUS = 20.0;
	Big_Asteroid.prototype.MAX_RADIUS = 30.0;
	this.destroy = function() {
		for(var i = 0; i < 4; i++) {
			var roid = new Asteroid();
			roid.init();
			this.make_piece(roid);
			The_Engine.Enemy_Manager.add_enemies(roid);
		}
		Big_Asteroid.prototype.destroy.call(this);
	}
	
	this.make_piece = function(asteroid) {
		var angle = random_range(0, 360);
		var radius_vector = new Vector(Asteroid.prototype.MAX_RADIUS, 0);
		radius_vector.rotate(angle);
		asteroid.origin = this.origin.plus(radius_vector);
		
		var velocity_mag =  random_range(Asteroid.prototype.MIN_VELOCITY, Asteroid.prototype.MAX_VELOCITY);
		var velocity_vector = new Vector(velocity_mag, 0);
		velocity_vector.rotate(angle);
		asteroid.velocity = velocity_vector;
	}
}

Big_Asteroid.prototype = new Asteroid;
Big_Asteroid.prototype.constructor = Big_Asteroid;
Big_Asteroid.superclass = Asteroid.prototype;