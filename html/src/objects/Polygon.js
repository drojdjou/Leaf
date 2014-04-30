Leaf.Polygon = function(numSegments, color) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "poly";

	for(var i = 1; i <= numSegments; i++) {
		this['p' + i] = p_(0, 0);
	}

	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, c, p;

		cx = rn._2d.context;
		c = an.color.get(t);

		cx.globalAlpha = c[3];
		cx.fillStyle = Leaf.Color.floatArray2Css(c);

		cx.beginPath();

		for(var i = 1; i <= numSegments; i++) {
			p = an['p' + i].get(t);
			(i == 0) ? cx.moveTo(p[0], p[1]) : cx.lineTo(p[0], p[1]);
		}

		cx.fill();
	}
} 

Leaf.Polygon.prototype = new Leaf.Object2d();
Leaf.Polygon.prototype.constructor = Leaf.Object2d;