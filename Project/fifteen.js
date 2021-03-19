(function() {	
	"use strict";
	var empty_x = 3;
	var empty_y = 3;
	var logStack = [];
	var logOn = false;
	// attaches a function to the calculate button
	window.onload = function () {
		addBlocks();
		document.getElementById("shufflebutton").onclick = shuffle;
		calcPermuation();
		document.getElementById("move_log").onclick = function() {
			if (logOn == false) {
				logOn = true;
			}
			else {
				logOn = false;
				log.innerHTML = "";
				inverseLog.innerHTML = "";
			}
		};
		document.addEventListener("keypress", event => {
			var log = document.getElementById("log");
			var inverseLog = document.getElementById("inverseLog")
			if (event.keyCode === 99 && logOn == true) {
				log.innerHTML = "";
				inverseLog.innerHTML = "";
			}
			if (event.keyCode === 32 && logOn == true) {
				log.innerHTML = log.innerHTML + " ";
				inverseLog.innerHTML = inverseLog.innerHTML + " ";
			}
		});
	};

	function addBlocks () {
		var container = document.getElementById("puzzlearea");
		for (var i = 0; i <= 14; i++) {
			var newDiv = document.createElement("div");
			newDiv.classList.add("puzzle");
			newDiv.id = ("puzzle" + i % 4 + "_" + Math.floor(i / 4));
			newDiv.onmouseover = isMovable;
			newDiv.onclick = move;
			newDiv.style.left = (i % 4) * 100 + "px";
			newDiv.style.top = Math.floor(i / 4) * 100 + "px";
			newDiv.style.backgroundPositionX = -(i % 4) * 100 + "px";
			newDiv.style.backgroundPositionY = -Math.floor(i / 4) * 100 + "px";
			container.appendChild(newDiv);
		}
		var newDiv = document.createElement("div");
		newDiv.classList.add("empty");
		newDiv.id = ("puzzle" + 3 + "_" + 3);
		newDiv.style.left = "300px";
		newDiv.style.top = "300px";
		container.appendChild(newDiv);
	}

	function isMovablePuzzle(id) {
		var movable_piece = ["puzzle" + (empty_x - 1) + "_" + empty_y,
							 "puzzle" + empty_x  + "_" + (empty_y - 1),
							 "puzzle" + (empty_x + 1) + "_" + empty_y,
							 "puzzle" + empty_x + "_" + (empty_y + 1)];
		for (var i = movable_piece.length - 1; i >= 0; i--) {
			if (movable_piece[i] == id) {
				document.getElementById(id).classList.add("movable");
				return true;
			}
		}
		document.getElementById(id).classList.remove("movable");
		return false;
	}

	function isMovable () {
		isMovablePuzzle(this.id);
	}

	function move() {
		movePuzzle(this);
	}

	function movePuzzle(puzzle) {
		if (isMovablePuzzle(puzzle.id)) {
			var empty = document.querySelector(".empty");
			empty.id = puzzle.id;
			puzzle.id = "puzzle" + empty_x + "_" + empty_y;
			var tempx = empty_x * 100 + "px";
			var tempy = empty_y * 100 + "px";
			empty_x = parseInt(puzzle.style.left) / 100;
			empty_y = parseInt(puzzle.style.top) / 100;
			empty.style.left = puzzle.style.left;
			empty.style.top = puzzle.style.top;
			puzzle.style.left = tempx;
			puzzle.style.top = tempy;
			calcPermuation();
			addLog(puzzle);
		}
	}

	function addLog(puzzle) {
		var direction = "";
		var inverseDirection = "";
		var empty = document.querySelector(".empty")
		if (puzzle.style.top == empty.style.top) {
			if (puzzle.style.left > empty.style.left) {
				direction = "R";
				inverseDirection = "L";
			}
			else {
				direction = "L";
				inverseDirection = "R";
			}
		}
		else {
			if (puzzle.style.top > empty.style.top) {
				direction = "D";
				inverseDirection = "U";
			}
			else {
				direction = "U"
				inverseDirection = "D";
			}
		}
		logStack.push(direction);

		if (logOn == true) {
			var log = document.getElementById("log")
			var inverseLog = document.getElementById("inverseLog")
			log.innerHTML = log.innerHTML + direction;
			inverseLog.innerHTML = inverseDirection + inverseLog.innerHTML;
		}
	}

	function shuffleMovePuzzle(puzzle) {
		if (isMovablePuzzle(puzzle.id)) {
			var empty = document.querySelector(".empty");
			empty.id = puzzle.id;
			puzzle.id = "puzzle" + empty_x + "_" + empty_y;
			var tempx = empty_x * 100 + "px";
			var tempy = empty_y * 100 + "px";
			empty_x = parseInt(puzzle.style.left) / 100;
			empty_y = parseInt(puzzle.style.top) / 100;
			empty.style.left = puzzle.style.left;
			empty.style.top = puzzle.style.top;
			puzzle.style.left = tempx;
			puzzle.style.top = tempy;
		}
	}

	function shuffle() {
		logStack.splice(0,logStack.length);		// empty log stack 

		for (var i = 150; i >= 0; i--) {
			var neighbors = [];
			var empty_neighbors = ["puzzle" + (empty_x - 1) + "_" + empty_y,
							 "puzzle" + empty_x  + "_" + (empty_y - 1),
							 "puzzle" + (empty_x + 1) + "_" + empty_y,
							 "puzzle" + empty_x + "_" + (empty_y + 1)];
			for (var j = empty_neighbors.length - 1; j >= 0; j--) {
				var puzzle = document.getElementById(empty_neighbors[j]);
				if (puzzle != null && isMovablePuzzle(empty_neighbors[j])) {
					neighbors.push(puzzle);
				}
			}
			var puzzleToMove = neighbors[parseInt(Math.random() * neighbors.length)];
			shuffleMovePuzzle(puzzleToMove);
		}

		/*var random_id = "";
		var puzzle_id = ["0_0", "0_1", "0_2", "0_3",
						 "1_0", "1_1", "1_2", "1_3", 
						 "2_0", "2_1", "2_2", "2_3", 
						 "3_0", "3_1", "3_2", "3_3"];
		for (var i = 0; i <= 15; i++) {
			random_id = puzzle_id[parseInt(Math.random() * puzzle_id.length)];
			puzzle_id.splice(puzzle_id.indexOf(random_id), 1);
			console.log(random_id);
			console.log(puzzle_id);
			document.getElementById("puzzle" + random_id).style.left = (i % 4) * 100 + "px";
			document.getElementById("puzzle" + random_id).style.top = Math.floor(i / 4) * 100 + "px";
			document.getElementById("puzzle" + random_id).id = "puzzle" + (i % 4).toString() + "_" + Math.floor(i / 4).toString();
			console.log((i % 4), Math.floor(i / 4));
		}*/
	}

	function calcPermuation() {
		var list = document.querySelectorAll(".puzzle");
		var puzzles = [];
		var remaining = [];
		for (var i = 0; i < list.length; i++) {
			puzzles.push(list[i]);
			remaining.push(i);
		}
		remaining.push(15);
		puzzles.push(document.querySelector(".empty"));
		var counter = puzzles.length;
		var start = 0;
		var cur = start;
		var result = "";
		do {
			result += "( ";
			do {
				counter --;
				remaining.splice(remaining.indexOf(cur), 1);
				cur = calcValue(puzzles[cur].id);
				result += cur + 1 + " ";
			} while (start != cur)
			result += ")";
			start = remaining[0];
			cur = start;
		} while (counter > 0)
		document.getElementById("permutation").innerText = result;
	}

	function calcValue(id) {
		return (parseInt(id.charAt(8))) * 4 + parseInt(id.charAt(6));
	}

}) ();