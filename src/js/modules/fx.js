
let FX = {
	particles: [],
	init() {
		// canvas reference
		this.cvs = window.find("content canvas.fx-layer");
		this.ctx = this.cvs[0].getContext("2d", { willReadFrequently: true });
		
		let width = +this.cvs.prop("offsetWidth"),
			height = +this.cvs.prop("offsetHeight");
		this.cvs.attr({ width, height });
		this.dim = { width, height };
	},
	blast(y, cells) {
		let list = cells.map((c, x) => [x, y, c]);
		this.explode(list);
	},
	explode(list) {
		list.map(cell => {
			var particleCount = Utils.random(1, 3) | 0,
				x = (cell[0] * 26) + 13,
				y = (cell[1] * 26) + 13,
				color = cell[2] - 1; // Utils.random(1, 7) | 0;
			// fog
			this.particles.push(new Fog(this, x, y, color));
			// shards
			while(particleCount--) {
				this.particles.push(new Shard(this, x, y, color));
			}
			// sparkle
			this.particles.push(new Sparkle(this, x, y, color));
		});
	},
	update() {
		let i = this.particles.length;
		while (i--) {
			this.particles[i].update(i);
		}
	},
	draw() {
		let ctx = this.ctx;
		// reset canvas
		this.cvs.attr({ width: this.dim.width });
		this.ctx.save();
		// push origo to sync layers
		this.ctx.translate(100, 50);
		// update particles
		this.update();
		// draw particle
		this.particles.map(p => p.draw(ctx));
		this.ctx.restore();
	}
};
