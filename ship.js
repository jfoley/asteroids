function Ship() { };

Ship.prototype = {
	angle: 0.0,
	max_speed: 5.0,
	max_turbo_speed: 10.0,
	bullets: [],
	mass: 0.1,
	turning_speed: 9.0,

	ship_size: 30.0, //size of the ship in pixels
	health: 100,
	draw_vectors: false,
	turbo: 10,
	turbo_active: false,
	listen_input: false,

	init: function() {
		this.forward = new Vector(0.0, -1.0);
		this.velocity = new Vector(0.0, 0.0);
		this.thrusters = new Particle_Source();
		this.radius = this.ship_size/2.0;
		this.origin.x = The_Engine.Screen.width/2;
		this.origin.y = The_Engine.Screen.height/2;
		The_Engine.Actors.push(this.thrusters);
	},

	accelerate: function() {
		x_prime = Math.cos((this.angle-135.0)*(Math.PI/180.0)) - Math.sin((this.angle-135.0)*(Math.PI/180.0));
		y_prime = Math.sin((this.angle-135.0)*(Math.PI/180.0)) + Math.cos((this.angle-135.0)*(Math.PI/180.0));

		this.velocity.x += (0.3)*x_prime;
		this.velocity.y += (0.3)*y_prime;

		var speed = this.velocity.length();
		if(speed > this.max_speed) {
			this.velocity.x *= (this.max_speed / speed);
			this.velocity.y *= (this.max_speed / speed);
		}
	},

	friction: function () {
		var friction = new Vector(-this.velocity.x, -this.velocity.y);

		this.velocity.x += (0.06)*friction.x;
		this.velocity.y += (0.06)*friction.y;
	},

	rotate: function() {
		if(The_Engine.Input.left) {
			this.angle -= this.turning_speed;
		}
		if(The_Engine.Input.right) {
			this.angle += this.turning_speed;
		}

		if(this.angle > 360.0)
			this.angle = 0.0;
		if(this.angle < -360.0)
			this.angle = 0.0;

		this.forward.x = 0.0;
		this.forward.y = -1.0;
		this.forward.rotate(this.angle);
		this.thrusters.forward.x = -this.forward.x;
		this.thrusters.forward.y = -this.forward.y;
	},

	draw_HUD: function(ctx) {
		//draw text
		var font = "sans";
		var fontsize = 16;
		var height = ctx.fontAscent( font, fontsize);
		ctx.strokeStyle = "rgba(0,0,0,0.75)";
		ctx.drawText( font, fontsize, 0, height,
			"Health:" + this.health);
	},

	draw: function(ctx) {
		this.draw_HUD(ctx);

		ctx.fillStyle = "red";
		ctx.beginPath();
		var start = new Point(0, -15);
		start.rotate(this.angle);
		ctx.moveTo(this.origin.x + start.x, this.origin.y + start.y);

		var bottom_right = new Point(15, 15);
		bottom_right.rotate(this.angle);
		ctx.lineTo(this.origin.x + bottom_right.x, this.origin.y + bottom_right.y);

		var curve = new Point(0, -5);
		curve.rotate(this.angle);

		var end = new Point(-10, 15);
		end.rotate(this.angle);
		ctx.bezierCurveTo(this.origin.x + curve.x, this.origin.y + curve.y,
			this.origin.x + curve.x, this.origin.y + curve.y,
			this.origin.x + end.x, this.origin.y + end.y);
		ctx.lineTo(this.origin.x + start.x, this.origin.y + start.y);
		ctx.fill();

		if(this.draw_vectors) {
			var vector_length = 15.0;
			//draw the ships forward vector
			ctx.strokeStyle = "rgb(0, 0, 0)";
			ctx.beginPath();
			ctx.moveTo(this.origin.x, this.origin.y);
			ctx.lineTo(this.origin.x + this.forward.x*vector_length,
				this.origin.y + this.forward.y*vector_length);
			ctx.closePath();
			ctx.stroke();

			//draw the ships velocity vector
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.origin.x, this.origin.y);
			ctx.lineTo(this.origin.x + this.velocity.x*vector_length,
				this.origin.y + this.velocity.y*vector_length);
			ctx.closePath();
			ctx.stroke();

			//draw the bounding sphere
			ctx.beginPath();
			ctx.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.stroke();
		}
	},

	turbo: function() {
		if(this.turbo_active) {
			return;
		}

	},

	shoot: function() {
		var bullet = new Bullet(this.origin, this.forward);
		this.bullets.push(bullet);
		The_Engine.Actors.push(bullet);
	},
	process_input: function() {
		if(!this.listen_input)
			return;

		this.rotate();
		if(The_Engine.Input.up) {
			this.accelerate();
			for(var i = 0; i < 10; i++) {
				this.thrusters.create_particle();
			}
		}

		if(The_Engine.Input.ctrl)
			this.turbo();

		if(The_Engine.Input.spacebar)
			this.shoot();
	},

	step: function () {
		this.process_input();
		this.thrusters.origin = this.origin;

		for(var i = 0; i < this.bullets.length; i++) {
			var bullet = this.bullets[i];
			if(bullet.is_alive() == false) {
				//this.bullets.splice(i, 1); //delete it
				bullet.destroy();
			}
		}

		this.origin.x += this.velocity.x;
		this.origin.y += this.velocity.y;

		//dont allow the ship to go out of bounds - just bounce off the walls
		if(this.origin.x + this.ship_radius > The_Engine.Screen.width ||
			this.origin.x - this.ship_radius < 0.0) {
			this.velocity.x = -this.velocity.x;
			this.origin.x += this.velocity.x;
		}
		if(this.origin.y + this.ship_radius > The_Engine.Screen.height ||
			this.origin.y - this.ship_radius < 0) {
			this.velocity.y = -this.velocity.y;
			this.origin.y += this.velocity.y;
		}

		if(this.velocity.length() > 0.0)
			this.friction();

		for(var i = 0; i < The_Engine.Enemy_Manager.Enemies.length; i++) {
			var enemy = The_Engine.Enemy_Manager.Enemies[i];
			if(this.is_collision(enemy) == true) {
				this.collision(enemy);
				this.health -= 5;

				var halo = new Halo();
				halo.init(this.origin, this.radius, 15);
				The_Engine.Actors.push(halo);
			}
		}
	},

	damage: function(amount) {
		this.health -= amount;
		if(this.health < 1) {
			this.alive = false;
		}
	},

	toJSON: function() {
		var network_ship = {
			identifier: The_Engine.Networking.identifier,
			origin: this.origin,
			velocity: this.velocity,
			bullets: this.bullets,
			angle: this.angle
		}
		return Object.toJSON(network_ship);
	},
}
extend(Ship, Actor);

function Bullet(point, vector) {
	this.bullet_speed = 10.0;
	this.origin = new Point(point.x, point.y);
	this.velocity = new Vector(vector.x, vector.y);
	this.damage = 1;
	this.radius = 1.0;

	this.step = function() {
		this.origin.x += this.velocity.x*this.bullet_speed;
		this.origin.y += this.velocity.y*this.bullet_speed;

		for(var i = 0; i < The_Engine.Enemy_Manager.Enemies.length; i++) {
			var enemy = The_Engine.Enemy_Manager.Enemies[i];
			if(this.is_collision(enemy)) {
				//we have a hit!
				enemy.damage(1);
				var sparks = new Momentary_Source();
				sparks.init(this.origin, new Vector(this.velocity.x, this.velocity.y), 20);
				The_Engine.Actors.push(sparks);
				this.alive = false;
				this.destroy();
			}
		}
	}

	this.is_alive = function() {
		return !this.origin.out_of_bounds();
	}

	this.draw = function(ctx) {
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(this.origin.x, this.origin.y, 3, 3);
	}

	this.destroy = function() {
		Bullet.prototype.destroy.call(this);
		var index = The_Engine.Ship.bullets.indexOf(this);
		The_Engine.Ship.bullets.splice(index, 1);
	}
}
Bullet.prototype = new Actor;
Bullet.prototype.constructor = Bullet;
Bullet.superclass = Actor.prototype;
