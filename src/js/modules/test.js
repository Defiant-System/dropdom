
let State = [
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// ["g31", "g32", "g33", 0, 0, 0, 0, 0],
		// ["g21", "g22", "b11", "r31", "r32", "r33", 0, 0],
		// [0, "c31", "c32", "c33", 0, "r21", "r22", 0],
		// ["g41", "g42", "g43", "g44", "b21", "b22", 0, 0],
		// ["o11", 0, "p41", "p42", "p43", "p44", "c21", "c22"],
		// ["p11", 0, 0, 0, "o21", "o22", "g21", "g22"],
		// ["g21", "g22", 0, "b11", "r21", "r22", "b11", 0],
		// ["p21", "p22", "r21", "r22", "g11", 0, "o11", 0],
		// ["g11", 0, "p21", "p22", "p21", "p22", "o21", "o22"],

		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, "c21", "c22"],
		[0, 0, 0, "r31", "r32", "r33", "r21", "r22"],
		["g31", "g32", "g33", 0, 0, "o21", "o22", 0],
		["b41", "b42", "b43", "b44", "b21", "b22", 0, 0],
		["b41", "b42", "b43", "b44", "r21", "r22", 0, 0],
		["g21", "g22", 0, "b11", "r21", "r22", 0, 0],

		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// ["g31", "g32", "g33", "r31", "r32", "r33", 0, 0],
		// ["g21", "g22", 0, "b11", "o21", "o22", "r21", "r22"],
		// ["b41", "b42", "b43", "b44", 0, "r21", "r22", 0],

		// ["g31", "g32", "g33", 0, 0, 0, 0, 0],
		// ["g21", "g22", 0, "r31", "r32", "r33", 0, 0],
		// [0, "r31", "r32", "r33", 0, "b21", "b22", "b11"],
	];


let Test = {
	init(APP) {

		// return;
		// APP.dispatch({ type: "start-game" });


		// setTimeout(() => {
		// 	// blast row(s) with effect
		// 	FX.blast(6, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// }, 800);


		APP.content.data({ show: "game-view" });
		Arena.matrix = State;
		Arena.draw();
		// Arena.drop();
		return;

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
