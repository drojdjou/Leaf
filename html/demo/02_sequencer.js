/**

I Remember - 128
Get Lucky - 116
Computer World - 129
Giorgio - 113
Hide or Seek - 127

**/

var BPM = 129;
var ML = 60000 / BPM;

var beatCount = 0;
var startTime = -1;

var setInCenter = function(o) {
    o.position.init(leaf.centerX(), leaf.centerY());
}

var now = function() {
	return new Date().getTime();
}

var beat = new Leaf.Sphere([1,0,0,0]);
beat.name = "beat";
beat.stroke = true;

setInCenter(beat);

beat.radius.init(80);

beat.scale
	.init(1.0,1.0)
	.to(1,1).in(100, Leaf.Ease.quadOut)
	.to(1.5,1.5).in(600, Leaf.Ease.quadIn)
;

beat.color
	.init(0,0,0,0)
	.to(1,0,0,1).in(300, Leaf.Ease.quadOut)
	.to(1,0,0,0).in(600, Leaf.Ease.quadIn)
;

beat.strokeSize
	.init(10)
	.to(0).in(2100, Leaf.Ease.quadOut)
;








var bar1 = new Leaf.Sphere([1,0.8,0,0.8]);
bar1.name = "bar";
bar1.radius.init(40);
setInCenter(bar1);

bar1.scale
	.init(0.05, 0.05)
	.to(1,1).in(100, Leaf.Ease.quadOut)
	.to(0.2,0.2).in(800, Leaf.Ease.quadIn)
;

bar1.color
	.to(1,0.5,0,0).in(900, Leaf.Ease.quadOut)
;

var bar2 = new Leaf.Sphere([1,1,1,0.8]);
bar2.name = "bar";
bar2.radius.init(60);
setInCenter(bar2);

bar2.scale
	.init(0.05, 0.05)
	.to(1,1).in(100, Leaf.Ease.quadOut)
	.to(0.2,0.2).in(800, Leaf.Ease.quadIn)
;

bar2.color
	.to(0,0.5,1,0).in(900, Leaf.Ease.quadOut)
;











var starSlices = [];
var offset = 0.02;
var SLICES = 16;

for(var i = 0; i < SLICES; i++) {

	var p = Math.PI * 2 / SLICES;
	var m = p / 2;

	var s = new Leaf.Pie([1, 0, 0, 1]);
	s.name = "pie" + i;
	setInCenter(s);

	s.thickness
		.init(10)
		.to((i % 2 == 0) ? 200 : 80).in(ML/2, Leaf.Ease.quadOut)
		.to(10).in(ML/2, Leaf.Ease.quadOut)
		.to((i % 2 == 0) ? 100 : 40).in(ML/2, Leaf.Ease.quadOut)
		.to(10).in(ML/2, Leaf.Ease.quadOut)
		.to((i % 2 == 0) ? 50 : 10).in(ML/2, Leaf.Ease.quadOut)
		.to(10).in(ML, Leaf.Ease.quadOut)
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

var process = function() {
	if(startTime == -1) startTime = now();
	var t = now() - startTime;
	var btc = t / ML;

	if((btc | 0) > beatCount) {
		beatCount = btc | 0;
		leaf.add(0, beat);

		var slice1 = parseInt((btc-0) % SLICES);
		var slice2 = (slice1 + 8) % SLICES;

		leaf.add(0, starSlices[slice1]);
		leaf.add(0, starSlices[slice2]);

		if(beatCount % 2 == 0) {
			leaf.add(0, bar1);
		}

		if(beatCount % 2 == 1) {
			leaf.add(0, bar2);
		}
	}
}















