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










