
var radius = 30;
var width = 2;
var sides = 6;
var size = Math.tan(Math.PI * 2 / (sides*2)) * radius;
var time = 100;
var lines = [], outerLines = [];

var pie = new Leaf.Pie([1,1,1,1]);
Leaf.Layout.setCenter(pie);
pie.radius
	.init(radius * 1.66)
;

pie.thickness.init(width);

pie.startAngle
	.init(0)
	.wait(time * 8)
	.to(Math.PI * -2).in(time * 12, Leaf.Ease.quadOut)
	.wait(time * 4)
;

pie.endAngle
	.init(0)
	.to(Math.PI * -2).in(time * 8, Leaf.Ease.quadIn)
;

for(var i = 0; i < sides; i++) {


	var line = new Leaf.Line([1,1,1,1]);
	Leaf.Layout.setCenter(line);
	line.width.init(width);

	line.startPoint
		.init(size, radius)
	;

	line.endPoint
		.init(-size, radius)
	;

	line.progress
		.init(0.5, 0.5)
		.wait(time * i)
		.to(0, 1)
		.in(time, Leaf.Ease.linear)
		.wait(time * sides * 2)
		.to(1, 1)
		.in(time, Leaf.Ease.linear)
	;

	line.rotation
		.init(Math.PI * 2 / sides * i)
		.wait(time * (sides-1))
		.to(Math.PI * 2 / sides * i - Math.PI * 2 / sides)
		.in(time * 8, Leaf.Ease.quadOut)
	;

	lines.push(line);

	var outerLine = new Leaf.Line([1,1,1,1]);
	Leaf.Layout.setCenter(outerLine);

	outerLine.width.init(width);

	outerLine.startPoint
		.init(0, radius+30)
	;

	outerLine.endPoint
		.init(0, radius+50)
	;

	outerLine.progress
		.init(0, 0)
		.wait(time * i)
		.to(0, 1)
		.in(time * 2, Leaf.Ease.linear)
		.wait(time * sides)
		.to(3, 3)
		.in(time * 2, Leaf.Ease.quadIn)
	;

	outerLine.rotation
		.init(Math.PI * 2 / sides * (i + 0.5))
		.wait(time * (sides-1))
		.to(Math.PI * 2 / sides * (i + 0.5) + Math.PI * 2 / sides)
		.in(time * 8, Leaf.Ease.quadOut)
	;

	outerLines.push(outerLine);

}

var startPreloader = function(self) {
	leaf.add(0, lines);
	leaf.add(0, outerLines);
	leaf.add(0, pie);
}

pie.onEnd = startPreloader;

startPreloader();



