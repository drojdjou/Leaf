// LIBRARY

var semiCircle = new Leaf.Pie([1,1,1,1]);
semiCircle.endAngle.init(Math.PI);
semiCircle.radius.init(20);
Leaf.Layout.setCenter(semiCircle);
semiCircle.position.wait(300000);


var dot = new Leaf.Sphere([1,1,1,1]);
dot.radius.init(20);
Leaf.Layout.setCenter(dot);

var line = new Leaf.Line([1,1,1,1]);
Leaf.Layout.setCenter(line);

var squares = [];
for(var i = 0; i < 3; i++) {
	squares.push(
		new Leaf.Rectangle(50, 50, [1,1,1,1])
	);
}

// TIMELINE

semiCircle.thickness.init(0);
semiCircle.thickness.to(100).in(1000, Leaf.Ease.quadOut);

semiCircle.endAngle.init(0);
semiCircle.endAngle.to(Math.PI).in(2000, Leaf.Ease.quadOut);

semiCircle.rotation.init(0);
semiCircle.rotation.wait(500);
semiCircle.rotation.to(Math.PI).in(3500, Leaf.Ease.quadOut);

semiCircle.startAngle.init(0);
semiCircle.startAngle.wait(1500);
semiCircle.startAngle.to(Math.PI).in(2500, Leaf.Ease.quadOut);


// ACTION

leaf.add(0, semiCircle);
leaf.provider.timeScale = 2;