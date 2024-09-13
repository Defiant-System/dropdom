
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
					grid = 46,
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
				left = Math.max(Drag.limit.minX, Math.min(Drag.limit.maxX, left));
				Drag.el.css({ left });

				Drag.colX = Math.round(left / Drag.grid);
				Self.drag.cols.css({ "--x": Drag.colX });
				break;
			case "mouseup":
				if (Drag.colX === 4) {
					Drag.el.css({ "--x": "", left: 189 })
						.cssSequence("restore", "transitionend", el => {
							// reset element
							el.css({ "--x": 4, "--y": 4, left: "" });
						});
				} else {
					Drag.el.css({ "--x": "", left: 51 })
						.cssSequence("restore", "transitionend", el => {
							// reset element
							el.css({ "--x": 1, left: "" }).removeClass("restore");
						});
				}
				// reset elements
				Drag.el.removeClass("dragged");
				Self.els.tutorial.removeClass("busy");
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
