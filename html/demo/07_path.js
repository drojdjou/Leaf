
var startAnimation = function(svg) {

	var svgParser = new Leaf.SVGParser(svg);
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
		var path = new Leaf.Path([1,1,1,1], paths[i]);
		path.position.init(100, 100);
		path.width = pathWidth;
		path.progress = pathProgress;
		leaf.add(i * 500, path);
	}



	leaf.provider.timeScale = 2;
	
}

Leaf.Loader.loadSVG('test/sample-google-2.svg', startAnimation);








