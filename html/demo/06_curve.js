/*

m262.5,103c125,-17 206,-72 209,15c3,87 -4,197 -64,182c-60,-15 -150,-26 -181,-44c-31,-18 -52,-35 -55,-74

m262.5,175c-10,121 -96,-212 -123,-104c-27,108 -72,152 -18,192c54,40 134,79 133.5,79

*/

;
var ly = Leaf.Layout
var a = p_(ly.wp(20), ly.hp(50));
var c1 = p_(ly.wp(40), ly.hp(100));
var c2 = p_(ly.wp(60), ly.hp(-50));
var b = p_(ly.wp(80), ly.hp(50));

var curve = new Leaf.Curve(Leaf.Color.grey(1));

curve.startPoint = a;
curve.controlPointA = c1;
curve.controlPointB = c2;
curve.endPoint = b;

curve.width
	.init(1)

	.beginBlock()

	.to(20).in(500)
	.to(1).in(500)
	.wait(300)
	.to(20).in(500)
	.to(1).in(500)

	.wait(300)

	.to(20).in(1200, Leaf.Ease.quadOut)
	.to(1).in(400, Leaf.Ease.quadIn)
	.wait(300)
	.to(20).in(1200, Leaf.Ease.quadOut)
	.to(1).in(400, Leaf.Ease.quadIn)

	.wait(300)

	.repeatBlock(20)
;

curve.progress
	.init(0, 0)

	.beginBlock()

	.to(0, 0.2).in(200, Leaf.Ease.linear)
	.to(0.8, 1).in(600, Leaf.Ease.linear)
	.to(1, 1).in(200, Leaf.Ease.quadIn)
	.wait(300)
	.to(0.8, 1).in(200, Leaf.Ease.linear)
	.to(0, 0.2).in(600, Leaf.Ease.linear)
	.to(0, 0).in(200, Leaf.Ease.quadIn)

	.wait(300)

	.to(0, 1).in(800, Leaf.Ease.quadOut)
	.to(1, 1).in(800, Leaf.Ease.quadOut)
	.wait(300)
	.to(0, 1).in(800, Leaf.Ease.quadOut)
	.to(0, 0).in(800, Leaf.Ease.quadOut)

	.wait(300)

	.repeatBlock(20)
;

var ct1 = new Leaf.Line(Leaf.Color.grey(0.25));
Leaf.Layout.setCenter(ct1);
ct1.startPoint = a;
ct1.endPoint = c1;

var ct2 = new Leaf.Line(Leaf.Color.grey(0.25));
Leaf.Layout.setCenter(ct2);
ct2.startPoint = b;
ct2.endPoint = c2;

// leaf.add(0, ct1);
// leaf.add(0, ct2);
leaf.add(0, curve);















