
var startAnimation = function(svgSource) {

	var svgParser = new Leaf.SVG(svgSource);
	var paths = svgParser.extractPaths();

	paths.reverse();	

	var pathWidth = 
		p_(1)

		.beginBlock()
		.to(10)
		.in(250)
		.to(1)
		.in(250)
		.repeatBlock(2)

		.to(10)
		.in(1000)
		.wait(10000)
		.to(1)
		.in(1000)
	;

	var pathProgress =
		p_(1, 1)

		.to(0.75, 1)
		.in(100)
		.to(0, 0.25)
		.in(100 * 8)
		.to(0, 0)
		.in(100)

		.to(0.0, 1.0)
		.in(1000)
		.wait(10000)
		.to(1.0, 1.0)
		.in(1000)
	;


	for(var i = 0; i < paths.length; i++) {

		var coords = paths[i];
		coords.mul(1 / svgParser.width).mul(window.innerWidth);

		var path = new Leaf.Path([1,1,1,1], coords);
		path.width = pathWidth;
		path.progress = pathProgress;
		leaf.add(i * 500, path);
	}

	leaf.provider.timeScale = 2;
	
}

Leaf.Loader.loadSVG('test/sample-google.svg', startAnimation);








