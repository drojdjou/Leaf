
var startAnimation = function(svgSource) {

	var svgParser = new Leaf.SVG(svgSource);
	var paths = svgParser.extractPaths();

	paths.reverse();	

	var maxWidth = (window.innerWidth < 1024) ? 2 : 10;

	var pathWidth = 
		p_(maxWidth)
	;

	var pathProgress =
		p_(0, 0)
		.to(0.0, 1.0)
		.in(400)
		.wait(50000)
		.to(1.0, 1.0)
		.in(400)
	;


	for(var i = 0; i < paths.length; i++) {

		var coords = paths[i];
		coords.mul(1 / svgParser.width).mul(window.innerWidth);

		var path = new Leaf.Path([1,1,1,1], coords);
		path.position.init(0, Leaf.Layout.hp(5));
		path.width = pathWidth;
		path.progress = pathProgress;
		leaf.add(i * 500, path);
	}

	leaf.provider.timeScale = 2;
	
}

Leaf.Loader.loadSVG('test/sample-google-full.svg', startAnimation);








