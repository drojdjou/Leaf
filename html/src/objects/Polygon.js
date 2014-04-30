Leaf.Polygon = function(color) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "poly";

	this.p1 = p_(0, 0);
	this.p2 = p_(0, 0);
	this.p3 = p_(0, 0);

	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, c, p;

		cx = rn._2d.context;
		c = an.color.get(t);

		cx.globalAlpha = c[3];
		cx.fillStyle = Leaf.Color.floatArray2Css(c);

		cx.beginPath();

		p = an.p1.get(t);
		cx.moveTo(p[0], p[1]);

		p = an.p2.get(t);
		cx.lineTo(p[0], p[1]);

		p = an.p3.get(t);
		cx.lineTo(p[0], p[1]);

		p = an.p4.get(t);
		cx.lineTo(p[0], p[1]);
		
		cx.fill();
	}
} 

Leaf.Polygon.prototype = new Leaf.Object2d();
Leaf.Polygon.prototype.constructor = Leaf.Object2d;