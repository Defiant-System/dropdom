
class Electric {
	constructor(parent, speed, lineWidth, amplitude, color) {
		this.parent = parent;
		this.color = `rgba(${ color || "255, 255, 255" }, 1)`;
		// this.blurColor = "#ddddff77";
		// this.blur = 23;
		this.speed = speed || 0.04;
		this.lineWidth = lineWidth || 5;
		this.amplitude = amplitude || 0.65;
		this.points = null;
		this.off = 0;
		this.ttl = 0;
		this.children = [];
		this.simplexNoise = new SimplexNoise;

		if (this.parent.particles !== undefined) {
			this.children = [...Array(2)].map(i => new Electric(this, 0.035, 4, 0.65, "250, 250, 255"));
		}
	}

	noise(v) {
		let amp = 1,
			sum = 0,
			f = 1;
		for (let i=0; i<6; ++i) {
			amp *= 0.5;
			sum += amp * (this.simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
			f *= 2;
		}
		return sum;
	}

	update(index) {
		let _sin = Math.sin,
			_cos = Math.cos,
			_pi = Math.PI,
			isChild = this.parent.particles === undefined,
			startPoint = isChild ? this.parent.startPoint : this.startPoint,
			endPoint = isChild ? this.parent.endPoint : this.endPoint,
			length = startPoint.distanceTo(endPoint),
			step = Math.max(length / 2, 25),
			normal = endPoint.clone().sub(startPoint).normalize().scale(length / step),
			radian = normal.angle(),
			sinv   = _sin(radian),
			cosv   = _cos(radian),
			points = this.points = [],
			off    = this.off += Utils.random(this.speed, this.speed * 0.1),
			waveWidth = (isChild ? length * 1.5 : length) * this.amplitude;

		// count down ttl (Time To Live)
		if (!isChild && this.ttl-- <= 0) {
			this.parent.particles.splice(index, 1);
		}
		
		for (let i=0, len=step; i<len; i++) {
			let n = i / 60,
				av = waveWidth * this.noise(n - off, 0) * 0.5,
				ax = sinv * av,
				ay = cosv * av,
				bv = waveWidth * this.noise(n + off, 0) * 0.5,
				bx = sinv * bv,
				by = cosv * bv,
				m = _sin((_pi * (i / (len - 1)))),
				x = startPoint.x + normal.x * i + (ax - bx) * m,
				y = startPoint.y + normal.y * i - (ay - by) * m;
			points.push(new Vector(x, y));
		}
		points.push(endPoint.clone());
		
		this.children.map(child => child.update());
	}

	draw(ctx) {
		let points = this.points || [],
			len = points.length,
			pi2 = Math.PI * 2;

		// Blur
		ctx.save();
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle   = "#115";
		ctx.shadowColor = "#ddddff";
		ctx.shadowBlur  = 23;
		ctx.beginPath();

		points.map((point, i) => {
			let d = len > 1 ? point.distanceTo(points[i === len - 1 ? i - 1 : i + 1]) : 0;
			ctx.moveTo(point.x + d, point.y);
			ctx.arc(point.x, point.y, d, 0, Math.PI * 2, false);
		});
		ctx.fill();
		ctx.restore();

		// electric
		ctx.save();
		ctx.lineWidth = Utils.random(this.lineWidth, 0.5);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		points.map((point, i) => ctx[i === 0 ? "moveTo" : "lineTo"](point.x, point.y));
		ctx.stroke();
		ctx.restore();
		
		if (this.parent.particles != undefined) {
			ctx.save();
			ctx.globalCompositeOperation = "screen";
			ctx.fillStyle   = "#fff";
			// start dot
			ctx.beginPath();
			ctx.arc(this.startPoint.x, this.startPoint.y, 4, 0, pi2);
			ctx.fill();

			// end dot
			ctx.beginPath();
			ctx.arc(this.endPoint.x, this.endPoint.y, 4, 0, pi2);
			ctx.fill();
			ctx.restore();
		}

		// Draw children
		if (this.children) {
			this.children.map(child => child.draw(ctx));
		}
	}
}
