Leaf.Rectangle = function(width, height, color) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "rect";
	this.width = p_(width || 100);
	this.height = p_(height || 100);
	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, w, h, c;

		cx = rn._2d.context;
		w = an.width.get(t);
		h = an.height.get(t);
		c = an.color.get(t);

		cx.globalAlpha = c[3];
		cx.fillStyle = Leaf.Color.floatArray2Css(c);
		cx.fillRect(w * -0.5, h * -0.5, w, h);
	}
} 

Leaf.Rectangle.prototype = new Leaf.Object2d();
Leaf.Rectangle.prototype.constructor = Leaf.Object2d;