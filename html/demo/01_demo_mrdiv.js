
leaf.provider.biDirectional = true;

var wrapCircle = new Leaf.Sphere(Leaf.Color.grey(1));
wrapCircle.name = "wrapCircle";
Leaf.Layout.setCenter(wrapCircle);
wrapCircle.scale
	.to(0,0).in(300, Leaf.Ease.quadIn)
	.wait(1600)
	.to(1,1).in(300, Leaf.Ease.quadOut)
;

var dashRing = new Leaf.Sphere(Leaf.Color.grey(1));
dashRing.name = "dashRing";
Leaf.Layout.setCenter(dashRing);
dashRing.stroke = true;
dashRing.dash = 64;

dashRing.rotation
	.init(0)
	.wait(0)
	.to(Math.PI * -0.1).in(500, Leaf.Ease.quadOut)
;

dashRing.strokeSize
	.init(1)
	.to(50).in(200, Leaf.Ease.quadIn)
	.to(10).in(200, Leaf.Ease.linear)
	.to(0).in(100, Leaf.Ease.quadOut)
;

dashRing.radius
	.init(120)
	.to(200).in(500, Leaf.Ease.quadOut)
;

var ring = new Leaf.Sphere(Leaf.Color.grey(1));
ring.name = "ring";
Leaf.Layout.setCenter(ring);
ring.stroke = true;

ring.radius
	.init(100)
	.to(140).in(400, Leaf.Ease.quadOut)
	.to(100).in(400, Leaf.Ease.quadIn)
	.to(0).in(600, Leaf.Ease.quadOut)
;

ring.strokeSize
	.init(1)
	.to(80).in(400, Leaf.Ease.quadOut)
	.to(1).in(400, Leaf.Ease.quadIn)
;


var ring2 = new Leaf.Sphere(Leaf.Color.grey(1));
ring2.name = "ring2";
Leaf.Layout.setCenter(ring2);
ring2.stroke = true;

ring2.radius
	.init(90)
	.to(55).in(400, Leaf.Ease.linear)
	.to(0).in(200, Leaf.Ease.quadOut)
;

ring2.strokeSize
	.init(1)
	.to(70).in(400, Leaf.Ease.quadIn)
	.to(0).in(200, Leaf.Ease.linear)
;

var starSlices = [];
var fifth = Math.PI * 2 / 5;
var midFifth = fifth / 2;
var offset = 0.02;
var starGrow = 400;
var starFade = 600;

for(var i = 0; i < 5; i++) {
	var s = new Leaf.Pie(Leaf.Color.grey(1));
	s.name = "pie" + i;
	Leaf.Layout.setCenter(s);

	s.thickness
		.init(1)
		.to(100)
		.in(starGrow, Leaf.Ease.quadOut)
		.to(120)
		.in(starFade/2, Leaf.Ease.quadOut)
		.to(0)
		.in(starFade/2, Leaf.Ease.quadIn)
	;

	s.startAngle
		.init(offset)
		// .to(midFifth * 0.94)
		// .in(starGrow, Leaf.Ease.smoothstep)
	;

	s.endAngle
		.init(fifth - offset)
		// .to(midFifth * 1.06)
		.to(offset + fifth / 12)
		.in(starGrow, Leaf.Ease.smoothstep)
	;

	s.radius
		.init(120)
		.wait(starGrow/2)
		.to(160)
		.in(starGrow/2, Leaf.Ease.linear)
		.to(20)
		.in(starFade/2, Leaf.Ease.smoothstep)
	;

	s.rotation
		.init(fifth * i)
		.to(fifth * i - 0.5)
		.in(starGrow + starFade, Leaf.Ease.smoothstep)
	;

	starSlices.push(s);
}

var startAnimation = function() {
	leaf.add(0, wrapCircle);
	leaf.add(80, dashRing);
	leaf.add(450, ring);
	leaf.add(850, ring2);
	leaf.add(1150, starSlices);
}

document.addEventListener('click', function() {
	leaf.provider.paused = !leaf.provider.paused;
});

document.addEventListener('mousemove', function(e) {
	var mx = e.pageX / window.innerWidth;
	leaf.provider.timeScale = 0.1 + mx * 2;
});

wrapCircle.onEnd = function(self) {
	leaf.provider.reset();
};

// leaf.provider = new (function() {

// 	var t = 0;

// 	document.addEventListener('mousemove', function(e) {
// 		var mx = e.pageX / window.innerWidth;
// 		t = mx * 5000;
// 	});
	
// 	this.getTime = function(registration) {
// 		return registration ? 0 : t;
// 	}
// });


startAnimation();










































