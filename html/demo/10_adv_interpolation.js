
var button = new Leaf.Rectangle(140, 140, [1,1,1,1]);

Leaf.Layout.setCenter(button);

button.position

	.by(-200, 0).in(0)

	.beginBlock()
	.by( 400, 0)
	.in(4000, Leaf.Ease.combine(Leaf.Ease.quadInOut, Leaf.Ease.oscillate(8, 0.1, Leaf.Ease.quadInOut)))
	.wait(1000)
	.by(-400, 0)
	.in(4000, Leaf.Ease.combine(Leaf.Ease.quadInOut, Leaf.Ease.noise(0.1, Leaf.Ease.oscillate(0.5))))
	.wait(1000)
	.repeatBlock(10)
;

button.rotation

	.beginBlock()
	.by( Math.PI, 0)
	.in(4000, Leaf.Ease.combine(Leaf.Ease.quadInOut, Leaf.Ease.oscillate(8, 0.1, Leaf.Ease.quadInOut)))
	.wait(1000)
	.by(-Math.PI, 0)
	.in(4000, Leaf.Ease.combine(Leaf.Ease.quadInOut, Leaf.Ease.noise(0.1, Leaf.Ease.oscillate(0.5))))
	.wait(1000)
	.repeatBlock(10)
;

leaf.add(-1000, button);

document.addEventListener('click', function(e) {

	leaf.remove(button);

});