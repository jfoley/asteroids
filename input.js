function Input() {
	this.left = false;
	this.right = false;
	this.up = false;
	this.spacebar = false;
	this.ctrl = false;
	
	Event.KEY_SPACE = 32;
	Event.KEY_P = 80;
	Event.KEY_N = 78;
	Event.KEY_CTRL = 17;
	Event.KEY_R = 82;
	Event.KEY_S = 83;
	
	this.init = function () {
		var this_input = this;
		
		Event.observe(document, 'blur', function(e) {
			if(The_Engine.is_paused() == false)
				The_Engine.pause();
		});
		
		Event.observe(document, 'keydown', function(e) {
			if(e.keyCode == Event.KEY_LEFT)
				this_input.left = true;
			if(e.keyCode == Event.KEY_RIGHT)
				this_input.right = true;
			if(e.keyCode == Event.KEY_UP)
				this_input.up = true;
			if(e.keyCode == Event.KEY_SPACE)
				this_input.spacebar = true;
			if(e.keyCode == Event.KEY_CTRL)
				this_input.ctrl = true;
			
		});
		
		Event.observe(document, 'keyup', function(e) {
			if(e.keyCode == Event.KEY_LEFT)
				this_input.left = false;
			if(e.keyCode == Event.KEY_RIGHT)
				this_input.right = false;
			if(e.keyCode == Event.KEY_UP)
				this_input.up = false;
			if(e.keyCode == Event.KEY_SPACE)
				this_input.spacebar = false;
			if(e.keyCode == Event.KEY_P)
				The_Engine.pause();
			if(e.keyCode == Event.KEY_N)
				The_Engine.Networking.init();
			if(e.keyCode == Event.KEY_CTRL)
				this_input.ctrl = false;
			if(e.keyCode == Event.KEY_S)
				this_input.s = The_Engine.Networking.status();
			if(e.keyCode == Event.KEY_R)
				this_input.s = The_Engine.Networking.reset();
		}); 
	}
}
