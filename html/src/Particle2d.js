Leaf.Particle2d = function() {

	var that = this;


	this.force = p_(0, 0);

	this.gravity = 0.2;
	this.friction = 0.97;

	this.velocity = [0, 0];
	this.position = [0, 0];
	this.startPosition = [0, 0];

	this.zIndex = 0;

	var children = [];

	

	this.add = function() {
		var al = arguments.length;

		for(var i = 0; i < al; i++) {
			var c = arguments[i];
			children.push(c);
		}
	}

	this.getChildren = function() {
		return children;
	}
}

Leaf.Particle2d.prototype.setStartPosition = function(x, y) {
	this.startPosition[0] = x;
	this.startPosition[1] = y;
}

Leaf.Particle2d.prototype.setupTransform = function(time, renderer, animators) {
	var cx, f;

	cx = renderer._2d.context;

	f = animators.force.get(time);

	this.velocity[0] += f[0];
	this.velocity[1] += f[1] + this.gravity;

	this.velocity[0] *= this.friction;
	this.velocity[1] *= this.friction;

	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];

	cx.save();
	cx.translate(this.startPosition[0] + this.position[0], this.startPosition[1] + this.position[1]);
} 

Leaf.Particle2d.prototype.render = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	this.draw(time, renderer, animators);
} 

Leaf.Particle2d.prototype.clearTransform = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	cx.restore();
} 

Leaf.Particle2d.prototype.onEnd = function(self) {
}