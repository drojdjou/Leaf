Leaf.Line = function(color) {

	Leaf.Object2d.call(this);

	var that = this;
	var workVec = [0,0];

	this.name = "line";

	this.startPoint = p_(0, 0);
	this.endPoint = p_(0, 0);
	this.progress = p_(0, 1);
	this.width = p_(1);

	this.color = p_.apply(null, color || [1,1,1,1]);

	this.draw = function(t, rn, an) {
		var cx, w, c, s, e, p;

		cx = rn._2d.context;
		w = an.width.get(t);
		c = an.color.get(t);
		s = an.startPoint.get(t);
		e = an.endPoint.get(t);
		p = an.progress.get(t);

		cx.globalAlpha = c[3];
		cx.strokeStyle = Leaf.Color.floatArray2Css(c);
		cx.lineWidth = w;

		cx.beginPath();

		V2.sub(e, s, workVec);
		V2.mul(workVec, p[0]);
		V2.add(s, workVec, workVec);
		cx.moveTo(workVec[0], workVec[1]);

		V2.sub(e, s, workVec);
		V2.mul(workVec, p[1]);
		V2.add(s, workVec, workVec);
		cx.lineTo(workVec[0], workVec[1]);

		cx.stroke();
	}
} 

Leaf.Line.prototype = new Leaf.Object2d();
Leaf.Line.prototype.constructor = Leaf.Object2d;