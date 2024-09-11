
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

		let Self = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 30,
			callback() {
				// console.log("tick");
				Self.render();

				if (!Self.particles.length) {
					console.log("stopped");
					// stop fps control
					Self.fpsControl.stop();
				}
			}
		});
	},
	blast(y, cells) {
		let list = cells.map((c, x) => [x, y, c]);
		this.explode(list);
	},
	explode(list) {
		list.map(cell => {
			var particleCount = Utils.random(2, 4) | 0,
				x = (cell[0] * 54) + 27,
				y = (cell[1] * 54) + 27,
				color = cell[2]; // Utils.random(1, 7) | 0;
			// fog
			this.particles.push(new Fog(this, x, y, color));
			// shards
			while(particleCount--) {
				this.particles.push(new Shard(this, x, y, color));
			}
			// sparkle
			this.particles.push(new Sparkle(this, x, y, color));
		});

		// start fpsControl
		if (this.fpsControl._stopped) {
			this.fpsControl.start();
		}
	},
	update() {
		let i = this.particles.length;
		while (i--) {
			this.particles[i].update(i);
		}
	},
	render() {
		let ctx = this.ctx;
		// reset canvas
		this.cvs.attr({ width: this.dim.width });
		this.ctx.save();
		// push origo to sync layers
		this.ctx.translate(50, 0);
		// update particles
		this.update();
		// draw particle
		this.particles.map(p => p.draw(ctx));
		this.ctx.restore();
	}
};
