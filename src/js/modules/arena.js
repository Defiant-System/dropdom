
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
		};

		this.matrix = this.createMatrix(this.dim.w, this.dim.h);
	},
	createMatrix(w, h) {
		let matrix = [];
		while (h--) {
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	},
	addRows(i=1) {
		let row = [...NewRows[Utils.random(0, NewRows.length)]];
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
			let out = this.matrix.shift(),
				// gameOver = !(out.reduce((a,c) => a + c, 0) === 0),
				free = this.matrix.findIndex(r => r.reduce((a,c) => a + c, 0) !== 0);

			// reset rows element
			el.removeClass("add-row");
			// "pull up" tiles
			el.find(".tile").map(elem => {
				let tEl = $(elem),
					tY = +tEl.cssProp("--y") - 1;
				tEl.css({ "--y": tY });
			});

			this.els.board.toggleClass("danger", free > 2);

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
		Arena.draw();
		// drop rows
		setTimeout(() => this.drop(), 500);
	},
	draw(matrix) {
		// if no args, draw arena matrix
		matrix = matrix || this.matrix;
		// clean up
		this.els.rows.find(".tile").remove();

		let out = [];
		matrix.map((row, y) => {
			row.map((col, x) => {
				if (col === 0) return;
				let [c,s,p] = col.split("");
				if (p === "1") {
					out.push(`<span class="tile ${this.palette[c]}-${s}" style="--x: ${x}; --y: ${y};"></span>`);
				}
			});
		});
		this.els.rows.append(out.join(""));

		// update internal matrix
		this.matrix = matrix;
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
	drop() {
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
						Arena.merge(piece.matrix, piece.x, t);
						break;
					}
				}
			}
		}
		// update arena
		Arena.draw();

		let clear = [];
		this.matrix.map((row, y) => {
			let remove = true;
			row.map(c => remove = remove && !!c);
			if (remove) clear.unshift(y);
		});
		
		if (clear.length) {
			console.log("clear", clear);
			setTimeout(() => this.deleteRows(clear), 500);
		}
	},
	merge(piece, x, y) {
		piece.map((c, i) => {
			this.matrix[y][x+i] = c;
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
