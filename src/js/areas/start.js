
// dropdom.start

{
	init() {
		// fast references
		this.els = {
			el: window.find(".start-view"),
			content: window.find("content"),
			tutorial: window.find(".tutorial"),
			columns: window.find(".tutorial .columns"),
		};

		// bind event handlers
		this.els.tutorial.on("mousedown", ".tile", this.doTutorial);
	},
	dispatch(event) {
		let APP = dropdom,
			Self = APP.start,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "set-opponents":
				// reset seats
				break;
		}
	},
	doTutorial(event) {
		let APP = dropdom,
			Self = APP.start,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let tgt = $(event.target);
				if (tgt.hasClass("locked")) return;

				// sound effect
				window.audio.play("grab");

				let doc = $(document),
					cols = Self.els.columns,
					el = tgt.addClass("dragged"),
					offset = el.offset(".tutorial"),
					grid = parseInt(Self.els.tutorial.cssProp("--sW"), 10),
					limit = {
						minX: (0 * grid) + 5,
						maxX: (6 * grid) + 5,
					},
					click = {
						y: event.clientY,
						x: event.clientX,
					},
					cX = Math.round(offset.left / grid),
					cW = +el.prop("className").match(/tile \w+-(\d)/)[1];

				// drag details
				Self.drag = { doc, cols, el, grid, offset, click, limit };

				Self.els.tutorial.addClass("busy");
				// show show columns
				Self.drag.cols.css({ "--x": cX, "--w": cW }).removeClass("hidden");
				// cover app view
				Self.els.content.addClass("cover");
				// bind event handler
				Self.drag.doc.on("mousemove mouseup", Self.doTutorial);
				break;
			case "mousemove":
				let left = Drag.offset.left + event.clientX - Drag.click.x;
				left = Math.max(Drag.limit.minX, Math.min(Drag.limit.maxX, left)) + .15;
				Drag.el.css({ left });

				Drag.colX = Math.round(left / Drag.grid);
				Self.drag.cols.css({ "--x": Drag.colX });
				break;
			case "mouseup":
				if (Drag.colX === 4) {
					// sound effect
					window.audio.play("drop");
					// horisontaly align position
					Drag.el.css({ "--x": "4", left: (Drag.grid * 4) + 5 })
						.cssSequence("restore", "transitionend", el => {
							// verticaly align position
							el.css({ "--x": 4, "--y": 4 })
								.cssSequence("down", "transitionend", el => {
									Self.els.tutorial.find(".tile").cssSequence("tutorial-clear", "transitionend", tEl => {
										if (tEl.hasClass("purple-2")) {
											// blast row
											FX.blast(4, ["b", "r", "r", "r", "o", "o", "p", "p"]);
											// sound effect
											window.audio.play("line");

											// go to game view
											setTimeout(() => {
												APP.els.content.cssSequence("start-to-game", "transitionend", cEl => {
													cEl.data({ show: "game-view" })
														.cssSequence("appear-game", "transitionend", cEl => {
															// reset tutorial view
															Self.els.tutorial.find(".tile").removeClass("tutorial-clear restore down").css({ left: "" });
															Drag.el.css({ "--x": 1, "--y": 3 });
															// reset element
															Self.els.tutorial.removeClass("busy");

															// reset content element
															cEl.removeClass("start-to-game appear-game");
															// start new game
															APP.game.dispatch({ type: "new-game" });
														});
												});
											}, 500);
										}
									});
								});
						});
				} else {
					Drag.el.css({ "--x": "", left: 51 })
						.cssSequence("restore", "transitionend", el => {
							console.log(el);
							// reset element
							el.css({ "--x": 1, left: "" }).removeClass("restore");
						});
					// reset element
					Self.els.tutorial.removeClass("busy");
				}
				// reset elements
				Drag.el.removeClass("dragged");
				// hide show columns
				Self.drag.cols.addClass("hidden");
				// uncover app view
				Self.els.content.removeClass("cover");
				// bind event handler
				Self.drag.doc.off("mousemove mouseup", Self.doTutorial);
				break;
		}
	}
}
