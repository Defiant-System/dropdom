
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

		// reset dimensions
		this.reset();

		let APP = dropdom,
			Self = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 30,
			callback() {
				Self.render();

				if (!Self.particles.length) {
					// stop fps control
					Self.fpsControl.stop();
				}
			}
		});
	},
	set grayscale(v) {
		this._grayscale = v;
		this.cvs.toggleClass("grayscale", !v);
	},
	reset() {
		let APP = dropdom,
			shows = APP.els.content.data("show"),
			device_view = shows === "game-view" ? "desktop-game" : "desktop-start";
		// console.log( device_view );
		if ($.isHHD) {
			let width = window.innerWidth;
			device_view = shows === "game-view" ? `hhd${width}-start` : `hhd${width}-start`;
		}
		// console.log(device_view);
		switch (device_view) {
			case "desktop-start":
				this.dim.oX = 50;
				this.dim.oY = 125;
				this.dim.gX = 83;
				this.dim.grid = 46;
				break;
			case "desktop-game":
				this.dim.oX = 50;
				this.dim.oY = 0;
				this.dim.gX = 55;
				this.dim.grid = 55;
				break;

			case "hhd-375-start":
				this.dim.oX = 0;
				this.dim.oY = 3;
				this.dim.gX = 44;
				this.dim.grid = 41;
				break;
			case "hhd-375-game":
				this.dim.oX = 0;
				this.dim.oY = -3;
				this.dim.gX = 44;
				this.dim.grid = 41;
				break;

			case "hhd-414-start":
				this.dim.oX = 0;
				this.dim.oY = 65;
				this.dim.gX = 47;
				this.dim.grid = 46;
				break;
			case "hhd-414-game":
				this.dim.oX = 0;
				this.dim.oY = 65;
				this.dim.gX = 39;
				this.dim.grid = 48;
				break;
		}
	},
	electify(x1, y1, x2, y2) {
		// prepare electric
		let electric = new Electric(this);
		electric.ttl = 50;
		electric.startPoint = new Vector(x1, y1);
		electric.endPoint = new Vector(x2, y2);
		this.particles.push(electric);
		// sound of electric
		window.audio.play("electric");
		// start fpsControl
		if (this.fpsControl._stopped) {
			this.fpsControl.start();
		}
	},
	blast(y, cells) {
		let list = cells.map((c, x) => [x, y, c]);
		this.explode(list);
	},
	explode(list) {
		list.filter(c => !!c[2]).map(cell => {
			var particleCount = Utils.random(2, 4) | 0,
				x = (cell[0] * this.dim.grid) + this.dim.gX,
				y = (cell[1] * this.dim.grid) + (this.dim.grid >> 1),
				color = cell[2]; // Utils.random(1, 7) | 0;
			// shards
			while(particleCount--) {
				this.particles.push(new Shard(this, x, y, color));
			}
			// fog
			this.particles.push(new Fog(this, x, y, color));
			// no sparks if grayscale
			if (this._grayscale) return;
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
		this.ctx.translate(this.dim.oX, this.dim.oY);
		// update particles
		this.update();
		// draw particle
		this.particles.map(p => p.draw(ctx));
		this.ctx.restore();
	}
};
