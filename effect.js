function Effect() {
	this.max_lifetime = 10;
	this.lifetime = 0;
	this.is_collider = false;
	
	this.draw = function(ctx) {
		return;
	}
	
	this.is_alive = function() {
		return (this.lifetime < this.max_lifetime);
	}
}

Effect.prototype = new Actor;
Effect.prototype.constructor = Effect;
Effect.superclass = Actor.prototype;


function Halo() {
	this.initial_radius;
	this.final_radius;
	this.radius_delta;
	
	this.init = function(origin, start_radius, max_lifetime) {
		this.origin = origin;
		this.max_lifetime = max_lifetime;
		this.initial_radius = start_radius;
		this.final_radius = start_radius * 1.05;
		this.radius_delta = (this.final_radius - start_radius)/this.max_lifetime;
	}
	
	this.step = function() {
		this.lifetime += 1;
	}
	
	this.draw = function(ctx) {
		var alpha = (this.max_lifetime-this.lifetime)/this.max_lifetime;
		ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
		var radius_scale = 1+(this.radius_delta*this.lifetime);
		
		//ctx.strokeStyle = "black";
		ctx.beginPath();
		
		
		ctx.arc(this.origin.x, this.origin.y, this.initial_radius*radius_scale, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.stroke();
	}
}

Halo.prototype = new Effect;
Halo.prototype.constructor = Halo;
Halo.superclass = Effect.prototype;