Leaf.PathCoord = function() {

	var commands = [], that = this;
	this.numSegments = 0;

	this.setPageSize = function(w, h) {
		this.pageWidth = w;
		this.pageHeight = h;
	}

	this.moveTo = function(x, y) {
		commands.push({
			type: 'm', x: x, y: y
		});
	}

	this.curveTo = function(x1, y1, x2, y2, x, y) {
		commands.push({
			type: 'c', x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y
		});

		that.numSegments++;
	}

	this.lineTo = function(x, y) {
		commands.push({
			type: 'l', x: x, y: y
		});

		that.numSegments++
	}

	/**
	 *	Instead of closing the path, let's just draw a line back to the original point - this way we can animate it
	 */
	this.close = function() {
		var b = commands[0];

		commands.push({
			type: 'z', x: b.x, y: b.y
		});

		that.numSegments++
	}

	this.getSegment = function(i) {
		return commands[i];
	}

	this.segments = function() {
		return commands;
	}

	this.mul = function(m) {
		for(var i = 0; i < commands.length; i++) {
			var c = commands[i];
			if(c.x) c.x *= m;
			if(c.y) c.y *= m;
			if(c.x1) c.x1 *= m;
			if(c.y1) c.y1 *= m;
			if(c.x2) c.x2 *= m;
			if(c.y2) c.y2 *= m;
		}
		return this;
	}
}


Leaf.Path = function(color, pathCoords) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "path";
	this.progress = p_(0, 1);
	this.width = p_(1);

	this.color = p_.apply(null, color || [1,1,1,1]);

	// http://stackoverflow.com/questions/878862/drawing-part-of-a-bezier-curve-by-reusing-a-basic-bezier-curve-function
	var u0, u1, qxa, qxb, qxc, qxd, qya, qyb, qyc, qyd, xa, xb, xc, xd, ya, yb, yc, yd;

	var interpolateCurve = function(cx, t0, t1, x1, y1, bx1, by1, bx2, by2, x2, y2) {
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

		if(t0 != 0) cx.moveTo(xa, ya);
		cx.bezierCurveTo(xb, yb, xc, yc, xd, yd);
	}

	var interpolateLine = function(cx, t0, t1, x1, y1, x2, y2) {

		var dx = x2 - x1;
		var dy = y2 - y1;

		if(t0 != 0) cx.moveTo(x1 + dx * t0, y1 + dy * t0);
		cx.lineTo(x1 + dx * t1, y1 + dy * t1);
	}

	this.draw = function(t, rn, an) {
		var i, cx, w, c, s, e, p, ca, cb;

		cx = rn._2d.context;
		w = an.width.get(t);
		c = an.color.get(t);
		p = an.progress.get(t);

		cx.globalAlpha = c[3];
		cx.strokeStyle = Leaf.Color.floatArray2Css(c);
		cx.lineWidth = w;
		cx.lineJoin = 'round';
		cx.lineCap = 'round';

		cx.beginPath();

		var ps =  (p[0] * pathCoords.numSegments);
		var pe =  (p[1] * pathCoords.numSegments);
		var sc = 0;
		var t0, t1, lx, ly;

		for(i = 0; i < pathCoords.segments().length; i++) {
			var s = pathCoords.getSegment(i);

			switch(s.type) {
				case 'm':
					cx.moveTo(s.x, s.y);
					break;
				case 'c':
					if(ps <= sc && pe >= sc+1) {
						cx.bezierCurveTo(s.x1, s.y1, s.x2, s.y2, s.x, s.y);
					} else if((ps >= sc && ps <= sc+1) || (pe >= sc && pe <= sc+1)) {
						var t0 = 0, t1 = 1;
						if(ps >= sc && ps <= sc+1) t0 = ps - sc;
						if(pe >= sc && pe <= sc+1) t1 = pe - sc;
						interpolateCurve(cx, t0, t1, lx, ly, s.x1, s.y1, s.x2, s.y2, s.x, s.y);
					}
					sc++;
					break;
				case 'l':
				case 'z':
					if(ps <= sc && pe >= sc+1) {
						cx.lineTo(s.x, s.y);
					} else if((ps >= sc && ps <= sc+1) || (pe >= sc && pe <= sc+1)) {
						var t0 = 0, t1 = 1;
						if(ps >= sc && ps <= sc+1) t0 = ps - sc;
						if(pe >= sc && pe <= sc+1) t1 = pe - sc;
						interpolateLine(cx, t0, t1, lx, ly, s.x, s.y);
					}

					sc++;
					break;
			}


			lx = s.x;
			ly = s.y;
		}


		cx.stroke();
	}
} 

Leaf.Path.prototype = new Leaf.Object2d();
Leaf.Path.prototype.constructor = Leaf.Object2d;