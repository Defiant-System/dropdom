
let State = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, "r41", "r42", "r43", "r44", "p31", "p32", "p33"],
		[0, "p11", "r11", 0, "o31", "o32", "o33", 0],
		[0, "g31", "g32", "g33", 0, 0, "c21", "c22"],
		["b41", "b42", "b43", "b44", 0, "r21", "r22", 0],
	];

let Test = {
	init(APP) {
		Arena.draw(State);

		return;
		setTimeout(() => {
			let piece = Arena.getPiece(3, 9);
			// Arena.getPiece(6, 9);
			Arena.merge(piece, 1, 9);
			// Arena.matrix.map((row, i) => console.log( i, row.join(" ") ));

			Arena.draw();
		}, 1500);
	}
};
