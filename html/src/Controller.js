Leaf.Controller = function(source) {

	var that = this, onEndFunc;

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

	

	this.setInTime = function(inTime) {
		this.inTime = inTime;
		this.outTime = this.inTime + duration;
	}

	this.render = function(time, renderers) {
		var t = time - that.inTime;

		source.render(t, renderers, namedAnimators);	

		if(t >= duration) {
			if(onEndFunc) setTimeout(onEndFunc, 0, that);
		}
	}

	this.onEnd = function(callback) {
		onEndFunc = callback;
	}
}