
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

		// out.push(`<span class="tile blue-4" style="--x: 0; --y: 9;"></span>`);
		// out.push(`<span class="tile green-2" style="--x: 5; --y: 9;"></span>`);

		this.els.board.append(out.join(""));
	}
};
