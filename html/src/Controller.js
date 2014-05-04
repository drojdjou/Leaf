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
	}

	var _render = function(time, renderers) {

		var t = time - that.inTime;

		if(source.physicsEnabled) source.setupTransformPhysics(t, renderers, namedAnimators);	
		else source.setupTransform(t, renderers, namedAnimators);	

		source.render(t, renderers, namedAnimators);

		for(var i = 0; i < numChildren; i++) {
			children[i].render(time, renderers);
		}

		source.clearTransform(t, renderers, namedAnimators);	
	}

	this.render = function(time, renderers) {
		var t = time - that.inTime;

		_render(time, renderers);

		if(t >= duration){
			if(onEndFunc) setTimeout(onEndFunc, 0, that);
		}
	}

	this.onEnd = function(callback) {
		onEndFunc = callback;
	}
}