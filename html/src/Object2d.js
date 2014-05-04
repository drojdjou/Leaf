Leaf.Object2d = function() {

	var that = this;

	this.position = p_(0, 0);
	this.rotation = p_(0);
	this.scale = p_(1, 1);

	this.zIndex = 0;
	this.physicsEnabled = false;

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

Leaf.Object2d.prototype.enablePhysics = function(x, y) {
	this.force = p_(0, 0);
	this.gravity = 0.0;
	this.friction = 1.0;
	this.velocity = [0, 0];
	// Integrated position
	this.position = [x, y];
	this.physicsEnabled = true;
}

Leaf.Object2d.prototype.setupTransform = function(time, renderer, animators) {
	var cx, p, r, s;

	cx = renderer._2d.context;
	p = animators.position.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);

	cx.save();
	cx.translate(p[0], p[1]);
	cx.rotate(r);
	cx.scale(s[0], s[1]);

	this.currentPosition = p;
} 

Leaf.Object2d.prototype.setupTransformPhysics = function(time, renderer, animators) {
	var cx, f, s, r;

	cx = renderer._2d.context;

	f = animators.force.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);

	this.velocity[0] += f[0];
	this.velocity[1] += f[1] + this.gravity;

	this.velocity[0] *= this.friction;
	this.velocity[1] *= this.friction;

	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];

	cx.save();
	cx.translate(this.position[0], this.position[1]);
	cx.rotate(r);
	cx.scale(s[0], s[1]);
} 

Leaf.Object2d.prototype.render = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	this.draw(time, renderer, animators);
} 

Leaf.Object2d.prototype.clearTransform = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	cx.restore();
} 

Leaf.Object2d.prototype.onEnd = function(self) {
}