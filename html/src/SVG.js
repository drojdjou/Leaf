Leaf.SVG = function(source) {

	var svgRoot = source.querySelector('svg');

	this.width = parseInt(svgRoot.getAttribute('width'));
	this.height = parseInt(svgRoot.getAttribute('height'));

	this.extractPaths = function(normalize) {

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
		            case "M": 
		                x = p.x;
		                y = p.y;
		                coord.moveTo(x, y);
		                break;
		            case "l":
		            	if(p.x != 0 && p.y != 0) {
		            		x += p.x;
			                y += p.y;
			                coord.lineTo(x, y);
		            	}
		            	break;
		            case "L":
		            	x = p.x;
		                y = p.y;
		                coord.lineTo(p.x, p.y);
		            	break;
		            case "z":
		            case "Z":
		            	coord.close();
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
		            case "C": 
		            	x = p.x;
		                y = p.y;
		                coord.curveTo(p.x1, p.y1, p.x2, p.y2, p.x, p.y);
		                break;
		        }
		    }

			paths.push(coord);
		}

		return paths;
	}

};