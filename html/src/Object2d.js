Leaf.Object2d = function() {
	this.position = p_(0, 0);
	this.rotation = p_(0);
	this.scale = p_(1, 1);

	this.zIndex = 0;
}

Leaf.Object2d.prototype.render = function(time, renderer, animators) {
	var cx, p, r, s;

	cx = renderer._2d.context;
	p = animators.position.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);

	cx.save();
	cx.translate(p[0], p[1]);
	cx.rotate(r);
	cx.scale(s[0], s[1]);
	
	this.draw(time, renderer, animators);

	cx.restore();
} 

Leaf.Object2d.prototype.onEnd = function(self) {
}