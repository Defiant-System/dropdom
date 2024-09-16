

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


// default settings
const defaultSettings = {
	hiscore: 0,
};


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

		// apply settings
		this.dispatch({ type: "init-settings" });

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
			case "window.close":
				// save settings
				window.settings.setItem("settings", Self.settings);
				break;
			// custom events
			case "init-settings":
				// get settings, if any
				Self.settings = window.settings.getItem("settings") || defaultSettings;

				if (Self.settings.hiscore > 0) {
					Self.dispatch({ type: "update-hiscore", value: Self.settings.hiscore });
				}
				break;
			case "update-hiscore":
				// player bankroll ticker
				value = +Self.els.best.text();
				Self.settings.hiscore = event.value;
				// ticker
				Self.els.best
					.css({
						"--value": value,
						"--total": event.value,
					})
					.cssSequence("ticker", "animationend", el => {
						// update score content
						el.removeClass("ticker").html(event.value).cssProp({ "--value": "", "--total": "" });
					});
				break;
			case "add-score":
				// player bankroll ticker
				value = +Self.els.score.text();
				// update highscore, if need be
				if (value + event.value > Self.settings.hiscore) {
					Self.dispatch({ type: "update-hiscore", value: value + event.value });
				}
				// ticker
				Self.els.score
					.css({
						"--value": value,
						"--total": value + event.value,
					})
					.cssSequence("ticker", "animationend", el => {
						// update score content
						el.removeClass("ticker").html(value + event.value).cssProp({ "--value": "", "--total": "" });
					});
				break;
			case "toggle-music":
				// play sound effect
				window.audio.play("grab");
				// toggle window audio effects
				value = event.el.hasClass("off");
				// sync all toggle-music buttons
				Self.els.content.find(`.button[data-click="toggle-music"]`).toggleClass("off", value);
				
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
				// sync all toggle-music buttons
				Self.els.content.find(`.button[data-click="toggle-sound-fx"]`).toggleClass("off", value);
				
				window.audio.mute = !value;
				// play sound effect
				window.audio.play("grab");
				break;
			case "output-pgn":
				// output arena rows
				Arena.logMatrix();
				break;
			case "tmp-drop":
				Arena.drop(true);
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
