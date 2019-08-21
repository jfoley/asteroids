function Engine() {
	this.Screen = $('canvas');
	this.Input = new Input_Manager();
	this.Ship = new Ship();
	this.Actors = new Array();
	this.Actors.push(this.Ship);
	this.ctx = this.Screen.getContext("2d");
	this.Enemies = new Array();
	this.Enemy_Manager = new Enemy_Manager();
	this.paused = false;
	this.Interval;
	this.Networking = new Networking();
	this.step_count = 0;
	
	CanvasTextFunctions.enable(this.ctx);

	this.init = function() {
		The_Engine.Input.init();
		The_Engine.Ship.init();
		The_Engine.Ship.listen_input = true;
		The_Engine.Enemy_Manager.init();
		The_Engine.Networking.init();
		The_Engine.start();
	},
	
	this.start = function() {
		The_Engine.Interval = setInterval(The_Engine.run, 34);
		The_Engine.Networking.start();
	}
	
	this.stop = function() {
		clearInterval(The_Engine.Interval);
		The_Engine.Networking.stop();
	}
	
	this.pause = function() {
		if(The_Engine.paused) {
			The_Engine.start();
			
		}
		else {
			var font = "sans";
			var fontsize = 16;
			The_Engine.ctx.strokeStyle = "rgba(0,0,0,0.75)";
			The_Engine.ctx.drawTextCenter( font, fontsize, The_Engine.Screen.width/2, The_Engine.Screen.height/2,
			"Paused");
			The_Engine.stop();
		}
		The_Engine.paused = !The_Engine.paused;
		
	}
	
	this.is_paused = function() {
		return The_Engine.paused;
	}
	
	this.run = function() {
		The_Engine.step_count++;
		The_Engine.Input.step();
		//$('left').update(The_Engine.Input.left);
		//$('right').update(The_Engine.Input.right);
		//$('space').update(The_Engine.Input.spacebar);
		
		var sources = [];
		var sparks = 0;
		//clear the screen
		The_Engine.ctx.clearRect(0, 0, The_Engine.Screen.width, The_Engine.Screen.height);
		for(var i = 0; i < The_Engine.Actors.length; i++) {
			var actor = The_Engine.Actors[i];
			if(Momentary_Source.prototype.isPrototypeOf(actor)) {
				sources.push(actor);
			}
			try {
				actor.step();
				actor.draw(The_Engine.ctx);
				if(actor.is_alive() == false) {
					//The_Engine.Actors.splice(i, 1); //delete it
					actor.destroy();
				}
			} catch (e) {
				The_Engine.stop();
				throw e;
			}
		}
		//$('actors').update(The_Engine.Actors.length);
		//$('particles').update(The_Engine.Ship.thrusters.particles.length);
		//$('bullets').update(The_Engine.Ship.bullets.length);
		//$('momentaries').update(sources.length);
		for(var i = 0; i < sources.length; i++) {
			sparks += sources[i].particles.length;
		}
		//$('sparks').update(sparks);
		//$('enemies').update(The_Engine.Enemy_Manager.Enemies.length);
	}
	
	this.check_consistency = function() {
		var bad_actors = new Array();
		for(var i = 0; i < The_Engine.Actors.length; i++) {
			var actor = The_Engine.Actors[i];
			for(var j = i+1; j < The_Engine.Actors.length-1; j++) {
				var other_actor = The_Engine.Actors[j];
				if(actor.is_collision(other_actor) == true) {
					var distance = actor.origin.distance(other_actor.origin);
					var total_radius = actor.radius + other_actor.radius;
					var error_string = "distance: " + distance + " total radius: " + total_radius;
					bad_actors.push([error_string, actor, other_actor]);
				}
			}
		}
		if(bad_actors.length > 0) {
			The_Engine.stop();
			The_Engine.ctx.clearRect(0, 0, The_Engine.Screen.width, The_Engine.Screen.height);
			for(var i = 0; i < bad_actors.length; i++) {
				var error = bad_actors[i][0];
				var actor = bad_actors[i][1];
				console.dir(actor);
				actor.draw(The_Engine.ctx);
			}
			throw error;
		}
	}
}
