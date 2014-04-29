Leaf.TimeProvider = function() {

	var NOW = function() {
		return new Date().getTime();
	}

	var that = this,
		currentTime = NOW(), 
		currentTimeScaled = 0,
		accPauseTime = 0;

	this.timeScale = 1;
	this.biDirectional = false;
	this.paused = false;

	// Minimum frame rate is 4 fps. 
	// Below that assume animation (tab) was inactive
	var MAX_FRAME_LENGHT = 1000/4;

	

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

		return currentTimeScaled;
	}
}