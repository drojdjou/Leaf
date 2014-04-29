V2 = function(x, y) {
	this.x = x;
	this.y = y;
}

V2.v = function(x, y) {
	return new V2(x, y);
}

V2.prototype.add = function(a, b) {
	this.x = a.x + b.x;
	this.y = a.y + b.y;
}

V2.prototype.sub = function(a, b) {
	this.x = a.x - b.x;
	this.y = a.y - b.y;
}

V2.prototype.mul = function(a, s) {
	this.x = a.x * s;
	this.y = a.y * s;
}

V2.prototype.neg = function(a) {
	this.x = -a.x;
	this.y = -a.y;
}

V2.prototype.norm = function(a) {
	var m = a.mag();
    if(m == 0) return a;
	this.x = a.x / m;
	this.y = a.y / m;
}

V2.prototype.magSq = function() {
	return this.x * this.x + this.y * this.y;
}

V2.prototype.mag = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

V2.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
}

V2.distance = function(a, b) {
    return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
}

V2.distanceSqrt = function(a, b) {
    return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

V2.prototype.lerp = function(a, b, t) {
	this.x = a.x + (b.x - a.x) * t;
	this.y = a.y + (b.y - a.y) * t;
	return this;
}