
let NewRows = [
		["b41", "b42", "b43", "b44", 0, "r21", "r22", 0],
		[0, "o31", "o32", "o33", 0, "b21", "b22", 0],
		[0, "g41", "g42", "g43", "g44", 0, "o21", "o22"],
		["o11", 0, "p41", "p42", "p43", "p44", "g21", "g22"],
		["p11", 0, 0, "b11", "o21", "o22", "b21", "b22"],
		["g11", 0, "b21", "b22", "r21", "r22", "b11", 0],
		["g21", "g22", 0, "b11", "r21", "r22", 0, 0],
		["p21", "p22", "r21", "r22", "g11", 0, "o11", 0],
		["g11", 0, "p21", "p22", "p21", "p22", "o21", "o22"],
		["o21", "o22", 0, "g11", "p21", "p22", 0, 0],
	];

let Pipeline = [];


let Arena = {
	dim: { w: 8, h: 10 },
	palette: {
		b: "blue",
		g: "green",
		r: "red",
		p: "purple",
		o: "orange",
		c: "colors",
	},
	init() {
		// fast references
		this.els = {
			board: window.find(".board"),
			rows: window.find(".wrapper .rows"),
			preview: window.find(".preview"),
		};
		// prepare arena matrix
		this.matrix = this.createMatrix(this.dim.w, this.dim.h);
		// new rows pipeline
		this.refillPreview();
	},
	createMatrix(w, h) {
		let matrix = [];
		while (h--) {
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	},
	updatePreview() {
		let row = Pipeline[0],
			out = [];
		row.map((col, x) => {
			if (col) {
				let [c,s,p] = col.split("");
				if (p === "1") {
					out.push(`<span class="t${s}" style="--x: ${x};"></span>`);
				}
			}
		});
		this.els.preview.html(out.join());
		// add more to pipeline if needed
		if (Pipeline.length < 2) this.refillPreview();
	},
	refillPreview() {
		let nr = NewRows.map(r => [...r]);
		for (let i=0, il=nr; i<il; ++i) {
			let j = i + Utils.random(il - i);
			let tmp = nr[i];
			nr[i] = nr[j];
			nr[j] = tmp;
		}
		Pipeline = Pipeline.concat(nr);
	},
	addRows(i=1) {
		let row = Pipeline.shift();
		// make "rainbow" if "lucky"
		if (Utils.random(0, 50) < 6) {
			let pieces = [];
			row.map((col, x) => {
				if (col) {
					let [c,s,p] = col.split("").map(i => i == +i ? +i : i);
					if (p === 1) pieces[x] = col;
				}
			});
			pieces = pieces.filter(i => !!i);
			let select = pieces[Utils.random(0, pieces.length)],
				done = +select.split("")[1];
			// make rainbow
			row.map((col, x) => {
				if (col && col.startsWith(select.slice(0,2)) && done) {
					row[x] = `c${col.slice(1)}`;
					done--;
				}
			});
		}

		// add new row
		this.matrix.push(row);
		// re-draw arena
		this.draw();

		this.els.rows.cssSequence("add-row", "transitionend", el => {
			// remove top row
			let out = this.matrix.shift();

			// reset rows element
			el.removeClass("add-row");
			// "pull up" tiles
			el.find(".tile").map(elem => {
				let tEl = $(elem),
					tY = +tEl.cssProp("--y") - 1;
				tEl.css({ "--y": tY });
			});

			this.drop();

			let free = this.matrix.findIndex(r => r.reduce((a,c) => a + c, 0) !== 0);
			this.els.board.toggleClass("danger", free > 1);

			if (free === 0) dropdom.dispatch({ type: "game-over" });
			else if (i > 1) setTimeout(() => this.addRows(i-1), 250);
		});
	},
	deleteRows(rows) {
		rows.map(y => {
			[...Array(this.dim.w)].map((e, x) => {
				this.matrix[y][x] = 0;
			});
		});
		// update arena
		this.draw();
		// drop rows
		setTimeout(() => this.drop(), 150);
	},
	draw(vdom) {
		let out = [];
		this.matrix.map((row, y) => {
			row.map((col, x) => {
				if (col === 0) return;
				let oY;
				if (col.includes("-")) {
					oY = +col.split("-")[1];
					col = col.split("-")[0];
				}
				let [c,s,p] = col.split("");
				if (p === "1") {
					out.push(`<span class="tile ${this.palette[c]}-${s}" style="--x: ${x}; --y: ${y}; ${oY !== undefined ? `--oY: ${oY};` : ""}"></span>`);
				}
				// removes "oY" from matrix
				row[x] = col;
			});
		});
		if (vdom) {
			return $(out.join(""));
		} else {
			// clean up
			this.els.rows.find(".tile").remove();
			this.els.rows.append(out.join(""));
		}
		// update preview row
		this.updatePreview();
	},
	collisionCheck(piece, o) {
		let m = piece.matrix;
		for (let x=0; x<piece.s; x++) {
			if ((this.matrix[o.y] && this.matrix[o.y][x + o.x]) !== 0) {
				return true;
			}
		}
		return false;
	},
	drop(doAdd) {
		for (let yl=this.matrix.length-1, y=yl; y>-1; y--) {
			for (let x=0; x<8; x++) {
				let col = this.matrix[y][x];
				if (col === 0) continue;

				let piece = this.getPiece(x, y);
				if (piece.s) x += piece.s - 1;

				for (let t=piece.y; t<yl+1; t++) {
					let check = this.collisionCheck(piece, { x: piece.x, y: t+1 });
					if (check) {
						piece = this.getPiece(piece.x, piece.y, true);
						this.merge(piece.matrix, piece.x, t, piece.y);
						break;
					}
				}
			}
		}
		// update arena
		this.syncAnim(doAdd);
	},
	syncAnim(doAdd) {
		let count = 0,
			tiles = this.draw(true).reverse();

		// create virtual dom + make comparison + animate ?
		tiles.map((vTile, i) => {
			let props = vTile.getAttribute("style"),
				x = +props.match(/--x: (\d);/)[1],
				y = +props.match(/--y: (\d);/)[1],
				oY = +props.match(/--oY: (\d);/)[1],
				tile = this.els.rows.find(`.${vTile.className.split(" ").join(".")}[style^="--x: ${x}; --y: ${oY};"]:not(.smooth-drop)`);
			
			if (y === oY) return;
			count++;
			tile.css({ "--y": y }).cssSequence("smooth-drop", "transitionend", tile => {
				// reset tile
				tile.removeClass("smooth-drop");
				// is last ?
				if (count-- > 1) return;
				this.clearAdd(doAdd);
			});
		});
		// if nothing is "drop"
		if (count === 0 && doAdd) this.clearAdd(doAdd);
	},
	clearAdd(doAdd) {
		let clear = [];
		this.matrix.map((row, y) => {
			let remove = true;
			row.map(c => remove = remove && !!c);
			if (remove) clear.unshift(y);
		});
		
		if (clear.length) {
			setTimeout(() => this.deleteRows(clear), 200);
		}
		// add rows if user made drag'n drop
		if (doAdd) this.addRows();
	},
	merge(piece, x, nY, oY) {
		piece.map((c, i) => {
			if (oY !== undefined) {
				c += `-${oY}`;
			}
			this.matrix[nY][x+i] = c;
		});
	},
	getTrack(x, y) {
		let piece = this.getPiece(x, y, true),
			minX = 0,
			maxX = 8;
		for (let i=x; i>-1; i--) {
			let c = this.matrix[y][i];
			if (c === 0) minX = i;
			else break;
		}
		for (let i=x; i<9; i++) {
			let c = this.matrix[y][i];
			if (c === 0) maxX = i;
			else break;
		}
		maxX -= piece.s - 1;
		return { minX, maxX, ...piece };
	},
	getPiece(x, y, detach) {
		let col = this.matrix[y][x],
			[c,s,p] = col.split("").map(i => i == +i ? +i : i),
			matrix = [];
		for (let i=0; i<s; i++) {
			let ix = i + x - p + 1;
			matrix.push(this.matrix[y][ix]);
			if (detach) this.matrix[y][ix] = 0;
		}
		return { c, s, p, x, y, matrix };
	}
};
