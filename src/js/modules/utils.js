
// simple utils
let Utils = {
	// get a random number within a range
	random(min, max) {
		return (Math.random() * ( max - min ) + min) | 0;
	},
	// calculate the distance between two points
	calculateDistance(p1x, p1y, p2x, p2y) {
		let xDistance = p1x - p2x,
			yDistance = p1y - p2y;
		return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
	}
};
