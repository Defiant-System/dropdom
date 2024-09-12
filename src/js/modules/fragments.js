
// let frags = [...Array(7)].map(r => []),
let frags = {
		"g": [], // gray
		"b": [],
		"c": [],
		"o": [],
		"g": [],
		"p": [],
		"r": [],
		// "y": // yellow
	},
	shards = [
		{ w: 13, h: 15, x: 3, y: 26 },
		{ w: 14, h: 16, x: 20, y: 26 },
		{ w: 15, h: 19, x: 38, y: 26 },
		{ w: 17, h: 22, x: 56, y: 26 },
		{ w: 21, h: 23, x: 77, y: 26 },
	],
	sparkles = {
		"b": { w: 25, h: 29, x: 25, y: 229 }, // blue
		"g": { w: 25, h: 29, x: 50, y: 200 }, // green
		"r": { w: 25, h: 29, x: 0, y: 200 },  // red
		"p": { w: 25, h: 29, x: 25, y: 200 }, // purple
		"o": { w: 25, h: 29, x: 0, y: 229 },  // orange
		"c": { w: 25, h: 29, x: 50, y: 229 }, // cyan
		// "y": { w: 25, h: 29, x: 75, y: 200 }, // yellow
	},
	fogs = {
		"b": { w: 25, h: 25, x: 25, y: 283 }, // blue
		"g": { w: 25, h: 25, x: 50, y: 258 }, // green
		"r": { w: 25, h: 25, x: 0, y: 258 },  // red
		"p": { w: 25, h: 25, x: 25, y: 258 }, // purple
		"o": { w: 25, h: 25, x: 0, y: 283 },  // orange
		"c": { w: 25, h: 25, x: 50, y: 283 }, // cyan
		// "y": { w: 25, h: 25, x: 75, y: 258 }, // yellow
	};


let sprite = new Image;
sprite.onload = () => {
	Object.keys(frags).map((key, i) => {
		shards.map(dim => {
			let shard = Utils.createCanvas(dim.w, dim.h),
				x = -dim.x,
				y = -dim.y - (i * 25);
			shard.ctx.drawImage(sprite, x, y);
			frags[key].push({ ...dim, img: shard.cvs[0] });
		});
	});

	Object.keys(sparkles).map(key => {
		let dim = sparkles[key];
		let star = Utils.createCanvas(dim.w, dim.h);
		star.ctx.drawImage(sprite, -dim.x, -dim.y);
		dim.img = star.cvs[0];
	});

	Object.keys(fogs).map(key => {
		let dim = fogs[key];
		let fog = Utils.createCanvas(dim.w, dim.h);
		fog.ctx.drawImage(sprite, -dim.x, -dim.y);
		dim.img = fog.cvs[0];
	});
};

sprite.src = "~/img/shards.webp";
