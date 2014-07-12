Leaf.Image = function(imageSource) {

	Leaf.Object2d.call(this);

	var that = this;

	var ready = false, source
	var sourceWidth, sourceHeight;

	if(imageSource instanceof Image) {

		source = imageSource;
		ready = true;
		sourceWidth = source.width;
		sourceHeight = source.height;

	} else {

		var onSourceImage = function(e) {
			ready = true;
			sourceWidth = source.width;
			sourceHeight = source.height;
		}

	 	source = new Image();
		source.addEventListener('load', onSourceImage);
		source.src = imageSource;

	}

	this.draw = function(t, rn, an) {
		var cx, c;

		if(!ready) return;

		cx = rn._2d.context;

		if(that.drawMask) that.drawMask(t, rn, an);

		cx.drawImage(source, sourceWidth * -0.5, sourceHeight * -0.5);

		
	}
}

Leaf.Image.prototype = new Leaf.Object2d();
Leaf.Image.prototype.constructor = Leaf.Object2d;