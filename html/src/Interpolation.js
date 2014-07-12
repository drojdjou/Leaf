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
    },

    /**
     *  f = frequency, how many times to oscillate?
     *  if(f == 0) d = duration of single oscillation phase (in ms)
     *  ease = additional easing function to wrap it into
     */ 
    oscillate: function(f, d, ease) {
        if(f != 0) {
            var ft = 1 / f;
            d = d || 1;
            return function(t) {
                var te = (ease) ? ease(t) : t;
                var p = (te / ft) % 1;
                return Math.sin(p * Math.PI * 2) * d;
            }
        } else {
            return function(t) {
                var p = (new Date().getTime() % d) / d;
                return Math.sin(p * Math.PI * 2);
            }
        }
    },

    combine: function(e1, e2) {
        return function(t) {
            var c = e1(t) + e2(t);
            return c;
        }
    },

    noise: function(i, ease) {
        return function(t) {
            var n = Math.random() * i;
            return (ease) ? ease(t) * n : n;
        }
    },

    constant: function(a) {
        var now, delta, last = new Date().getTime();
        var c = 0
        return function(t) {
            now = new Date().getTime();
            delta = now - last;
            last = now;
            c += a / delta;
            return c;
        }
    }
}


// 0.6