
let Arena = {
	init() {
		// fast references
		this.els = {};
		this.els.board = window.find(".board");

		this.matrix = this.createMatrix(8, 10);
	},
	createMatrix(w, h) {
		let matrix = [];
		while (h--) {
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	},
	draw(matrix) {
		// if no args, draw arena matrix
		matrix = matrix || this.matrix;
		// clean up
		this.els.board.find(".tile").remove();

		let palette = {
				b: "blue",
				g: "green",
				r: "red",
				p: "purple",
				o: "orange",
				c: "colors",
			};

		let out = [];
		matrix.map((row, y) => {
			row.map((col, x) => {
				if (col === 0) return;
				let [c,s,p] = col.split("");
				if (p === "1") {
					out.push(`<span class="tile ${palette[c]}-${s}" style="--x: ${x}; --y: ${y};"></span>`);
				}
			});
		});
		this.els.board.append(out.join(""));

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
		for (let y=0, yl=this.matrix.length; y<yl; y++) {
			for (let x=0; x<8; x++) {
				let col = this.matrix[y][x];
				if (col === 0) continue;

				let piece = this.getPiece(x, y, true);
				if (piece.s) x += piece.s;

				for (let t=y; t<yl+1; t++) {
					if (this.collisionCheck(piece, { x: piece.x, y: t })) {
						Arena.merge(piece.matrix, piece.x, t-1);
						break;
					}
				}
			}
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
