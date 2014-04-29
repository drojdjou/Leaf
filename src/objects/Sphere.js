Leaf.Sphere = function(color) {

	Leaf.Object2d.call(this);

	var that = this;
	var fullCircle = Math.PI * 2;

	this.stroke = false;
	this.dash = false;
	this.strokeSize = p_(1);

	this.name = "sphere";
	this.radius = p_(100);
	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, r, c, sw;

		cx = rn._2d.context;
		r = an.radius.get(t);
		c = an.color.get(t);

		sw = an.strokeSize.get(t)[0];
		
		if(that.dash) {
			var circ = 2 * Math.PI * r;
			var d = circ / that.dash;
			cx.setLineDash([d]);
		}

		cx.globalAlpha = c[3];
		cx.lineWidth = sw;

		if(that.stroke) cx.strokeStyle = Leaf.Color.floatArray2Css(c);
		else cx.fillStyle = Leaf.Color.floatArray2Css(c);

		cx.beginPath();
		cx.arc(0, 0, r, 0, fullCircle);
		
		if(that.stroke) cx.stroke();
		else cx.fill();
	}
} 

Leaf.Sphere.prototype = new Leaf.Object2d();
Leaf.Sphere.prototype.constructor = Leaf.Object2d;