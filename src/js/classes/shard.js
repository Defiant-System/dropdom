
class Shard {
	constructor(parent, x, y, color) {
		this.parent = parent;
		this.x = x;
		this.y = y;

		let frag = frags[color];
		this.cX = frag.w >> 1;
		this.cY = frag.h >> 1;
		this.frag = frag[Utils.random(0, frag.length-1) | 0];

		// set a random angle in all possible directions, in radians
		this.angle = Utils.random(-1.75, -2.5) + (Math.random() > .5 ? 0 : Math.PI * .33);
		this.speed = Utils.random(12, 19);

		this.moveRotation = Utils.random(-1, 1);
		this.rotation = 0;
		this.rad = Math.PI / 180;

		// friction will slow the shard down
		this.friction = 0.8;
		// gravity will be applied and pull the shard down
		this.gravity = 4;
		// set how fast the shard fades out
		this.decay = Utils.random(0.03, 0.05);
		this.alpha = 1;
	}

	update(index) {
		// slow down the shard
		this.speed *= this.friction;
		// apply velocity
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed + this.gravity;
		// fade out the shard
		this.alpha -= this.decay;

		this.rotation += this.moveRotation;
		// this.rotation %= 360;

		// remove the shard once the alpha is low enough, based on the passed in index
		if (this.alpha <= this.decay) {
			this.parent.particles.splice(index, 1);
		}
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation * this.rad);

		ctx.globalAlpha = this.alpha;
		// ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(this.frag.img, -this.cX, -this.cY);

		ctx.restore();
	}
}
