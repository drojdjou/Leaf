/**
I Remember - 128
Get Lucky - 116
Computer World - 129
Giorgio - 113
Hide or Seek - 127
**/
var BPM = 116;
var SECBT = 2;
var ML = 60000 / BPM;


var input = document.createElement('input');
input.setAttribute('type', 'text');
input.style.position = 'absolute';
input.style.top = '10px';
input.style.left = '10px';
document.body.appendChild(input);

input.value = BPM;

input.addEventListener('change', function() {
	leaf.provider.setBPM(parseInt(input.value), onBeat);
});

var beat = new Leaf.Sphere([1,0,0,0]);
beat.name = "beat";
beat.stroke = true;

Leaf.Layout.setCenter(beat);

beat.radius.init(80);

beat.scale
	.init(0.5, 0.5)
	.to(1,1).in(ML/6, Leaf.Ease.quadOut)
	.to(1.5,1.5).in(ML/6*5, Leaf.Ease.quadIn)
;

beat.color
	.init(0,0,0,0)
	.to(1,0,0,1).in(ML/6, Leaf.Ease.quadOut)
	.to(1,0,0,0).in(ML/6*5, Leaf.Ease.quadIn)
;

beat.strokeSize
	.init(10)
	.to(0).in(ML, Leaf.Ease.quadOut)
;








var bar1 = new Leaf.Sphere([1,0,0,0.8]);
bar1.name = "bar";
bar1.radius.init(40);
Leaf.Layout.setCenter(bar1);

bar1.scale
	.init(0.05, 0.05)
	.to(1,1).in(100, Leaf.Ease.quadOut)
	.to(0.2,0.2).in(700, Leaf.Ease.quadIn)
;

bar1.color
	.to(1,0,0,0).in(900, Leaf.Ease.quadIn)
;

var bar2 = new Leaf.Sphere([1,1,1,0.8]);
bar2.name = "bar";
bar2.radius.init(60);
bar2.stroke = true;
bar2.strokeSize.init(20);
Leaf.Layout.setCenter(bar2);

bar2.scale
	.init(0.05, 0.05)
	.to(1,1).in(100, Leaf.Ease.quadOut)
	.to(0.2,0.2).in(700, Leaf.Ease.quadIn)
;

bar2.color
	.to(1,1,1,0).in(800, Leaf.Ease.quadIn)
;











var starSlices = [];
var offset = 0.02;
var SLICES = 16;

for(var i = 0; i < SLICES; i++) {

	var p = Math.PI * 2 / SLICES;
	var m = p / 2;

	var s = new Leaf.Pie([1, 0, 0, 1]);
	s.name = "pie" + i;
	Leaf.Layout.setCenter(s);

	s.thickness
		.init(10)
		.to((i % 2 == 0) ? 200 : 80).in(ML/4, Leaf.Ease.quadOut)
		.to(20).in(ML/4*3, Leaf.Ease.quadOut)
		.to(1).in(ML*3, Leaf.Ease.quadOut)
	;

	s.color
		.init(1, 0, 0, 0.2)
		.beginBlock()
		.to(1, 0, 0, (i % 2 == 0) ? 1 : 0.5).in(ML/2, Leaf.Ease.quadIn)
		.to(1, 0, 0, 0).in(ML*3, Leaf.Ease.quadIn)
	;

	s.radius 
		.init(125)
	;

	s.startAngle
		.init(offset)
	;

	s.endAngle
		.init(p - offset)
	;

	s.rotation
		.init(p * i)
	;

	starSlices.push(s);
}

var onBeat = function(bt, ofs) {

	leaf.add(ofs, beat);

	var slice1 = parseInt(bt % SLICES);
	var slice2 = (slice1 + 8) % SLICES;

	leaf.add(ofs, starSlices[slice1]);
	leaf.add(ofs, starSlices[slice2]);

	if(bt % SECBT == 0) {
		leaf.add(ofs, bar1);
	}

	if(bt % SECBT == 1) {
		leaf.add(ofs, bar2);
	}
}

leaf.provider.setBPM(BPM, onBeat);












