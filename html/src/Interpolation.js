Leaf.Ease = {
	linear: function(t) { return t; },

	smoothstep: function(t) { return t * t * (3 - 2 * t); },

    quadIn: function (t) {
        return t * t;
    },

    quadOut: function (t) {
        return t * (2 - t);
    },

	quadInOut: function (t) {
        if (( t *= 2 ) < 1)
            return 0.5 * t * t;
        else
            return -0.5 * ( --t * ( t - 2 ) - 1 );
    },

    sineIn: function ( t ) {
        return 1 - Math.cos( t * Math.PI / 2 );
    },

    sineOut: function ( t ) {
        return Math.sin( t * Math.PI / 2 );
    },

    sineInOut: function ( t ) {
        return 0.5 * ( 1 - Math.cos( Math.PI * t ) );
    }
}