
class Fog {
	constructor(parent, x, y, color) {
		let sprite = fog[color];

		this.x = x;
		this.y = y;
		this.cX = sprite.w >> 1;
		this.cY = sprite.h >> 1;

		this.parent = parent;
		this.sprite = sprite;
		this.speed = Utils.random(1, 16);

		// friction will slow the fog down
		this.friction = 0.1;
		// gravity will be applied and pull the fog down
		this.gravity = .25;
		// set how fast the fog fades out
		this.decay = Utils.random(0.015, 0.03);
		this.alpha = 1.5;
	}

	update(index) {
		// slow down the fog
		this.speed *= this.friction;
		// apply velocity
		this.x += Math.cos(1.75) * this.speed;
		this.y += Math.sin(1.75) * this.speed + this.gravity;
		// fade out the shard
		this.alpha -= this.decay;

		// remove the shard once the alpha is low enough, based on the passed in index
		if (this.alpha <= 0) {
			this.parent.particles.splice(index, 1);
		}
	}

	draw(ctx) {
		let s = this.sprite;
		// draw sparkle
		ctx.save();
		ctx.translate(this.x, this.y);

		ctx.globalAlpha = this.alpha;
		ctx.drawImage(s.img, -this.cX, -this.cY);

		ctx.restore();
	}
}
