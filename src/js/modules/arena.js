
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
	merge(piece, x, y) {
		piece.map((c, i) => {
			this.matrix[y][x+i] = c;
		});
	},
	getPiece(x, y) {
		let col = this.matrix[y][x],
			[c,s,p] = col.split("").map(i => i == +i ? +i : i),
			piece = [];
		for (let i=0; i<s; i++) {
			let ix = i + x - p + 1;
			piece.push(this.matrix[y][ix]);
			this.matrix[y][ix] = 0;
		}
		return piece;
	}
};
