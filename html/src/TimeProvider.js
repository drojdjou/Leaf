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