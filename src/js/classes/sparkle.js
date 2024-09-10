
class Sparkle {
	constructor(parent, x, y, color) {
		let sprite = sparkles[color],
			spread = sprite.w * .2;

		this.x = x + Utils.random(-spread, spread);
		this.y = y + Utils.random(-spread, spread);
		this.cX = sprite.w >> 1;
		this.cY = sprite.h >> 1;

		this.parent = parent;
		this.sprite = sprite;
		// a little bit of rotation
		this.moveRotation = Utils.random(-5, 5);
		this.rotation = 0;
		this.rad = Math.PI / 180;
		// set how fast the shard fades out
		this.decay = Utils.random(0.025, 0.125);
		this.alpha = 1.15;
	}

	update(index) {
		// fade out the shard
		this.alpha -= this.decay;
		// rotate sparkle
		this.rotation += this.moveRotation;

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
		ctx.rotate(this.rotation * this.rad);

		ctx.globalAlpha = this.alpha;
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(s.img, -this.cX, -this.cY);

		ctx.restore();
	}
}
