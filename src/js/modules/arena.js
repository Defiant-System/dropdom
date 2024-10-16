
let NewRows = [
		["b41", "b42", "b43", "b44", 0, "r21", "r22", 0],
		[0, "o31", "o32", "o33", 0, "b21", "b22", 0],
		[0, "g41", "g42", "g43", "g44", 0, "o21", "o22"],
		["o11", 0, "p41", "p42", "p43", "p44", "g21", "g22"],
		["p11", 0, 0, "b11", "o21", "o22", "b21", "b22"],
		["g11", 0, "b21", "b22", "r21", "r22", "b11", 0],
		["g21", "g22", 0, "b11", "r21", "r22", 0, 0],
		[0, "b21", "b22", 0, 0, "p21", "p22", 0],
		[0, 0, "b21", "b22", 0, "p21", "p22", 0],
		[0, "b31", "b32", "b33", 0, "p21", "p22", 0],
		[0, "g31", "g32", "g33", 0, "p31", "p32", "p33"],
		["b41", "b42", "b43", "b44", 0, "p31", "p32", "p33"],
		["p21", "p22", "r21", "r22", "g11", 0, "o11", 0],
		["g11", 0, "p21", "p22", "g21", "g22", "o21", "o22"],
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
			gameView: window.find(".game-view"),
			rows: window.find(".wrapper .rows"),
			points: window.find(".points"),
			combo: window.find(".combo"),
			preview: window.find(".preview"),
		};
		// reset all
		this.reset();
	},
	logMatrix() {
		// output arena rows
		this.matrix.map((row, i) => console.log( i, row.join(" ") ));
	},
	reset() {
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
	refillPreview() {
		let nr = NewRows.map(r => [...r]);
		for (let i=nr.length-1; i>0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[nr[i], nr[j]] = [nr[j], nr[i]];
		}
		// nr.map((row, i) => console.log( i, row.join(" ") ));
		Pipeline = Pipeline.concat(nr);
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

		// update "next" preview
		this.updatePreview();

		if (vdom) {
			return $(out.join(""));
		} else {
			// clean up
			this.els.rows.find(".tile").remove();
			this.els.rows.append(out.join(""));
		}
	},
	humanDrop() {
		// reset combo
		this._score = 0;
		this._combo = 0;
		// "lock" ui/ux
		this.els.gameView.addClass("busy");
		// count score
		this.drop();
	},
	drop(noInsert) {
		for (let yl=this.matrix.length-1, y=yl; y>-1; y--) {
			for (let x=0, xl=this.matrix[y].length; x<xl; x++) {
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
		// smoot drop tiles
		let count = 0;
		// get updated arena DOM fragment
		this.draw(true).reverse()
			.map((vTile, i) => {
				let props = vTile.getAttribute("style");
				if (props.match(/--x: (\d);/) == null) return;
				let x = +props.match(/--x: (\d);/)[1],
					y = +props.match(/--y: (\d+);/)[1],
					oY = +props.match(/--oY: (\d+);/)[1],
					tile = this.els.rows.find(`.${vTile.className.split(" ").join(".")}[style^="--x: ${x}; --y: ${oY};"]:not(.smooth-drop)`);
				
				if (y === oY) return;
				count++;
				tile.css({ "--y": y }).cssSequence("smooth-drop", "transitionend", tile => {
					// reset tile
					tile.removeClass("smooth-drop");
					// is last ?
					if (count-- > 1) return;
					// "unlock" ui/ux
					this.els.gameView.removeClass("busy");
					// make sure to clean up
					this.els.rows.find(".smooth-drop").removeClass("smooth-drop");
					// clear tiles, if need be
					setTimeout(() => this.clear(noInsert), 250);
				});
			});
		// if nothing is "dropped"
		if (count === 0 && !this.els.gameView.hasClass("game-over")) {
			if (noInsert) {
				// "unlock" ui/ux
				this.els.gameView.removeClass("busy");
				// make sure to clean up
				this.els.rows.find(".smooth-drop").removeClass("smooth-drop");
			} else {
				this.insertRows();
			}
		}
	},
	clear(noInsert) {
		let APP = dropdom,
			rows = {},
			count = 0,
			pause = false,
			finish = () => {
				if (this.els.gameView.hasClass("game-over")) return;
				this.els.points.html(this._score);
				this.els.points.cssSequence("show", "animationend", el => {
						// reset element
						el.html("").removeClass("show");
						// update score row
						APP.dispatch({ type: "add-score", value: this._score });
					});
				
				// shows combo
				if (this._combo > 1) {
					this.els.combo
						.html(this._combo)
						.cssSequence("show", "animationend", el => {
							// reset element
							el.html("").removeClass("show");
						});
				}

				setTimeout(() => delete this._to, 5e2);
				this.deleteRows(rows);
				this.els.gameView.removeClass("busy");
				// make sure to clean up
				this.els.rows.find(".smooth-drop").removeClass("smooth-drop");
				// restore view
				APP.els.content.removeClass("electrify");
			};

		this.matrix.map((row, y) => {
			let remove = true;
			row.map(c => remove = remove && !!c);
			if (remove) {
				// fx row
				rows[y] = this.matrix[0].map((e, x) => this.matrix[y][x].slice(0,1));
				// add to score
				this._score += 8;
			};
		});

		if (noInsert && !Object.keys(rows).length && this._combo > 1) {
			// update score row
			APP.dispatch({ type: "add-score", value: this._score * (this._combo - 1) });
		}

		if (Object.keys(rows).length) {
			// add to combo
			this._combo++;

			Object.keys(rows).map(y => {
				let rp = this.getRowPieces(+y);
				Object.keys(rp).map(k => {
					let piece = rp[k];
					if (piece.c === "c") {
						let ns = this.getNeighbours(piece),
							nA = Object.keys(ns);

						// restore view
						APP.els.content.addClass("electrify");

						nA.map((key, i) => {
							let rPiece = ns[key];
							// add to score
							this._score += rPiece.s;
							// remove piece from board
							this.clearPiece(rPiece);

							this.els.rows
								.find(`.tile[style^="--x: ${rPiece.x}; --y: ${rPiece.y};"]`)
								.cssSequence("flash", "transitionend", el => {
									// delete element
									el.remove();
									// explode neighbour piece
									let row = [0, 0, 0, 0, 0, 0, 0, 0];
									for (let l=0; l<rPiece.s; l++) {
										row[rPiece.x + l] = rPiece.c;
									}
									// blast row
									FX.blast(rPiece.y, row);

									if (i < nA.length-1 || this._to) return;
									// "unlock" ui/ux
									this.els.gameView.removeClass("busy");
									// make sure to clean up
									this.els.rows.find(".smooth-drop").removeClass("smooth-drop");
									// final to-do's
									this._to = setTimeout(() => finish(), 1e2);
								});
						});
						// electrify tile
						let cEl = this.els.rows.find(`.tile.colors-${piece.s}[style^="--x: ${piece.x}; --y: ${piece.y};"]`),
							cOffset = cEl.offset(),
							x1 = 23 + cOffset.left,
							x2 = 23 + cOffset.left + cOffset.width,
							my = cOffset.top + (cOffset.height >> 1);
						FX.electify(x1, my, x2, my);
						
						// if there is no neighbour pieces
						if (!nA.length && !this._to) {
							this._to = setTimeout(() => finish(), 12e2);
						}

						pause = true;
					}
				});
			});

			if (pause) return;
			// final to-do's
			return finish();

		} else if (count === 0) {
			// console.log("insert row 2");
			if (!noInsert) {
				let minStack = this.matrix.findIndex(r => r.reduce((a,c) => a + c, 0) !== 0) - 6;
				if (minStack < 1) minStack = 1;
				this.insertRows(minStack);
			} else if (!this.els.gameView.hasClass("game-over")) {
				// "lock" ui/ux
				this.els.gameView.removeClass("busy");
				// make sure to clean up
				this.els.rows.find(".smooth-drop").removeClass("smooth-drop");
			}
		}
	},
	insertRows(i=1) {
		let row = Pipeline.shift();
		// make "rainbow" if "lucky"
		if (Utils.randomInt(0, 50) < 6) {
			let pieces = [];
			row.map((col, x) => {
				if (col) {
					let [c,s,p] = col.split("").map(i => i == +i ? +i : i);
					if (p === 1) pieces[x] = col;
				}
			});
			pieces = pieces.filter(i => !!i);
			let select = pieces[Utils.randomInt(0, pieces.length)],
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
		let vdom = this.draw(true);
		vdom.map((vTile, i) => {
			let props = vTile.getAttribute("style");
			if (props.match(/--x: (\d);/) == null) return;
			let x = +props.match(/--x: (\d);/)[1],
				y = +props.match(/--y: (\d+);/)[1];
			if (y < 10) return;
			this.els.rows.append(vTile);
		});

		// overflow hidden
		this.els.gameView.addClass("busy");
		this.els.rows.cssSequence("add-row", "transitionend", el => {
			// overflow hidden
			this.els.gameView.removeClass("busy");
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

			this.checkDanger();
			if (i > 1) {
				setTimeout(() => this.insertRows(i-1), 150);
			} else {
				setTimeout(() => this.drop(true), 10); // no insert
			}
		});
	},
	deleteRows(rows) {
		let count = 0;

		Object.keys(rows).map(y => {
			this.matrix[0].map((e, x) => {
				let col = this.matrix[y][x];
				if (col && col.endsWith("1")) {
					let [c,s,p] = col.split(""),
						tile = this.els.rows.find(`.tile.${this.palette[c]}-${s}[style*="--x: ${x}; --y: ${y};"]`);
					count++;
					// remove element from DOM
					tile.cssSequence("clear-tile", "transitionend", tEl => {
						tEl.remove();
						if (count-- > 1) return;
						setTimeout(() => this.drop(), 10);
					});
				}
				this.matrix[y][x] = 0;
			});
			// explode row cells
			FX.blast(y, rows[y]);
		});

		// sound effect
		window.audio.play("line");
	},
	checkDanger() {
		let free = this.matrix.findIndex(r => r.reduce((a,c) => a + c, 0) !== 0);
		if (free < 0) free = 9;
		this.els.board.toggleClass("danger", free > 1);
		if (free === 0) dropdom.game.dispatch({ type: "game-over" });
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
	merge(piece, x, nY, oY) {
		piece.map((c, i) => {
			if (oY !== undefined) {
				c += `-${oY}`;
			}
			this.matrix[nY][x+i] = c;
		});
	},
	clearPiece(piece) {
		for (let l=piece.x; l<piece.x + piece.s; l++) {
			this.matrix[piece.y][l] = 0;
		}
	},
	getRowPieces(y) {
		let pieces = {};
		this.matrix[y].map((col, x) => {
			let piece = this.getPiece(x, y);
			if (!piece) return;
			piece.x -= piece.p - 1;
			delete piece.p;
			pieces[JSON.stringify(piece)] = piece;
		});
		return pieces;
	},
	getNeighbours(piece) {
		let neighbours = {};
		for (let l=piece.x; l<piece.x + piece.s; l++) {
			let above = this.getPiece(l, piece.y-1),
				below = this.getPiece(l, piece.y+1);
			if (above) {
				above.x -= above.p - 1;
				delete above.p;
				neighbours[JSON.stringify(above)] = above;
			}
			if (below) {
				below.x -= below.p - 1;
				delete below.p;
				neighbours[JSON.stringify(below)] = below;
			}
		}
		return neighbours;
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
		if (piece) maxX -= piece.s - 1;
		return { minX, maxX, ...piece };
	},
	getPiece(x, y, detach) {
		if (!this.matrix[y] || !this.matrix[y][x]) return;
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
