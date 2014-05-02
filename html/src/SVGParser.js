Leaf.SVGParser = function(source) {

	this.extractPaths = function() {

		var pathDecs = source.querySelectorAll('path');
		var paths = [];
		

		for(var pi = 0; pi < pathDecs.length; pi++) {
			var coord = new Leaf.PathCoord();
			var segList = pathDecs[pi].pathSegList;

			var x = 0, y = 0;

			for (var i = 0, len = segList.numberOfItems; i < len; i++) {
		        var p = segList.getItem(i);

		        switch(p.pathSegTypeAsLetter) {
		            case "m": 
		                x += p.x;
		                y += p.y;
		                coord.moveTo(x, y);
		                break;
		            case "l":
		            	break;
		            case "z":
		            	break;
		            case "c": 

		                var x1 = x + p.x1;
		                var y1 = y + p.y1;
		                var x2 = x + p.x2;
		                var y2 = y + p.y2;

		                x += p.x;
		                y += p.y;

		                coord.curveTo(x1, y1, x2, y2, x, y);
		                break;
		        }
		    }

			paths.push(coord);
		}

		return paths;
	}

};