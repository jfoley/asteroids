function extend(child, supertype)
{
   child.prototype.__proto__ = supertype.prototype;
}

Array.prototype.hasObject = (
  !Array.indexOf ? function (o)
  {
    var l = this.length + 1;
    while (l -= 1)
    {
        if (this[l - 1] === o)
        {
            return true;
        }
    }
    return false;
  } : function (o)
  {
    return (this.indexOf(o) !== -1);
  }
);

function random_range(min, max) {
	return min + Math.random()*(max-min);
}

function Point(x, y) {
	this.x = x;
	this.y = y;
	
	this.rotate = function(angle) {
		x_prime = this.x*Math.cos(angle*(Math.PI/180.0)) - this.y*Math.sin(angle*(Math.PI/180.0));
		y_prime = this.x*Math.sin(angle*(Math.PI/180.0)) + this.y*Math.cos(angle*(Math.PI/180.0));
		this.x = x_prime;
		this.y = y_prime;
	}
	
	this.out_of_bounds = function() {
		if(this.x > The_Engine.Screen.width || this.x < 0 ||
		   this.y > The_Engine.Screen.height || this.y < 0)
		   return true;
		else
			return false;
	}
	
	this.distance = function(point) {
		var delta_x = this.x - point.x;
		var delta_y = this.y - point.y;
		return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
	}
	
	this.plus = function(operand) {
		switch(operand.constructor) {
			case Vector:
				return this.plus_vector(operand.to_point());
			case Point:
				return this.plus_point(operand);
			default:
				throw operand.prototype + " can't be added to Point";
		}
	}
	
	this.plus_point = function(point) {
		return new Point(this.x + point.x, this.y + point.y);
	}
	
	this.plus_vector = function(vector) {
		return new Point(this.x + vector.x, this.y + vector.y);
	}
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
	
	this.normalize = function() {
		var length = this.length();
		this.x /= length;
		this.y /= length;
	}
	
	this.multiply = function(scale) {
		this.x *= scale;
		this.y *= scale;
	}
	
	this.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	this.angle = function(other_vector) {
		dot = this.dot_product(other_vector);
		return acos(dot);
	}
	
	this.dot_product = function(other_vector) {
		return this.x*other_vector.x + this.y*other_vector.y;
	}
	
	this.reverse = function() {
		this.x = -this.x;
		this.y = -this.y;
	}
	
	this.rotate = function(angle) {
		x_prime = this.x*Math.cos(angle*(Math.PI/180.0)) - this.y*Math.sin(angle*(Math.PI/180.0));
		y_prime = this.x*Math.sin(angle*(Math.PI/180.0)) + this.y*Math.cos(angle*(Math.PI/180.0));
		this.x = x_prime;
		this.y = y_prime;
	}
	
	this.to_point = function() {
		return new Point(this.x, this.y);
	}
}
