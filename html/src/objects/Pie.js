Leaf.Pie = function(color) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "pie";
	this.radius = p_(100);
	this.thickness = p_(20);
	this.startAngle = p_(0);
	this.endAngle = p_(Math.PI * 2);
	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, r, ro, c, sa, ea;

		cx = rn._2d.context;

		r = an.radius.get(t)[0];
		ro = an.thickness.get(t)[0] + r;
		c = an.color.get(t);

		sa = an.startAngle.get(t)[0];
		ea = an.endAngle.get(t)[0];

		var isCw = sa < ea;

		// console.log(isCw, sa, ea);

		cx.globalAlpha = c[3];

		var cssColor = Leaf.Color.floatArray2Css(c);

		cx.fillStyle = cssColor;
		cx.strokeStyle = cssColor;

		cx.beginPath();

		if(isCw) {
			cx.arc(0, 0, r, sa, ea);
			cx.lineTo(Math.cos(ea) * ro, Math.sin(ea) * ro);
			cx.arc(0, 0, ro, ea, sa, true);
			cx.lineTo(Math.cos(sa) * r, Math.sin(sa) * r);
		} else {
			cx.arc(0, 0, r, ea, sa);
			cx.lineTo(Math.cos(sa) * ro, Math.sin(sa) * ro);
			cx.arc(0, 0, ro, sa, ea, true);
			cx.lineTo(Math.cos(ea) * r, Math.sin(ea) * r);
		}

		cx.fill();
	}
} 

Leaf.Pie.prototype = new Leaf.Object2d();
Leaf.Pie.prototype.constructor = Leaf.Object2d;