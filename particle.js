function Particle(point, vector, source) {
	this.origin = point;
	this.velocity = vector;
	this.lifetime = 0;
	this.max_lifetime = 20;
	this.source = source;
	this.is_collider = false;
	
	this.step = function() {
		this.origin.x += this.velocity.x;
		this.origin.y += this.velocity.y;
		this.lifetime += 1;
		if(this.origin.out_of_bounds() || this.lifetime > this.max_lifetime)
			this.alive = false;
	}
	
	this.draw = function(ctx) {
		var fillstyle = "rgba(0, 0, 0, " + (this.max_lifetime-this.lifetime)/this.max_lifetime + ")";
		ctx.fillStyle = fillstyle;
		ctx.fillRect(this.origin.x, this.origin.y, 1, 1);
	}
	
	this.friction = function (coefficient) {
		var friction = new Vector(-this.velocity.x, -this.velocity.y);

		this.velocity.x += coefficient*friction.x;
		this.velocity.y += coefficient*friction.y;
	}
}

Particle.prototype = new Actor;

function Particle_Source() {
	this.origin = new Point(0.0, 0.0);
	this.forward = new Vector(0.0, 0.0);
	
	this.max_x_offset = 3.0;
	this.max_y_offset = 3.0;
	this.max_spread = 15.0; //degrees
	this.is_collider = false;
	this.particles = new Array();
	
	this.is_alive = function() {
		return true;
	}
	
	this.create_particle = function() {
		var new_coords = new Point(this.origin.x + (Math.random()*this.max_x_offset), 
								   this.origin.y + (Math.random()*this.max_y_offset));
		var new_velocity = new Vector(this.forward.x*2, this.forward.y*2);
		new_velocity.rotate(random_range(-this.max_spread, this.max_spread)); 
		var new_particle = new Particle(new_coords, new_velocity);
		this.particles.push(new_particle);
	}
	
	this.step = function() {
		for(var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			particle.step();
			if(particle.is_alive() == false) {
				this.particles.splice(i, 1); //weird way to delete...
			}
		}
	};
	
	this.draw = function(ctx) {
		for(var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			particle.draw(ctx);
		}
	}
}
Particle_Source.prototype = new Actor;
Particle_Source.prototype.constructor = Particle_Source;
Particle_Source.superclass = Actor.prototype;

Momentary_Source = function() {
	this.lifetime = 0;
	this.max_lifetime = 20;
	
	this.init = function(origin, forward, lifetime) {
		this.max_lifetime = lifetime;
		this.origin = origin;
		this.forward = forward;
		this.forward.normalize();
		this.forward.reverse();
	}
	
	this.create_particle = function() {
		var new_coords = new Point(this.origin.x + (Math.random()*this.max_x_offset), 
								   this.origin.y + (Math.random()*this.max_y_offset));
		var new_velocity = new Vector(this.forward.x, this.forward.y);
		new_velocity.rotate(random_range(-this.max_spread, this.max_spread)); 
		var new_particle = new Particle(new_coords, new_velocity);
		new_particle.max_lifetime = 100;
		this.particles.push(new_particle);
	}
	
	this.step = function() {
		Momentary_Source.superclass.step.call(this);
		if(this.lifetime < 3) {
			this.create_particle();
		}
		
		for(var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			particle.friction(0.03);
		}
		this.lifetime += 1;		
	}
	
	this.is_alive = function() {
		if(this.lifetime < this.max_lifetime && this.particles.length > 0)
			return true;
		else
			return false;
	}
}
Momentary_Source.prototype = new Particle_Source;
Momentary_Source.prototype.constructor = new Momentary_Source;
Momentary_Source.superclass = Momentary_Source.prototype;
