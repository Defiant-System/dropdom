

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
		this.els = {
			content: window.find("content"),
			gameView: window.find(".game-view"),
			board: window.find(".board"),
			best: window.find(".best span"),
			score: window.find(".score span"),
		};

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
			total,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "add-score":
				// player bankroll ticker
				Self.els.score
					.css({
						"--value": +Self.els.score.text(),
						"--total": event.value,
					})
					.cssSequence("ticker", "animationend", el => {
						// update score content
						el.removeClass("ticker").html(event.value).cssProp({ "--value": "", "--total": "" });
					});
				break;
			case "start-game":
				Self.els.content.data({ show: "game-view" });
				setTimeout(() => Arena.addRows(4), 500);
				break;
			case "game-over":
				// play sound effect
				window.audio.play("fail");
				// set FX layer to grayscale
				FX.grayscale = true;

				Sels.els.board.removeClass("danger");
				Self.els.gameView
					.cssSequence("game-over busy", "transitionend", el => {
						// start trembling
						Sels.els.board.addClass("tremble");

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
										Sels.els.board.removeClass("tremble");

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
				// play sound effect
				window.audio.play("grab");
				
				Arena.matrix.map((row, i) => console.log( i, row.join(" ") ));
				// Arena.addRows();
				break;
			case "toggle-music":
				// play sound effect
				window.audio.play("grab");
				// toggle window audio effects
				value = event.el.hasClass("off");
				event.el.toggleClass("off", value);
				
				if (!Self.song) {
					let opt = {
						onend: e => {
							// turn "off" button
							Self.els.content.find(`.button[data-click="toggle-music"]`).addClass("off");
							// reset reference
							delete Self.song;
						}
					};
					window.audio.play("song", opt).then(song => Self.song = song)
				} else {
					Self.song.stop();
					delete Self.song;
				}
				break;
			case "toggle-sound-fx":
				// toggle window audio effects
				value = event.el.hasClass("off");
				event.el.toggleClass("off", value);
				window.audio.mute = !value;
				// play sound effect
				window.audio.play("grab");
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
