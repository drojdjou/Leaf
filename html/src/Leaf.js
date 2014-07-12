var Leaf = function(provider) {

	var that = this;

	
	this.provider = provider || new Leaf.TimeProvider();

	window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
        	window.webkitRequestAnimationFrame ||
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

			cx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			cx.fillStyle = 'rgba(0, 0, 0, 0)';
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



