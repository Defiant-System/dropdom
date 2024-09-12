

@import "./classes/simplexnoise.js"
@import "./classes/electric.js"
@import "./classes/vector.js"
@import "./classes/fog.js"
@import "./classes/shard.js"
@import "./classes/sparkle.js"

@import "./modules/fx.js"
@import "./modules/fragments.js"
@import "./modules/arena.js"
@import "./modules/utils.js"
@import "./modules/test.js"


const dropdom = {
	init() {
		// fast references
		this.content = window.find("content");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// init objects
		FX.init();
		Arena.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = dropdom,
			value,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "game-over":
				// play sound effect
				window.audio.play("fail");
				// set FX layer to grayscale
				FX.grayscale = true;

				Self.content.find(".board").removeClass("danger");
				Self.content.find(".game-view")
					.cssSequence("game-over busy", "transitionend", el => {
						// start trembling
						Self.content.find(".board").addClass("tremble");

						Arena.matrix.map((r, y) => {
							let rowTiles = el.find(`.tile[style*="--y: ${y}"]`);
							rowTiles.cssSequence("fade-out", "transitionend", tEl => {
								if (tEl[0] === rowTiles[0]) {
									// remove dom elements
									rowTiles.remove();
									// explode row cells
									let row = r.map(c => c === 0 ? 0 : c.slice(0,1));
									FX.blast(y, row);
									
									if (y === 9) {
										// stop tremble
										Self.content.find(".board").removeClass("tremble");
										
										setTimeout(() => {
											console.log("done!");
											// reset FX layer
											FX.grayscale = false;
										}, 1000);
									}
								}
							});
						});
					});
				break;
			case "output-arena":
				Arena.matrix.map((row, i) => console.log( i, row.join(" ") ));
				// Arena.addRows();
				break;
			case "toggle-audio":
				event.el.toggleClass("off", event.el.hasClass("off"));
				break;
			case "start-game":
				Self.content.data({ show: "game-view" });
				setTimeout(() => Arena.addRows(4), 500);
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	start: @import "./areas/start.js",
	game: @import "./areas/game.js",
};

window.exports = dropdom;
