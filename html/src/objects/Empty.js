Leaf.Empty = function() {

	Leaf.Object2d.call(this);

	var that = this;
	var fullCircle = Math.PI * 2;

	this.name = "empty";

	this.draw = function(t, rn, an) {
	}
} 

Leaf.Empty.prototype = new Leaf.Object2d();
Leaf.Empty.prototype.constructor = Leaf.Object2d;