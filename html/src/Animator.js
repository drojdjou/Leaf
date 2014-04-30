Leaf.Animator = function(steps) {

	var that = this;

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

	this.get = function(t) {

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

				if(s1.ease) nt = s1.ease(nt);
				else if(s2.ease) nt = s2.ease(nt);

				if(multi) {
					for(j = 0; j < resultSize; j++) {
						result[j] = lerpFunc(s1.value[j], s2.value[j], nt);
					}
				} else {
					result = lerpFunc(s1.value, s2.value, nt);
				}

				if(s2.notify && i > lastIndex) {
					s2.notify(this, s2.notifArgs);
					s2.notified = true;
				}

				lastIndex = i;
				found = true;
				break;
			}
		}

		if(!found) return steps[numSteps].value;
		else return result;
	}
}










