/* --- --- [Leaf] --- --- */

var Leaf = function(provider) {

	var that = this;

	
	this.provider = provider || new Leaf.TimeProvider();

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = (function() {
        return  window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

	var queue = [], queueSize = 0, activeChildren = [];

	var renderers = {}; // 2d, 3d, svg, css

	var timeSort = function(a, b) {
		return a.inTime - b.inTime;
	}

	var zSort = function(a, b) {
		return a.source.zIndex - b.source.zIndex;
	}

	var onChildEnded = function(o) {
		o._active = false;
		o.source.onEnd(o);

		activeChildren.splice(activeChildren.indexOf(o), 1);

		if(!that.provider.biDirectional) {
			queue.splice(queue.indexOf(o), 1);
			queueSize = queue.length;
		}
	}

	this.setCanvas2d = function(canvas) {
		renderers._2d = {
			canvas: canvas,
			context: canvas.getContext('2d'),
			width: canvas.width,
			height: canvas.height
		};
	}

	var addController = function(time, source, parent) {
		var o;

		if(source._controller) {
			o = source._controller;
		} else {
	 		o = new Leaf.Controller(source);
		}

		var nc = source.getChildren().length;

		for(var i = 0; i < nc; i++) {
			var co = source.getChildren()[i];
			addController(time, co, o);
		}

		o.setInTime(time);
		if(!parent) o.onEnd(onChildEnded);

		if(parent) { 
			parent.add(o); 
		} else {
			queue.push(o);
		}
	}

	this.add = function(inTime, source) {

		var c, t = that.provider.getTime(true) + inTime;

		if(source instanceof Array) {
			var sl = source.length, c;
			for(var i = 0; i < sl; i++) {
				addController(t, source[i], null);
			}
		} else {
		 	addController(t, source, null);
		}

		// queue.sort(timeSort); 
		queueSize = queue.length;
	}

	this.remove = function(source) {
		var c = source._controller;

		var qi = queue.indexOf(c)
		var ai = activeChildren.indexOf(c);

		if(ai > -1) activeChildren.splice(ai, 1);
		if(qi > -1) queue.splice(qi, 1);

		return qi > -1;
	}

	this.render = function() {
		var time = that.provider.getTime();

		if(renderers._2d) {
			var cx = renderers._2d.context;
			cx.setTransform(1,0,0,1,0,0);
			cx.globalCompositeOperation = 'source-over';
			cx.globalAlpha = 1;
			cx.fillStyle = 'rgb(0, 0, 0)';
			cx.fillRect(0, 0, window.innerWidth, window.innerHeight);
		}


		for(var i = 0; i < queue.length; i++) {
			var o = queue[i];

			if(
				o.inTime <= time && 
				o.outTime > time && 
				activeChildren.indexOf(o) == -1
			){	
				activeChildren.push(o);
				o._active = true;
			}
		}

		activeChildren.sort(zSort);	

		var numActiveChildren = activeChildren.length;

		for(var i = 0; i < numActiveChildren; i++) {
			activeChildren[i].render(time, renderers);
		}

		// if(numActiveChildren == 0) console.log("Empty!");
	}

	this.logQueue = function() {
		console.log(queue);
	}
}





/* --- --- [Version] --- --- */

/** DO NOT EDIT. Updated from version.json **/
Leaf.Version = {"version":"0.1","build":1,"date":"2014-05-09T17:04:25.407Z"}

/* --- --- [Animator] --- --- */

Leaf.Animator = function(steps) {

	var that = this;
	var MAX_FRAME_DURATION = 100; // i.e. 10FPS

	var i, j;
	var numSteps = steps.length - 1;
	var lastIndex = 0;

	var multi = steps[0].value instanceof Array;

	if(multi) {
		var result = [];
		var resultSize = steps[0].value.length;
	} else {
		var result;
	}

	var lerpFunc = function(a, b, t) {
		return a + (b - a) * t;
	};

	var ct = 0;

	var lastT = 0;

	this.get = function(t) {

		delta = t - lastT;
		if(delta > MAX_FRAME_DURATION) delta = 0;

		if(numSteps == 0) return steps[0].value;

		var inTime = 0, outTime = steps[0].time;

		var found = false;

		for(i = 0; i < numSteps; i++) {
			var s1 = steps[i];
			var s2 = steps[i+1];

			inTime += s1.time;
			outTime += s2.time;

			if(t >= inTime && t < outTime) {

				var nt = (t - inTime) / (outTime - inTime);
				
				if(nt < 0) nt = 0;
				if(nt > 1) nt = 1;

				if(s2.ease) nt = s2.ease(nt);
				else if(s1.ease) nt = s1.ease(nt);

				if(multi) {
					for(j = 0; j < resultSize; j++) {
						result[j] = lerpFunc(s1.value[j], s2.value[j], nt);
						if(s2.amplitude) result[j] += s2.amplitude[j] * nt;
					}
				} else {
					result = lerpFunc(s1.value, s2.value, nt);
					if(s2.amplitude) result += s2.amplitude * nt;
				}

				// console.log(t + delta, outTime);

				if(s2.notify && t >= outTime - delta) {
					console.log("notify >", t + delta, outTime);
					s2.notify();
				}

				lastIndex = i;
				found = true;
				break;
			}
		}

		lastT = t;

		if(!found) return steps[numSteps].value;
		else return result;
	}
}












/* --- --- [Color] --- --- */

Leaf.Color = {

	array2Css: function(a) {
		return (a.length == 3) ? 
			 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')' : 
			'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + a[3] + ')';
	},

	floatArray2Css: function(a) {
		var f2i = Leaf.Color.f2i;
		return (a.length == 3) ? 
			 'rgb(' + f2i(a[0]) + ',' + f2i(a[1]) + ',' + f2i(a[2]) + ')' : 
			'rgba(' + f2i(a[0]) + ',' + f2i(a[1]) + ',' + f2i(a[2]) + ',' + f2i(a[3]) + ')';
	},

	f2i: function(f) {
		return Math.round(f * 255);
	},

	grey: function(v, a) {
		return [v, v, v, (a == null) ? 1 : a];
	}
}

/* --- --- [Controller] --- --- */

Leaf.Controller = function(source) {

	var that = this, onEndFunc;
	var uid = (Math.random() * 1000) | 0;

	// console.log("make", source.name, uid);

	source._controller = this;

	this.source = source;
	
	var namedAnimators = {};
	var duration = 0;

	for(var n in source) {
		var p = source[n];

		if(!(p instanceof Leaf.Prop)) continue;

		var a = new Leaf.Animator(p.getSteps());
		duration = Math.max(duration, p.getDuration());
		namedAnimators[n] = a;
	}

	var children = [], numChildren = 0;

	this.add = function() {
		var al = arguments.length;

		for(var i = 0; i < al; i++) {
			var c = arguments[i];

			// If child already added - move on
			if(children.indexOf(c) > -1) break;
			children.push(c);
			duration = Math.max(duration, c.getDuration());
		}

		numChildren = children.length;
	}

	this.getDuration = function() {
		return duration;
	}

	this.setInTime = function(inTime) {
		that.inTime = inTime;
		that.outTime = that.inTime + duration;
		that.accPauseTime = 0;
		that.paused = false;
		lastTime = 0;
	}

	var lastTime = 0;

	this.render = function(time, renderers) {
		if(that.paused) {
			if(!lastTime) lastTime = time;
			that.accPauseTime += time - lastTime;
			lastTime = time;
		}

		var t = time - (that.inTime + that.accPauseTime);

		if(source.physicsEnabled) source.setupTransformPhysics(t, renderers, namedAnimators);	
		else source.setupTransform(t, renderers, namedAnimators);	

		source.render(t, renderers, namedAnimators);

		for(var i = 0; i < numChildren; i++) {
			children[i].render(time, renderers);
		}

		source.clearTransform(t, renderers, namedAnimators);	

		if(t >= duration){
			if(onEndFunc) setTimeout(onEndFunc, 0, that);
		}
	}

	this.onEnd = function(callback) {
		onEndFunc = callback;
	}
}

/* --- --- [Interpolation] --- --- */

Leaf.Ease = {
	linear: function(t) { return t; },

	smoothstep: function(t) { return t * t * (3 - 2 * t); },

    quadIn: function (t) {
        return t * t;
    },

    quadOut: function (t) {
        return t * (2 - t);
    },

	quadInOut: function (t) {
        if (( t *= 2 ) < 1)
            return 0.5 * t * t;
        else
            return -0.5 * ( --t * ( t - 2 ) - 1 );
    },

    sineIn: function ( t ) {
        return 1 - Math.cos( t * Math.PI / 2 );
    },

    sineOut: function ( t ) {
        return Math.sin( t * Math.PI / 2 );
    },

    sineInOut: function ( t ) {
        return 0.5 * ( 1 - Math.cos( Math.PI * t ) );
    },

    /**
     *  f = frequency, how many times to oscillate?
     *  if(f == 0) d = duration of single oscillation phase (in ms)
     *  ease = additional easing function to wrap it into
     */ 
    oscillate: function(f, d, ease) {
        if(f != 0) {
            var ft = 1 / f;
            d = d || 1;
            return function(t) {
                var te = (ease) ? ease(t) : t;
                var p = (te / ft) % 1;
                return Math.sin(p * Math.PI * 2) * d;
            }
        } else {
            return function(t) {
                var p = (new Date().getTime() % d) / d;
                return Math.sin(p * Math.PI * 2);
            }
        }
    },

    combine: function(e1, e2) {
        return function(t) {
            var c = e1(t) + e2(t);
            return c;
        }
    },

    noise: function(i, ease) {
        return function(t) {
            var n = Math.random() * i;
            return (ease) ? ease(t) * n : n;
        }
    },

    constant: function(a) {
        var now, delta, last = new Date().getTime();
        var c = 0
        return function(t) {
            now = new Date().getTime();
            delta = now - last;
            last = now;
            c += a / delta;
            return c;
        }
    }
}


// 0.6

/* --- --- [Layout] --- --- */

Leaf.Layout = new (function() {

	var that = this;

	this.centerX = function() {
		return window.innerWidth * 0.5;
	}

	this.centerY = function() {
		return window.innerHeight * 0.5;
	}

	this.setCenter = function(o) {
	    o.position.init(that.centerX(), that.centerY());
	}

	this.setAtPercent= function(o, x, y) {
	    o.position.init(that.wp(x), that.hp(y));
	}

	this.wp = function(p) {
		return p / 100 * window.innerWidth;
	}

	this.hp = function(p) {
		return p / 100 * window.innerHeight;
	}

	this.widthPercent = function(p) {
		return p / 100 * window.innerWidth;
	}

	this.heightPercent = function(p) {
		return p / 100 * window.innerHeight;
	}

	this.bestPercent = function(p) {
		return (window.innerWidth > window.innerHeight) ? that.heightPercent(p) : that.widthPercent(p);
	}

})();

/* --- --- [Loader] --- --- */

Leaf.Loader = {

	loadText: function(path, onLoadedFunc){

		var request = new XMLHttpRequest();
		request.open("GET", path);

		request.onreadystatechange = function(){
			if (request.readyState == 4) {
				onLoadedFunc.call(null, request.responseText);
			}
		};

		request.send();
	},

	loadJSON: function(path, onLoadedFunc){
		Leaf.Loader.loadText(path, function(text) {
			onLoadedFunc(JSON.parse(text));
		});
	},

	loadSVG: function(path, onLoadedFunc) {
		Leaf.Loader.loadText(path, function(text) {
			var svg = document.createElement('svg');
    		svg.innerHTML = text;
    		onLoadedFunc(svg);
		});
	},

	loadImage:function(src, callback){
		var img = new Image();
		img.onload = callback(img);
		img.src = src;
	}
};

/* --- --- [Object2d] --- --- */

Leaf.Object2d = function() {

	var that = this;

	this.position = p_(0, 0);
	this.rotation = p_(0);
	this.scale = p_(1, 1);
	this.alpha = p_(1);

	this.zIndex = 0;
	this.physicsEnabled = false;

	var children = [];

	this.add = function() {
		var al = arguments.length;

		for(var i = 0; i < al; i++) {
			var c = arguments[i];
			children.push(c);
		}
	}

	this.getChildren = function() {
		return children;
	}
}

Leaf.Object2d.prototype.enablePhysics = function(x, y) {
	this.force = p_(0, 0);
	this.gravity = 0.0;
	this.friction = 1.0;
	this.velocity = [0, 0];
	// Replace position property with integrated position ans simple array
	this.position = [x, y];
	this.physicsEnabled = true;
}

Leaf.Object2d.prototype.setupTransform = function(time, renderer, animators) {
	var cx, p, r, s, a;

	cx = renderer._2d.context;
	p = animators.position.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);
	a = animators.alpha.get(time);

	cx.save();
	cx.translate(p[0], p[1]);
	cx.rotate(r);
	cx.scale(s[0], s[1]);

	cx.globalAlpha = a;

	this.currentPosition = p;
} 

Leaf.Object2d.prototype.setupTransformPhysics = function(time, renderer, animators) {
	var cx, f, s, r;

	cx = renderer._2d.context;

	f = animators.force.get(time);
	r = animators.rotation.get(time);
	s = animators.scale.get(time);

	this.velocity[0] += f[0];
	this.velocity[1] += f[1] + this.gravity;

	this.velocity[0] *= this.friction;
	this.velocity[1] *= this.friction;

	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];


	cx.save();
	cx.translate(this.position[0], this.position[1]);
	cx.rotate(r);
	cx.scale(s[0], s[1]);

} 

Leaf.Object2d.prototype.render = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	this.draw(time, renderer, animators);
} 

Leaf.Object2d.prototype.clearTransform = function(time, renderer, animators) {
	var cx = renderer._2d.context;
	cx.restore();
} 

Leaf.Object2d.prototype.pause = function(doPause) {
	if(this._controller) {
		this._controller.paused = doPause;
	}
}

Leaf.Object2d.prototype.onEnd = function(self) {
}




















/* --- --- [Prop] --- --- */

Leaf.Prop = function(v) {

	var that = this;
	var steps = [{ time: 0, value: v }], numSteps = 0, lastBlock = 0;

	var total = 0;

	this.init = function() {
		var v = (arguments[0] instanceof Array) ? arguments[0] : Array.prototype.slice.call(arguments);
		steps[0].value = v;
		return this;
	}

	this.getSteps = function() {
		return steps;
	}

	this.to = function() {
		var v = (arguments[0] instanceof Array) ? arguments[0] : Array.prototype.slice.call(arguments);
		steps.push({ value: v });
		numSteps = steps.length - 1;
		return this;
	}

	this.by = function() {
		var v = (arguments[0] instanceof Array) ? arguments[0] : Array.prototype.slice.call(arguments);

		var p = steps[steps.length-1].value;

		for(var i = 0; i < v.length; i++) {
			v[i] += p[i];
		}

		steps.push({ value: v });
		numSteps = steps.length - 1;
		return this;
	}

	this.amp = function() {
		var v = (arguments[0] instanceof Array) ? arguments[0] : Array.prototype.slice.call(arguments);
		var s = steps[steps.length - 1];
		s.amplitude = v;
		return this;
	}

	this.wait = function(t) {
		total += t;
		steps.push({ time: t, value: steps[steps.length-1].value });
		numSteps = steps.length - 1;
		return this;
	}

	this.in = function(t, ease) {
		total += t;
		var s = steps[steps.length - 1];
		s.time = t;
		s.ease = ease || Leaf.Ease.linear;
		return this;
	}

	this.notify = function(f, args) {
		var s = steps[steps.length - 1];
		s.notify = f;
		s.notifArgs = args;
		return this;
	}

	this.beginBlock = function() {
		lastBlock = numSteps;
		return this;
	}

	this.repeatBlock = function(n) {

		for(var i = 0; i < n-1; i++) {
			for(j = lastBlock; j <= numSteps; j++) {
				total += steps[j].time;
				steps.push(steps[j]);
			}
		}

		numSteps = steps.length - 1;
		lastBlock = 0;

		return this;
	}

	this.getDuration = function() {
		return total;
	}
}

var p_ = function() {
	var v = Array.prototype.slice.call(arguments);
	return new Leaf.Prop(v);
}












/* --- --- [SVG] --- --- */

Leaf.SVG = function(source) {

	var svgRoot = source.querySelector('svg');

	this.width = parseInt(svgRoot.getAttribute('width'));
	this.height = parseInt(svgRoot.getAttribute('height'));

	this.extractPaths = function(normalize) {

		var pathDecs = source.querySelectorAll('path');
		var paths = [];
		

		for(var pi = 0; pi < pathDecs.length; pi++) {
			var coord = new Leaf.PathCoord();
			var segList = pathDecs[pi].pathSegList;

			var x = 0, y = 0;

			for (var i = 0, len = segList.numberOfItems; i < len; i++) {
		        var p = segList.getItem(i);

		        switch(p.pathSegTypeAsLetter) {
		            case "m": 
		                x += p.x;
		                y += p.y;
		                coord.moveTo(x, y);
		                break;
		            case "M": 
		                x = p.x;
		                y = p.y;
		                coord.moveTo(x, y);
		                break;
		            case "l":
		            	if(p.x != 0 && p.y != 0) {
		            		x += p.x;
			                y += p.y;
			                coord.lineTo(x, y);
		            	}
		            	break;
		            case "L":
		            	x = p.x;
		                y = p.y;
		                coord.lineTo(p.x, p.y);
		            	break;
		            case "z":
		            case "Z":
		            	coord.close();
		            	break;
		            case "c": 
		                var x1 = x + p.x1;
		                var y1 = y + p.y1;
		                var x2 = x + p.x2;
		                var y2 = y + p.y2;
		                x += p.x;
		                y += p.y;
		                coord.curveTo(x1, y1, x2, y2, x, y);
		                break;
		            case "C": 
		            	x = p.x;
		                y = p.y;
		                coord.curveTo(p.x1, p.y1, p.x2, p.y2, p.x, p.y);
		                break;
		            case "s":
		            	var l = coord.getLastSegment();
		            	var x1 = l.x - (l.x1 - l.x);
		            	var y1 = l.y - (l.y1 - l.y);
		            	var x2 = x + p.x2;
		                var y2 = y + p.y2;
		                x += p.x;
		                y += p.y;
		            	coord.curveTo(x1, y1, x2, y2, x, y);
		            	break;
		            case "S":
		            	var l = coord.getLastSegment();
		            	var x1 = l.x - (l.x1 - l.x);
		            	var y1 = l.y - (l.y1 - l.y);
		                x += p.x;
		                y += p.y;
		            	coord.curveTo(p.x1, p.y1, p.x2, p.y2, p.x, p.y);
		            	break;
		        }
		    }

			paths.push(coord);
		}

		return paths;
	}

};

/* --- --- [TimeProvider] --- --- */

Leaf.TimeProvider = function() {

	var NOW = function() {
		return new Date().getTime();
	}

	var that = this,
		currentTime = NOW(), 
		currentTimeScaled = 0,
		accPauseTime = 0;

	// Millisecond per beat
	var mpb = 0, beatCount = 0, beatCallback;

	this.timeScale = 1;
	this.biDirectional = false;
	this.paused = false;

	// Minimum frame rate is 4 fps. 
	// Below that assume animation (tab) was inactive
	var MAX_FRAME_LENGHT = 1000/4;

	this.setBPM = function(bpm, callback) {
		mpb = 60000 / bpm;
		beatCallback = callback;
		beatCount = 0;
	}

	this.reset = function() {
		currentTime = NOW();
		currentTimeScaled = 0;
		accPauseTime = 0;
	}

	this.getTime = function(registration) {
		// Calculate delta
		var deltaTime = (NOW() - currentTime);

		// Check if time provider is paused manually 
		// or the window was inactive for a while (i.e. very big delta)
		var ip = that.paused || deltaTime > MAX_FRAME_LENGHT;

		// Move time forward only if not paused
		if(ip) accPauseTime += deltaTime;

		currentTime = NOW();
		if(!ip) currentTimeScaled += deltaTime * that.timeScale;

		if(mpb && !registration) {
			var b = currentTimeScaled / mpb;
			var bi = parseInt(b | 0);

			if(bi > beatCount) {
				beatCallback(beatCount, (b - bi) * -1);
				beatCount = bi;
			}
		}

		return currentTimeScaled;
	}
}

/* --- --- [Util] --- --- */

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/* --- --- [Vector2] --- --- */

V2 = {};

V2.add = function(a, b, result) {
	result = result || a;
	result[0] = a[0] + b[0];
	result[1] = a[1] + b[1];
	return result;
}

V2.sub = function(a, b, result) {
	result = result || a;
	result[0] = a[0] - b[0];
	result[1] = a[1] - b[1];
	return result;
}

V2.mul = function(a, m, result) {
	result = result || a;
	result[0] = a[0] * m;
	result[1] = a[1] * m;
	return result;
}

V2.neg = function(a, result) {
	result = result || a;
	result[0] = a[0] * -1;
	result[1] = a[1] * -1;
	return result;
}

V2.norm = function(a, result) {
	result = result || a;

	var m = V2.mag(a);
    if(m == 0) return a;
	result[0] = a[0] / m;
	result[1] = a[1] / m;

	return result;
}

V2.magSq = function(a) {
	return a[0] * a[0] + a[1] * a[1];
}

V2.mag = function(a) {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

V2.dot = function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

V2.distance = function(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
}

V2.distanceSqrt = function(a, b) {
    return (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]);
}

/* --- --- [objects/Curve] --- --- */

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

/* --- --- [objects/Element] --- --- */

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




















/* --- --- [objects/Empty] --- --- */

Leaf.Empty = function() {

	Leaf.Object2d.call(this);

	var that = this;
	var fullCircle = Math.PI * 2;

	this.name = "empty";

	this.draw = function(t, rn, an) {
	}
} 

Leaf.Empty.prototype = new Leaf.Object2d();
Leaf.Empty.prototype.constructor = Leaf.Object2d;

/* --- --- [objects/Image] --- --- */

Leaf.Image = function(imageSource) {

	Leaf.Object2d.call(this);

	var that = this;

	var ready = false, source
	var sourceWidth, sourceHeight;

	if(imageSource instanceof Image) {

		source = imageSource;
		ready = true;
		sourceWidth = source.width;
		sourceHeight = source.height;

	} else {

		var onSourceImage = function(e) {
			ready = true;
			sourceWidth = source.width;
			sourceHeight = source.height;
		}

	 	source = new Image();
		source.addEventListener('load', onSourceImage);
		source.src = imageSource;

	}

	this.draw = function(t, rn, an) {
		var cx, c;

		if(!ready) return;

		cx = rn._2d.context;

		if(that.drawMask) that.drawMask(t, rn, an);

		cx.drawImage(source, sourceWidth * -0.5, sourceHeight * -0.5);

		
	}
}

Leaf.Image.prototype = new Leaf.Object2d();
Leaf.Image.prototype.constructor = Leaf.Object2d;

/* --- --- [objects/Line] --- --- */

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

/* --- --- [objects/Path] --- --- */

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
	 *	Instead of closing the path, let's just draw a line back to the first point - this way we can animate it
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

	this.getLastSegment = function() {
		return commands[commands.length-1];
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

/* --- --- [objects/Pie] --- --- */

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

/* --- --- [objects/Polygon] --- --- */

Leaf.Polygon = function(numSegments, color) {

	Leaf.Object2d.call(this);

	var that = this;

	this.name = "poly";
	this.mask = false;

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

/* --- --- [objects/Rectangle] --- --- */

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

/* --- --- [objects/Sphere] --- --- */

Leaf.Sphere = function(color) {

	Leaf.Object2d.call(this);

	var that = this;
	var fullCircle = Math.PI * 2;

	this.stroke = false;
	this.dash = false;
	this.strokeSize = p_(1);
	this.mask = false;

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

