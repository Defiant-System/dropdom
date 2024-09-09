
// dropdom.game

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".game-view"),
			board: window.find(".board"),
			columns: window.find(".columns"),
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
			case "set-opponents":
				// reset seats
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

				let doc = Self.els.doc,
					cols = Self.els.columns,
					grid = 55,
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

				// piece was dragged
				if (Drag.colX !== Drag.piece.x) {
					let val = (+Self.drag.cols.cssProp("--x") * Drag.grid) + Drag.limit.minX;
					Drag.el.removeClass("dragged").css({ "--x": Drag.colX, left: "" });

					Arena.drop(true);
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
