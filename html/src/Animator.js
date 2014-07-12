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










