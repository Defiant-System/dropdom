
let frags = [...Array(7)].map(r => []),
	shards = [
		{ w: 13, h: 15, x: 3, y: 101 },
		{ w: 14, h: 16, x: 20, y: 101 },
		{ w: 15, h: 19, x: 38, y: 101 },
		{ w: 17, h: 22, x: 56, y: 101 },
		{ w: 21, h: 23, x: 77, y: 101 },
	],
	sparkles = [
		{ w: 25, h: 29, x: 25, y: 304 }, // blue
		{ w: 25, h: 29, x: 50, y: 304 }, // cyan
		{ w: 25, h: 29, x: 0, y: 304 },  // orange
		{ w: 25, h: 29, x: 75, y: 275 }, // yellow
		{ w: 25, h: 29, x: 50, y: 275 }, // green
		{ w: 25, h: 29, x: 25, y: 275 }, // purple
		{ w: 25, h: 29, x: 0, y: 275 },  // red
	],
	fog = [
		{ w: 25, h: 25, x: 25, y: 358 }, // blue
		{ w: 25, h: 25, x: 50, y: 358 }, // cyan
		{ w: 25, h: 25, x: 0, y: 358 },  // orange
		{ w: 25, h: 25, x: 75, y: 333 }, // yellow
		{ w: 25, h: 25, x: 50, y: 333 }, // green
		{ w: 25, h: 25, x: 25, y: 333 }, // purple
		{ w: 25, h: 25, x: 0, y: 333 },  // red
	];

let sprite = new Image;
sprite.onload = () => {
	frags.map((f, i) => {
		shards.map(dim => {
			let shard = Utils.createCanvas(dim.w, dim.h),
				x = -dim.x,
				y = -dim.y - (i * 25);
			shard.ctx.drawImage(sprite, x, y);
			frags[i].push({ ...dim, img: shard.cvs[0] });
		});
	});

	sparkles.map(dim => {
		let star = Utils.createCanvas(dim.w, dim.h);
		star.ctx.drawImage(sprite, -dim.x, -dim.y);
		dim.img = star.cvs[0];
	});

	fog.map(dim => {
		let fog = Utils.createCanvas(dim.w, dim.h);
		fog.ctx.drawImage(sprite, -dim.x, -dim.y);
		dim.img = fog.cvs[0];
	});
};

sprite.src = "~/img/sprite.png";
