
var startAnimation = function() {

	var pathCoord = new Leaf.PathCoord();
	pathCoord.moveTo(0, 0);
	pathCoord.curveTo(0, -100, 200, -100, 200, 0);
	pathCoord.curveTo(400, 0, 400, 200, 200, 200);
	pathCoord.lineTo(0, 200);
	pathCoord.curveTo(-200, 200, -200, 0, 0, 0);

	var path = new Leaf.Path([1,1,1,1], pathCoord);
	Leaf.Layout.setCenter(path);
	path.position.by(-100, -100).in(0);
	path.width.init(10);
	path.progress
		.init(0.0, 0.0)
		.beginBlock()
		.to(0.0, 0.1)
		.in(200)
		.to(0.9, 1.0)
		.in(200 * 9)
		.to(1.0, 1.0)
		.in(200)
		.to(0, 0)
		.in(0)
		.to(0.0, 1.0)
		.in(2000)
		.wait(4000)
		.to(1.0, 1.0)
		.in(2000)
		.repeatBlock(10)
	;

	leaf.provider.timeScale = 1;
	leaf.add(0, path);
}

startAnimation();