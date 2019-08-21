function Networking() {
	var _this = this;
	this.identifier = Math.random() * 255;
	this.client_hash = new Hash();
	this.server_addr = "localhost:9292"
	this.init = function() {
		//nothing yet
	}
	
	this.start = function() {
		new Ajax.Request("localhost:9292", {
			method: 'get',
			parameters: {
				method: "hello",
				identifier: _this.identifier,
				ship: The_Engine.Ship.toJSON()
				},
			onSuccess: function(transport) {
				_this.interval = setInterval(_this.step, 200);
			}
		});
		
		/////////
		_this.interval = setInterval(_this.step, 2000);
		
		//////
	}
	
	this.create_ship = function(json) {
		var new_ship = new Remote_Ship();
		new_ship.init(json);
		The_Engine.Actors.push(new_ship);
		_this.client_hash.set(json.identifier, new_ship);
	}
	
	this.update_ships = function(json) {
		//for(var i = 0; i < json.length; i++) {
			var ship = _this.client_hash.get(json.identifier);
			if(ship == null) {
				_this.create_ship(json);
				ship = _this.client_hash.get(json.identifier)
			}
			ship.update(json);
		//}
	}
	
	this.stop = function() {
		clearInterval(this.interval);
	}
	
	this.step = function() {
		var events = Object.toJSON(The_Engine.Input.get_event_queue());
		new Ajax.Request("../server", {
			method: 'get',
			parameters: {
				method: "step",
				identifier: _this.identifier,
				ship: The_Engine.Ship.toJSON(),
				events: events
				},
			onSuccess: function(transport) {
				var json = transport.responseText.evalJSON(true);
				if(json != null) {
					_this.update_ships(json);
				}
			}
		});
	}
	
	this.status = function() {
		new Ajax.Request("../server", {
			method: 'get',
			parameters: {
				method: "status"
				},
			onSuccess: function(transport) {
				$('pos').update(transport.responseText);
				_this.stop();
			}
		});
	}
	
	this.reset = function() {
		_this.stop();
		new Ajax.Request("../server", {
			method: 'get',
			parameters: {
				method: "reset"
				}
		});
		_this.start();
	}
}