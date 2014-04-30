/**
I Remember - 128
Get Lucky - 116
Computer World - 129
Giorgio - 113
Hide or Seek - 127
**/
var BPM = 116 * 2;
var ML = 60000 / BPM;

var r = Leaf.Layout.bestPercent(10), er = Leaf.Layout.bestPercent(30);

var p1 = 
	p_(-r, -r)
	.to(-er, -er).in(ML, Leaf.Ease.smoothstep)
	.to(-er, -r).in(ML, Leaf.Ease.smoothstep)
	.to( r, -er).in(ML, Leaf.Ease.smoothstep)
	.to( r, -r).in(ML, Leaf.Ease.quadIn)
;

var p2 =
	p_( r, -r)
	.wait(ML*0.33)
	.to(er, -er).in(ML, Leaf.Ease.smoothstep)
	.to(er, r).in(ML, Leaf.Ease.smoothstep)
	.to(r, er).in(ML, Leaf.Ease.smoothstep)
	.to(r, r).in(ML, Leaf.Ease.quadIn)
;

var p3 =
	p_( r, r)
	.wait(ML*0.66)
	.to(er, er).in(ML, Leaf.Ease.smoothstep)
	.to(-r, er).in(ML, Leaf.Ease.smoothstep)
	.to(-r, r).in(ML, Leaf.Ease.quadIn)
;

var p4 = 
    p_(-r, r)
    .wait(ML)
    .to(-er, er).in(ML, Leaf.Ease.smoothstep)
    .to(-er, -r).in(ML, Leaf.Ease.smoothstep)
    .to(-r, -r).in(ML, Leaf.Ease.quadIn)
;

var pos = p_(Leaf.Layout.centerX(), Leaf.Layout.centerY()).wait(ML * 4);


var poly = new Leaf.Polygon(4, [1.0,0,0,1]);
poly.p1 = p1, poly.p2 = p2, poly.p3 = p3, poly.p4 = p4, poly.position = pos;
poly.scale.init(1, 1);
poly.rotation.init(Math.PI / 32 * -1);
poly.zIndex = 0;

var poly2 = new Leaf.Polygon(4, [0.8,0,0,1]);

poly2.p1 = p1, poly2.p2 = p2, poly2.p3 = p3, poly2.p4 = p4, poly2.position = pos;
poly2.scale.init(0.8, 0.8);
poly2.rotation.init(Math.PI / 32 * -1.2);
poly2.zIndex = 1;

var poly3 = new Leaf.Polygon(4, [0.6,0,0,1]);

poly3.p1 = p1, poly3.p2 = p2, poly3.p3 = p3, poly3.p4 = p4, poly3.position = pos;
poly3.scale.init(0.6, 0.6);
poly3.rotation.init(Math.PI / 32 * -1.4);
poly3.zIndex = 2;

var poly4 = new Leaf.Polygon(4, [0.4,0,0,1]);

poly4.p1 = p1, poly4.p2 = p2, poly4.p3 = p3, poly4.p4 = p4, poly4.position = pos;
poly4.scale.init(0.4, 0.4);
poly4.rotation.init(Math.PI / 32 * -1.6);
poly4.zIndex = 3;


var onBeat = function(bt, ofs) {
	if(bt % 4 == 0) {
		leaf.add(ofs + 00, poly);
		leaf.add(ofs + 10, poly2);
		leaf.add(ofs + 15, poly3);
		leaf.add(ofs + 20, poly4);
	}
}

leaf.provider.setBPM(BPM, onBeat);











