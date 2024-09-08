
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

				let doc = Self.els.doc,
					cols = Self.els.columns,
					grid = 55,
					el = $(event.target).addClass("dragged"),
					offset = el.offset(".board"),
					click = {
						y: event.clientY,
						x: event.clientX,
					},
					limit = {
						minX: 5,
						maxX: +el.parent().prop("offsetWidth") - el.width() - 5,
					},
					cX = Math.round(offset.left / grid),
					cW = +el.prop("className").match(/tile \w+-(\d)/)[1],
					// piece
					pX = +el.cssProp("--x"),
					pY = +el.cssProp("--y"),
					piece = {
						matrix: Arena.getPiece(pX, pY),
						x: pX,
						y: pY,
					};
				// drag details
				Self.drag = { doc, cols, el, grid, piece, offset, click, limit };

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

				let val = (+Self.drag.cols.cssProp("--x") * Drag.grid) + Drag.limit.minX;
				Drag.el.removeClass("dragged").css({ left: val });

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
