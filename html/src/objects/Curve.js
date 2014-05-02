Leaf.Curve = function(color) {

	Leaf.Object2d.call(this);

	var that = this;
	var workVec = [0,0];

	this.name = "line";

	this.startPoint = p_(0, 0);
	this.controlPointA = p_(0, 0);
	this.controlPointB = p_(0, 0);
	this.endPoint = p_(0, 0);

	this.progress = p_(0, 1);
	this.width = p_(1);

	this.color = p_.apply(null, color || [1,1,1,1]);

	// http://stackoverflow.com/questions/878862/drawing-part-of-a-bezier-curve-by-reusing-a-basic-bezier-curve-function
	var u0, u1, qxa, qxb, qxc, qxd, qya, qyb, qyc, qyd, xa, xb, xc, xd, ya, yb, yc, yd;

	var interpolate = function(cx, t0, t1, x1, y1, bx1, by1, bx2, by2, x2, y2) {
		u0 = 1.0 - t0;
		u1 = 1.0 - t1;

		qxa =  x1*u0*u0 + bx1*2*t0*u0 + bx2*t0*t0;
		qxb =  x1*u1*u1 + bx1*2*t1*u1 + bx2*t1*t1;
		qxc = bx1*u0*u0 + bx2*2*t0*u0 +  x2*t0*t0;
		qxd = bx1*u1*u1 + bx2*2*t1*u1 +  x2*t1*t1;

		qya =  y1*u0*u0 + by1*2*t0*u0 + by2*t0*t0;
		qyb =  y1*u1*u1 + by1*2*t1*u1 + by2*t1*t1;
		qyc = by1*u0*u0 + by2*2*t0*u0 +  y2*t0*t0;
		qyd = by1*u1*u1 + by2*2*t1*u1 +  y2*t1*t1;

		xa = qxa*u0 + qxc*t0;
		xb = qxa*u1 + qxc*t1;
		xc = qxb*u0 + qxd*t0;
		xd = qxb*u1 + qxd*t1;

		ya = qya*u0 + qyc*t0;
		yb = qya*u1 + qyc*t1;
		yc = qyb*u0 + qyd*t0;
		yd = qyb*u1 + qyd*t1;

		cx.moveTo(xa, ya);
		cx.bezierCurveTo(xb, yb, xc, yc, xd, yd);
	}

	this.draw = function(t, rn, an) {
		var cx, w, c, s, e, p, ca, cb;

		cx = rn._2d.context;
		w = an.width.get(t);
		c = an.color.get(t);
		s = an.startPoint.get(t);
		ca = an.controlPointA.get(t);
		cb = an.controlPointB.get(t);
		e = an.endPoint.get(t);
		p = an.progress.get(t);

		cx.globalAlpha = c[3];
		cx.strokeStyle = Leaf.Color.floatArray2Css(c);
		cx.lineWidth = w;
		cx.lineJoin = 'round';

		cx.beginPath();

		if(p[0] == 0 && p[1] == 1) {
			cx.moveTo(s[0], s[1]);
			cx.bezierCurveTo(ca[0], ca[1], cb[0], cb[1], e[0], e[1]);
		} else {
			interpolate(cx, p[0], p[1], s[0], s[1], ca[0], ca[1], cb[0], cb[1], e[0], e[1]);
		}

		

		cx.stroke();
	}
} 

Leaf.Curve.prototype = new Leaf.Object2d();
Leaf.Curve.prototype.constructor = Leaf.Object2d;