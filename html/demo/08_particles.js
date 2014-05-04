var addParticle = function(x, y) {
	var p = new Leaf.Sphere([1,1,1,0.5]);

	var ox = (100 + Math.random() * 200) - 150;
	var t = 3600 + 1600 * Math.random();
	var f = 40 + 120 * Math.random();
	var ft = 800;

	p.position
		.init(x, y)
		.to(x + ox * 0.33, y - f)
		.in(ft, Leaf.Ease.sineOut)
		.to(x + ox, y + 200)
		.in(t, Leaf.Ease.quadIn)
	;

	p.radius
		.init(5)
		.to(0)
		.in(t + ft)
	;

	leaf.add(0, p);
}

var mx, my;
var ppf = 2;

document.addEventListener('mousemove', function(e) {
	mx = e.pageX;
	my = e.pageY;
});

document.addEventListener('touchmove', function(e) {
	mx = e.pageX;
	my = e.pageY;
});


var makeParticles = function() {
	requestAnimationFrame(makeParticles);

	for(var i = 0; i < ppf; i++) addParticle(mx, my);
}

makeParticles();