
// dropdom.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view"),
			board: window.find(".board"),
			scores: window.find(".scores"),
			gameView: window.find(".game-view"),
			columns: window.find(".board .columns"),
			content: window.find("content"),
		};

		// bind event handlers
		this.els.board.on("mousedown", ".tile", this.doDrag);
	},
	dispatch(event) {
		let APP = dropdom,
			Self = APP.game,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "new-game":
				Arena.reset();
				Self.els.content.data({ show: "game-view" });
				// reset fx-layer
				FX.reset();
				setTimeout(() => Arena.insertRows(4), 500);
				break;
			case "game-over":
				// play sound effect
				window.audio.play("fail");
				// set FX layer to grayscale
				FX.grayscale = true;

				Self.els.board.removeClass("danger");
				Self.els.gameView
					.cssSequence("game-over busy", "transitionend", el => {
						// start trembling
						Self.els.board.addClass("tremble");

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
										Self.els.board.removeClass("tremble");

										setTimeout(() => {
											// reset FX layer
											FX.grayscale = false;
											// reset elements
											Self.els.gameView.removeClass("game-over busy");
											// transition sequence 2
											Self.dispatch({ type: "go-to-start-view" });
										}, 1000);
									}
								}
							});
						});
					});
				break;
			case "toggle-pause":
				value = Self.els.scores.hasClass("show-buttons");
				Self.els.scores.toggleClass("show-buttons", value);
				break;
			case "go-to-start-view":
				// go to game view
				APP.els.content.cssSequence("game-to-start", "transitionend", cEl => {
					cEl.data({ show: "start-view" })
						.cssSequence("appear-start", "transitionend", cEl => {
							// reset gmae view
							cEl.removeClass("game-to-start appear-start");
							// reset fx-layer
							FX.reset();
						});
				});
				break;
		}
	},
	doDrag(event) {
		let APP = dropdom,
			Self = APP.game,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// exit if game over
				if (Self.els.el.hasClass("game-over")) return;

				// sound effect
				window.audio.play("grab");

				let doc = $(document),
					cols = Self.els.columns,
					grid = parseInt(Self.els.gameView.cssProp("--sW"), 10),
					el = $(event.target).addClass("dragged"),
					offset = el.offset(".board"),
					// piece
					pX = +el.cssProp("--x"),
					pY = +el.cssProp("--y"),
					piece = Arena.getTrack(pX, pY),
					limit = {
						minX: (piece.minX * grid) + 5,
						maxX: (piece.maxX * grid) + 5,
					},
					click = {
						y: event.clientY,
						x: event.clientX,
					},
					cX = Math.round(offset.left / grid),
					cW = +el.prop("className").match(/tile \w+-(\d)/)[1];

				// drag details
				Self.drag = { doc, cols, colX: pX, el, grid, piece, offset, click, limit };

				// show show columns
				Self.drag.cols.css({ "--x": cX, "--w": cW }).removeClass("hidden");
				// cover app view
				Self.els.content.addClass("cover");
				// bind event handler
				Self.drag.doc.on("mousemove mouseup", Self.doDrag);
				break;
			case "mousemove":
				let left = Drag.offset.left + event.clientX - Drag.click.x;
				left = Math.max(Drag.limit.minX, Math.min(Drag.limit.maxX, left));
				Drag.el.css({ left });

				Drag.colX = Math.round(left / Drag.grid);
				Self.drag.cols.css({ "--x": Drag.colX });
				break;
			case "mouseup":
				// update arena matrix
				Arena.merge(Drag.piece.matrix, Drag.colX, Drag.piece.y);
				// Arena.matrix.map((row, i) => console.log( i, row.join(" ") ));

				// sound effect
				window.audio.play("drop");

				// piece was dragged
				let val = (+Self.drag.cols.cssProp("--x") * Drag.grid) + Drag.limit.minX;
				Drag.el.removeClass("dragged").css({ "--x": Drag.colX, left: "" });

				if (Drag.colX !== Drag.piece.x) {
					Arena.humanDrop();
				}

				// hide show columns
				Self.drag.cols.addClass("hidden");
				// uncover app view
				Self.els.content.removeClass("cover");
				// bind event handler
				Self.drag.doc.off("mousemove mouseup", Self.doDrag);
				break;
		}
	}
}
