V2 = {};

V2.add = function(a, b, result) {
	result = result || a;
	result[0] = a[0] + b[0];
	result[1] = a[1] + b[1];
	return result;
}

V2.sub = function(a, b, result) {
	result = result || a;
	result[0] = a[0] - b[0];
	result[1] = a[1] - b[1];
	return result;
}

V2.mul = function(a, m, result) {
	result = result || a;
	result[0] = a[0] * m;
	result[1] = a[1] * m;
	return result;
}

V2.neg = function(a, result) {
	result = result || a;
	result[0] = a[0] * -1;
	result[1] = a[1] * -1;
	return result;
}

V2.norm = function(a, result) {
	result = result || a;

	var m = V2.mag(a);
    if(m == 0) return a;
	result[0] = a[0] / m;
	result[1] = a[1] / m;

	return result;
}

V2.magSq = function(a) {
	return a[0] * a[0] + a[1] * a[1];
}

V2.mag = function(a) {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

V2.dot = function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

V2.distance = function(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
}

V2.distanceSqrt = function(a, b) {
    return (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]);
}