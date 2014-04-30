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

	this.add = function(inTime, source) {

		var c, t = that.provider.getTime(true) + inTime;

		if(source instanceof Array) {
			var sl = source.length, c;
			for(var i = 0; i < sl; i++) {

				var o;

				if(source[i]._controller && !source[i]._controller._active) o = source[i]._controller;
				else o = new Leaf.Controller(source[i]);
				o.setInTime(t);

				o.onEnd(onChildEnded);
				queue.push(o);
			}
		} else {
		 	var o;

		 	if(source._controller && !source._controller._active) o = source._controller;
		 	else o = new Leaf.Controller(source);
		 	o.setInTime(t);
			o.onEnd(onChildEnded);
			queue.push(o);
		}

		// queue.sort(timeSort); 
		queueSize = queue.length;
	}

	this.render = function() {
		var time = that.provider.getTime();

		if(renderers._2d) {
			var cx = renderers._2d.context;
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



