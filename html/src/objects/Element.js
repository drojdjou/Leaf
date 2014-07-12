Leaf.Element = function(source) {

	var that = this;

	this.position = p_(0, 0);
	this.rotation = p_(0);
	this.scale = p_(1, 1);
	this.alpha = p_(1);

	this.physicsEnabled = false;

	this.applyTransform = function(tx, ty, r, sx, sy, a) {
		source.style.opacity = a;
		var t = 'translate3d(' + tx + 'px,' + ty + 'px, 0px) scale(' + sx + ',' + sy + ') rotate(' + r + 'rad)';
		source.style.webkitTransform = t;
	}

	this.getChildren = function() {
		return [];
	}

}

Leaf.Element.prototype.enablePhysics = function(x, y) {
	this.force = p_(0, 0);
	this.gravity = 0.0;
	this.friction = 1.0;
	this.velocity = [0, 0];
	// Replace position property with integrated position ans simple array
	this.position = [x, y];
	this.physicsEnabled = true;
}

Leaf.Element.prototype.setupTransform = function(time, renderer, animators) {
	var p, r, s, a;

	p = animators.position.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);
	a = animators.alpha.get(time);

	this.applyTransform(p[0], p[1], r, s[0], s[1], a);
} 

Leaf.Element.prototype.setupTransformPhysics = function(time, renderer, animators) {
	var f, s, r;

	f = animators.force.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);
	a = animators.alpha.get(time);

	this.velocity[0] += f[0];
	this.velocity[1] += f[1] + this.gravity;

	this.velocity[0] *= this.friction;
	this.velocity[1] *= this.friction;

	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];

	this.applyTransform(this.position[0], this.position[1], r, s[0], s[1], a);
} 

Leaf.Element.prototype.render = function(time, renderer, animators) {
} 

Leaf.Element.prototype.clearTransform = function(time, renderer, animators) {
} 

Leaf.Element.prototype.pause = function(doPause) {
	if(this._controller) {
		this._controller.paused = doPause;
	}
}

Leaf.Element.prototype.onEnd = function(self) {
}


















