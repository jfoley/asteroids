function Enemy_Manager() {
	this.Enemies = Array();
	
	this.current_level = 1;
	
	this.init = function() {
		The_Engine.Actors.push(this);
		this.test_big_roid();
		//this.debug_collisions();
		//this.level_1();
		//this.test_halo();
		
	}

	this.add_enemies = function(new_enemies) {
		this.Enemies.push(new_enemies);
		The_Engine.Actors.push(new_enemies);
	}
	
	this.test_halo = function() {
		var halo = new Halo();
		halo.init(new Point(50, 50), 10, 20);
		this.add_enemies(halo);
	}
	
	this.test_big_roid = function() {
		var big_roid = new Big_Asteroid();
		big_roid.init();
		this.add_enemies(big_roid);
		
	}
	
	this.debug_collisions = function() {
		var roid_1 = new Asteroid();
		roid_1.init();
		roid_1.origin = new Point(50, 250);
		roid_1.velocity = new Vector(2.0, 0);
		
		var roid_2 = new Asteroid();
		roid_2.init();
		roid_2.origin = new Point(150, 250);
		roid_2.velocity = new Vector(0, 0);
		roid_2.fix();
		
		this.add_enemies([roid_1, roid_2]);
	}
	
	this.level_1 = function() {
		for(var i = 0; i < 10; i++)
		{
			var roid = new Asteroid();
			roid.init();
			this.add_enemies(roid);
		}
	}
	
	this.level_2 = function() {
		for(var i = 0; i < 20; i++)
		{
			var roid = new Asteroid();
			roid.init();
			this.add_enemies(roid);
		}
	}
	
	this.is_alive = function() {
		return true;
	}
	
	this.draw = function(ctx) {
		return;
	}
	
	this.next_level = function() {
		this.current_level += 1;
		this.Enemies = [];
		var level_string = "level_" + this.current_level;
		eval("this." + level_string + "()");
	}
	
	
	this.step = function() {
		if(this.Enemies.length <= 0) {
			this.next_level();
		}
		
		for(var i = 0; i < this.Enemies.length; i++) {
			var enemy = this.Enemies[i];
			if(enemy.is_alive() == false) {
				//this.Enemies.splice(i, 1);
				enemy.destroy();
			}
		}
	}
}
