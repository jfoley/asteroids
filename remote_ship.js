function Remote_Ship() {};
Remote_Ship.prototype = {
	lifetime: 5,
	name: null,
	
	init: function(JSON) {
		Ship.prototype.init.call(this);
		this.update(JSON);
		var bp = 1;
	},
	
	update: function(JSON) {
		this.origin = new Point(JSON.origin.x, JSON.origin.y);
		this.velocity = new Vector(JSON.velocity.x, JSON.velocity.y);
		this.angle = JSON.angle;
		this.name = JSON.identifier;
		//this.bullets = JSON.bullets;
	},
	
	step: function() {
		Ship.prototype.step.apply(this);
	}
}

extend(Remote_Ship, Ship);