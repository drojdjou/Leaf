var fs = require('fs');
var UglifyJS = require("uglify-js");

var version = require("./version.json");

var frameworkOut = "html/leaf.js";
var frameworkOutMin = "html/leaf.min.js";

var baseUrl = "html/src/";

var frameworkFiles = {
	include: [
		"Leaf",
		"Version",
		"Animator",
		"Color",
		"Controller",
		"Interpolation",
		"Layout",
		"Loader",
		"Object2d",
		"Prop",
		"SVG",
		"TimeProvider",
		"Util",
		"Vector2",
		"objects/Curve",
		"objects/Element",
		"objects/Empty",
		"objects/Image",
		"objects/Line",
		"objects/Path",
		"objects/Pie",
		"objects/Polygon",
		"objects/Rectangle",
		"objects/Sphere"
	]
};

var updateVersion = function() {
	version.build++;
	version.date = new Date();

	var jsHeader = "/** DO NOT EDIT. Updated from version.json **/\nLeaf.Version = ";

	fs.writeFileSync("./version.json", JSON.stringify(version));
	fs.writeFileSync(baseUrl  + "Version.js", jsHeader + JSON.stringify(version));
}

var minify = function(set) {
	var includes = [];

	for(var i = 0; i < set.include.length; i++) {
		includes.push(baseUrl + set.include[i] + ".js");
	}

	var result = UglifyJS.minify(includes);

	return result.code;
}

var concat = function(set) {
	var concatFile = "";

	for(var i = 0; i < set.include.length; i++) {
		var f = baseUrl + set.include[i] + ".js";

		concatFile += "/* --- --- [" + set.include[i] + "] --- --- */\n\n";
		concatFile += fs.readFileSync(f);
		concatFile += "\n\n";
	}

	return concatFile;
}

updateVersion();

console.log("Compressing javascript. Leaf version " + version.version + " build " + version.build);

fs.writeFileSync(frameworkOut, concat(frameworkFiles, false));
fs.writeFileSync(frameworkOutMin, minify(frameworkFiles, false));

console.log("...done!");







