var IMG_URL = 'test/sample.jpg';

var img = new Image();

img.addEventListener('load', function() {

	document.body.appendChild(img);

	var limg = new Leaf.Element(img);
	Leaf.Layout.setCenter(limg);

	limg.position
		.by(img.width * -0.5, img.height * -0.5)
		.in(0)
		.wait(10000)
	;

	limg.scale
		.init(0, 0)
		.to(1, 1)
		.in(2000, Leaf.Ease.quadOut)
	;

	limg.rotation
		.init(0)
		.to(0.8)
		.in(600, Leaf.Ease.smoothstep)
		.to(-0.8)
		.in(600, Leaf.Ease.smoothstep)
		.to(0)
		.in(800, Leaf.Ease.sineOut)
	;

	leaf.add(0, limg);

});

img.src = IMG_URL;
img.setAttribute('class', 'abs-elem');

