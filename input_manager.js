function Input_Manager() {
	this.event_queue = new Queue();
	
	this.step = function() {
		if(this.is_input()) {
			var event_bundle = {};
			if(this.left == true) event_bundle.left = this.left;
			if(this.right == true) event_bundle.right = this.right;
			if(this.up == true) event_bundle.up = this.up;
			if(this.spacebar == true) event_bundle.spacebar = this.spacebar;
			event_bundle.step = The_Engine.step_count;
			this.event_queue.enqueue(event_bundle);
		}
	}
	
	this.get_event_queue = function() {
		var events = new Array();
		while(!this.event_queue.isEmpty()) {
			events.push(this.event_queue.dequeue());
		}
		return events;
	}
	
	this.is_input = function() {
		return (this.left == true || this.right == true || this.up == true || this.spacebar == true);
	}
}

Input_Manager.prototype = new Input;
Input_Manager.prototype.constructor = Input_Manager;
