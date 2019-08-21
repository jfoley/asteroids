function Actor() { };
Actor.prototype = {
	origin: new Point(0, 0),
	radius: 0.0,
	alive: true,
	mass: 1.0,
	is_collider: true,
	
	toJSON: function() {
		var simple_actor = {
			origin: this.origin,
			mass: this.mass
		};
		return Object.toJSON(simple_actor);
	},
	
	init: function() {
		return;
	},
	
	is_alive: function() {
		return this.alive;
	},
	
	step: function() {
		return;
	},
	
	destroy: function() {
		var index = The_Engine.Actors.indexOf(this);
		if(index < 0) {
			throw 'tried to delete an object that is not an actor from actor list'
		}
		The_Engine.Actors.splice(index, 1);
	},
	
	toString: function() {
		return "Actor";
	},
	
	is_collision: function(actor) {
		//we cant collide with ourselves
		if(actor === this)
			return false;
			
		//make sure both actors are colliders
		if(!this.is_collider || !actor.is_collider)
			return false;
			
		return (this.origin.distance(actor.origin) < (this.radius + actor.radius));
	},
	
	fix: function() {
		for(var i = 0; i < The_Engine.Actors.length; i++)
		{
			var actor = The_Engine.Actors[i];
			if(this.is_collision(actor)) {
				var normal = new Vector(actor.origin.x - this.origin.x, 
					actor.origin.y - this.origin.y);
				normal.normalize();
				normal.reverse();
				var scale = (this.radius + actor.radius) - this.origin.distance(actor.origin);
				normal.multiply(scale*1.25);

				this.origin.x += normal.x;
				this.origin.y += normal.y;
			}
		}
	},
	
	collision: function(actor) {
		//this.draw(The_Engine.ctx);
		//actor.draw(The_Engine.ctx);


		var normal = new Vector(actor.origin.x - this.origin.x, 
			actor.origin.y - this.origin.y);
		normal.normalize();

		var tangent = new Vector(-normal.y, normal.x);

		var this_norm_vel = this.velocity.dot_product(normal);
		var this_tan_vel = this.velocity.dot_product(tangent);

		var actor_norm_vel = actor.velocity.dot_product(normal);
		var actor_tan_vel = actor.velocity.dot_product(tangent);

		var this_vel_prime = (this_norm_vel*(this.mass-actor.mass) + 2*(actor.mass*actor_norm_vel))/(this.mass + actor.mass);
		var actor_vel_prime = (actor_norm_vel*(actor.mass-this.mass) + 2*(this.mass*this_norm_vel))/(this.mass + actor.mass);

		var this_final_vector = new Vector(normal.x * this_vel_prime + tangent.x * this_tan_vel,
			normal.y * this_vel_prime + tangent.y * this_tan_vel);

		var actor_final_vector = new Vector(normal.x * actor_vel_prime + tangent.x * actor_tan_vel,
			normal.y * actor_vel_prime + tangent.y * actor_tan_vel);
		
		this.fix();

		this.velocity = this_final_vector;
		actor.velocity = actor_final_vector;
		//The_Engine.ctx.clearRect(0, 0, The_Engine.Screen.width, The_Engine.Screen.height);
		//this.draw(The_Engine.ctx);
		//actor.draw(The_Engine.ctx);
		
		if(this.is_collision(actor) == true) {
			The_Engine.ctx.clearRect(0, 0, The_Engine.Screen.width, The_Engine.Screen.height);
			this.draw(The_Engine.ctx);
			actor.draw(The_Engine.ctx);
			throw 'not corrected';
		}
	}
}
