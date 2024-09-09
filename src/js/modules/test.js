
let State = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		["b11", 0, 0, "r31", "r32", "r33", 0, 0],
		["b41", "b42", "b43", "b44", 0, 0, 0, 0],
		[0, "g31", "g32", "g33", 0, 0, 0, 0],
		["b41", "b42", "b43", "b44", "r21", "r22", 0, "b11"],
	];

/*
State = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, "c21", "c22"],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	];
*/

/*
State = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		["b31", "b32", "b33", 0, "r21", "r22", 0, 0],
	];
*/

let Test = {
	init(APP) {

		// return;

		// return setTimeout(() => {
		// 	Arena.addRow(1);
		// });

		Arena.matrix = State;
		Arena.draw();
		// Arena.drop();
		return;

		return setTimeout(() => {
			Arena.addRows(4);
		}, 500);

		setTimeout(() => {
			// let piece = Arena.getPiece(3, 9);
			// Arena.merge(piece.matrix, 1, 9);

			// let piece = Arena.getPiece(5, 9);
			// Arena.merge(piece.matrix, 5, 9);

			// let track = Arena.getTrack(0, 9);
			// let track = Arena.getTrack(6, 9);
			// console.log(track);
			// Arena.getPiece(6, 9);
			// Arena.matrix.map((row, i) => console.log( i, row.join(" ") ));
		}, 1000);
	}
};
