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