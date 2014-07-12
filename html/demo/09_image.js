var IMG_URL = 'test/sample.jpg';

var image = new Leaf.Image(IMG_URL);
Leaf.Layout.setCenter(image);

var s = (window.innerWidth > 600) ? 2 : 1.2;

var customInterpolation = (function() {

	var s = 0, v = 0;
	var f = Leaf.Ease.oscillate(0, 600);

	document.addEventListener('mousedown', function(e) { 
		s = 1; 
		image.pause(false);
	});

	document.addEventListener('touchstart', function(e) { 
		s = 1; 
		image.pause(false);
	});

	document.addEventListener('mouseup', function(e) { s = 0; });
	document.addEventListener('touchend', function(e) { s = 0; });

	return function(t) {
		if(s > v) v += (s - v) * 0.25;
		else v += (s - v) * 0.01;
		return f(t) * v;
	}

})();

image.scale
	.init(0, 0)
	.to(s, s)
	.in(1000, Leaf.Ease.sineOut)

	.notify(function() {
		image.pause(true);
	})

	.to(0, 0)
	.in(2000, Leaf.Ease.sineIn)
;

image.onEnd =function() {
	leaf.add(100, image);
};

// image.position.by(window.innerWidth * -0.25, 0).in(0);

image.maskRadius = p_(120)
	.by(0).amp(100)
	.in(3000, customInterpolation)
;

image.maskCrease = p_(2)
	.to(0.5)
	.in(1000, Leaf.Ease.sineOut)
	.by(0).amp(0.25)
	.in(3000, customInterpolation)
;

image.maskRotation = p_(0)
	.to(Math.PI)
	.in(1000, Leaf.Ease.sineOut)
	.by(0).amp(Math.PI)
	.in(3000, Leaf.Ease.constant(0.1))
;

image.drawMask = function(t, rn, an) {


	// console.log(t);

	var r = an.maskRadius.get(t);
	var mr = an.maskRotation.get(t);
	var mc = an.maskCrease.get(t);
	var cx = rn._2d.context;

	cx.beginPath();

	// cx.arc(0, 0, r, 0, Math.PI * 2);
	var a = Math.PI / 5;

	for(var i = 0; i < 10; i++) {
		var radius = (i % 2) ? r : r * mc;
		var x = Math.cos(a * i + mr[0]) * radius;
		var y = Math.sin(a * i + mr[0]) * radius;

		(i == 0) ? cx.moveTo(x, y) : cx.lineTo(x, y);
	}

	cx.clip();
}

leaf.add(0, image);







