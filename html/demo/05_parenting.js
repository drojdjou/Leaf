
var p10 = Leaf.Layout.heightPercent(10);

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
var WD= 12;

var body = new Leaf.Line([1,1,1,1]);
body.name = "body";
Leaf.Layout.setCenter(body);

body.width.init(WD);
body.startPoint.init(0, 0);
body.endPoint.init(0, p10 * -2.2);

body.position
	.beginBlock()
	.by(0, 20).in(ML * 0.5)
	.by(0, -20).in(ML * 0.5)
	.repeatBlock(2)
;

body.rotation.init(-0.1);

var leftArm = new Leaf.Line([1,1,1,1]);
leftArm.name = "leftArm";
leftArm.width.init(WD);
leftArm.position.init(0, p10 * -2);
leftArm.startPoint.init(0, 0);
leftArm.endPoint.init(0, p10 * 1);
leftArm.rotation
	.init(Math.PI * -0.4)
	.beginBlock()
	.to(Math.PI * 0.4).in(ML * 0.8, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.4).in(ML * 1.2, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;

var leftHand = new Leaf.Line([1,1,1,1]);
leftHand.name = "leftArm";
leftHand.width.init(WD);
leftHand.position.init(0, p10 * 1);
leftHand.startPoint.init(0, 0);
leftHand.endPoint.init(0, p10 * 1);
leftHand.rotation
	.init(Math.PI * 0.2)
	.beginBlock()
	.to(Math.PI * 0.2).in(ML * 0.8, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.8).in(ML * 0.6, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.2).in(ML * 0.6, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;





var rightArm = new Leaf.Line(Leaf.Color.grey(1));
rightArm.name = "leftArm";
rightArm.width.init(WD);
rightArm.position.init(0, p10 * -2);
rightArm.startPoint.init(0, 0);
rightArm.endPoint.init(0, p10 * 1);
rightArm.rotation
	.init(Math.PI * 0.4)
	.beginBlock()
	.to(Math.PI * -0.4).in(ML * 1.2, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.4).in(ML * 0.8, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;

var rightHand = new Leaf.Line(Leaf.Color.grey(1));
rightHand.name = "leftArm";
rightHand.width.init(WD);
rightHand.position.init(0, p10 * 1);
rightHand.startPoint.init(0, 0);
rightHand.endPoint.init(0, p10 * 1);
rightHand.rotation
	.init(Math.PI * 0.2)
	.beginBlock()
	.to(Math.PI * 0.2).in(ML * 0.6, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.8).in(ML * 0.6, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.2).in(ML * 0.8, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;



var leftLeg  = new Leaf.Line([1,1,1,1]);
leftLeg.name = "leftLeg";
leftLeg.width.init(WD);
leftLeg.startPoint.init(0, 0);
leftLeg.endPoint.init(0, p10 * 1.5);
leftLeg.rotation
	.init(Math.PI * -0.3)
	.beginBlock()
	.to(Math.PI * 0.6).in(ML, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.3).in(ML, Leaf.Ease.smoothstep)
	// .repeatBlock(2)

;

var leftFoot  = new Leaf.Line([1,1,1,1]);
leftFoot.name = "leftFoot";
leftFoot.width.init(WD);
leftFoot.position.init(0, p10 * 1.5);
leftFoot.startPoint.init(0, 0);
leftFoot.endPoint.init(0, p10 * 1.5);
leftFoot.rotation
	.init(Math.PI * -0.4)
	.beginBlock()
	.to(Math.PI * -0.8).in(ML/2, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.8).in(ML/2, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.0).in(ML/2, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.3).in(ML/4, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.4).in(ML/4, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;

var rightLeg  = new Leaf.Line(Leaf.Color.grey(1));
rightLeg.name = "leftLeg";
rightLeg.width.init(WD);
rightLeg.startPoint.init(0, 0);
rightLeg.endPoint.init(0, p10 * 1.5);
rightLeg.rotation
	.init(Math.PI * 0.6)
	.beginBlock()
	.to(Math.PI * -0.3).in(ML, Leaf.Ease.smoothstep)
	.to(Math.PI * 0.6).in(ML, Leaf.Ease.smoothstep)
	// .repeatBlock(2)

;

var rightFoot  = new Leaf.Line(Leaf.Color.grey(1));
rightFoot.name = "leftFoot";
rightFoot.width.init(WD);
rightFoot.position.init(0, p10 * 1.5);
rightFoot.startPoint.init(0, 0);
rightFoot.endPoint.init(0, p10 * 1.5);
rightFoot.rotation
	.init(Math.PI * -0.8)
	.beginBlock()
	.to(Math.PI * 0.0).in(ML/2, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.3).in(ML/4, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.4).in(ML/4, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.8).in(ML/2, Leaf.Ease.smoothstep)
	.to(Math.PI * -0.8).in(ML/2, Leaf.Ease.smoothstep)
	// .repeatBlock(2)
;



var head = new Leaf.Sphere(Leaf.Color.grey(1));
head.name = "head";
head.stroke = true;
head.strokeSize.init(WD);
head.radius.init(p10 / 2);
head.position.init(0, p10 * -2.8);

head.position
	.beginBlock()
	.by(5,  0).in(ML * 0.33)
	.by(-10,  0).in(ML * 0.33)
	.by(5, 0).in(ML * 0.33)
	.repeatBlock(2)
;

leaf.provider.timeScale = 1;

body.add(rightArm);
rightArm.add(rightHand);

body.add(leftArm);
leftArm.add(leftHand);

rightLeg.add(rightFoot);
body.add(rightLeg);

leftLeg.add(leftFoot);
body.add(leftLeg);

body.add(head);

var onBeat = function(bt, ofs) {
	if(bt % 2 == 0) {
		leaf.add(ofs, body);
	}
}

leaf.provider.setBPM(BPM, onBeat);



