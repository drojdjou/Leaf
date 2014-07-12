var addParticle = function(x, y) {
	var p = new Leaf.Rectangle(0, 0, [1,1,1,0.5]);

	p.enablePhysics(x, y);

	p.gravity = 0.2;
	p.friction = 0.98;

	p.force
		.init(0, 0)
		.to(Math.random() * 2 - 1, -(Math.random() + 1))
		.in(10)
		.to(0, 0)
		.in(160)
	;

	p.width.init(20).to(0).in(1000);
	p.height.init(20).to(0).in(1000);

	p.rotation
		.init(Math.PI * Math.random())
		.by(Math.PI * 2)
		.in(1000)
	;

	leaf.add(0, p);
}

var mx = 0, my = 0;
var ppf = 1, making = false;

document.addEventListener('mousemove', function(e) {
	mx = e.pageX;
	my = e.pageY;
	ppf = 5;
});

document.addEventListener('mousedown', function(e) {
	mx = e.pageX;
	my = e.pageY;
	making = true;
});

document.addEventListener('mouseup', function(e) {
	making = false;
});


document.addEventListener('touchstart', function(e) {
	mx = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
	my = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
	making = true;
});

document.addEventListener('touchmove', function(e) {
	mx = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
	my = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
});

document.addEventListener('touchend', function(e) {
	making = false;
});


var makeParticles = function() {
	requestAnimationFrame(makeParticles);

	if(making) {
		for(var i = 0; i < ppf; i++) addParticle(mx, my);
	}
}

makeParticles();
















