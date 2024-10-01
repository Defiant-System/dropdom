
let State = [
		// [0, 0, "g31", "g32", "g33", 0, 0, 0],
		// ["o31", "o32", "o33", 0, 0, 0, 0, 0],
		// ["g21", "g22", "b11", "r31", "r32", "r33", 0, 0],
		// [0, "c31", "c32", "c33", 0, "r21", "r22", 0],
		// ["g41", "g42", "g43", "g44", "b21", "b22", 0, 0],
		// ["o11", 0, "p41", "p42", "p43", "p44", "c21", "c22"],
		// ["p11", 0, 0, 0, "o21", "o22", "g21", "g22"],
		// ["g21", "g22", 0, "b11", "r21", "r22", "b11", 0],
		// ["p21", "p22", "r21", "r22", "g11", 0, "o11", 0],
		// ["g11", 0, "p21", "p22", "p21", "p22", "o21", "o22"],

		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, 0, 0],
		// [0, 0, 0, 0, 0, 0, "b21", "b22"],
		// [0, 0, 0, "p31", "p32", "p33", "r21", "r22"],
		// ["g21", "g22", "p11", 0, 0, 0, "c21", "c22"],
		// ["b41", "b42", "b43", "b44", 0, "b21", "b22", 0],
		// ["b41", "b42", "b43", "b44", "r21", "r22", 0, 0],
		// ["g21", "g22", 0, "b11", "r21", "r22", 0, 0],

		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		["o11", 0, "p41", "p42", "p43", "p44", "c21", "c22"],
		["b11", 0, "b11", 0, 0, "p21", "p22", 0],
		["b41", "b42", "b43", "b44", "o21", "o22", 0, 0],
		[0, "g31", "g32", "g33", 0, "r31", "r32", "r33"],
	];


let Test = {
	init(APP) {

		return;
		// return APP.game.dispatch({ type: "start-game" });

		// setTimeout(() => {
		// 	// blast row(s) with effect
		// 	//FX.blast(6, ["g", 0, 0, 0, 0, 0, 0, "o"]);
		// 	FX.blast(0, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// 	FX.blast(1, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// 	FX.blast(2, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// 	FX.blast(3, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// 	FX.blast(4, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// 	// FX.electify(130, 350, 250, 350);
		// }, 800);
		// return;


		// setTimeout(() => {
		// 	APP.dispatch({ type: "add-score", value: 8 });
		// }, 1000);


		// setTimeout(() => {
		// 	Arena.insertRows();
		// }, 1000);


		// setTimeout(() => {
		// 	APP.els.content.find(".combo").addClass("show");
		// }, 1000);


		APP.els.content.data({ show: "game-view" });
		// reset fx-layer
		FX.reset();
		Arena.matrix = State;
		// Pipeline[0] = ["b11", "b11", "b11", "b11", "b11", "b11", "b11", "b11"];
		// Pipeline[0] = [0, 0, "c31", "c32", "c33", "b21", "b22", 0];
		Arena.draw();

	}
};
