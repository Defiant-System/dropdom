
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
		// [0, 0, 0, 0, 0, 0, "c21", "c22"],
		// [0, 0, 0, "p31", "p32", "p33", "r21", "r22"],
		// ["g31", "g32", "g33", 0, 0, "o21", "o22", 0],
		// ["b41", "b42", "b43", "b44", "b21", "b22", 0, 0],
		// ["b41", "b42", "b43", "b44", "r21", "r22", 0, 0],
		// ["g21", "g22", 0, "b11", "r21", "r22", 0, 0],

		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		["b11", 0, 0, 0, 0, 0, 0, 0],
		["b11", 0, "b11", 0, "p21", "p22", 0, 0],
		["c41", "c42", "c43", "c44", 0, "c21", "c22", 0],
		[0, "g31", "g32", "g33", 0, "r31", "r32", "r33"],
	];


let Test = {
	init(APP) {

		// setTimeout(() => {
		// 	APP.els.content.cssSequence("start-to-game", "transitionend", el => {
		// 		el.data({ show: "game-view" })
		// 			.cssSequence("appear-game", "transitionend", el => {
		// 				el.removeClass("start-to-game appear-game");
		// 			});
		// 	});
		// }, 500);

		// APP.els.content.data({ show: "game-view" })
		// setTimeout(() => {
		// 	APP.els.content.cssSequence("game-to-start", "transitionend", el => {
		// 		el.data({ show: "start-view" })
		// 			.cssSequence("appear-start", "transitionend", el => {
		// 				el.removeClass("game-to-start appear-start");
		// 			});
		// 	});
		// }, 500);

		return;
		return APP.dispatch({ type: "start-game" });

		// setTimeout(() => {
		// 	// blast row(s) with effect
		// 	//FX.blast(6, ["g", 0, 0, 0, 0, 0, 0, "o"]);
		// 	FX.blast(6, ["g", "g", "r", "r", "r", "b", "b", "o"]);
		// }, 800);


		setTimeout(() => {
			APP.dispatch({ type: "add-score", value: 8 });
		}, 1000);

		Pipeline[0] = ["c31", "c32", "c33", "b21", "b22", 0, 0, 0];

		APP.els.content.data({ show: "game-view" });
		Arena.matrix = State;
		Arena.draw();

		// return setTimeout(() => {
		// 	Arena.checkDanger();
		// }, 500);

	}
};
