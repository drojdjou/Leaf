Leaf.Color = {

	array2Css: function(a) {
		return (a.length == 3) ? 
			 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')' : 
			'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + a[3] + ')';
	},

	floatArray2Css: function(a) {
		var f2i = Leaf.Color.f2i;
		return (a.length == 3) ? 
			 'rgb(' + f2i(a[0]) + ',' + f2i(a[1]) + ',' + f2i(a[2]) + ')' : 
			'rgba(' + f2i(a[0]) + ',' + f2i(a[1]) + ',' + f2i(a[2]) + ',' + f2i(a[3]) + ')';
	},

	f2i: function(f) {
		return Math.round(f * 255);
	},

	grey: function(v, a) {
		return [v, v, v, (a == null) ? 1 : a];
	}
}