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

	// Initialization
	// Add tiles to the board
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

	function shuffle() {
		// Clear out the log stack
		logStack.splice(0, logStack.length)

		let permutation = {}	// Permutation of the puzzle
		let tiles = []			// Tiles to be used
		let boxes = []			// Available boxes
		for (let i = 0; i < 16; i++) {
			permutation[i] = i
			tiles.push(i)
			boxes.push(i)
		}

		// Put the first 14 tiles randomly into the boxes
		for (let i = 0; i < 14; i++) {
			// Take the first tile, and remove it from the array
			let tileNum = tiles.shift()

			// Ramdonly select a box
			let boxNum = boxes[Math.floor(Math.random() * boxes.length)]

			// Remove the box from the array
			// i.e., mark it as unavailable
			boxes.splice(boxes.indexOf(boxNum), 1)

			// Put the tile into the ramdonly selected box
			let box = document.getElementById("puzzlearea").children[boxNum]
			permutation[boxNum] = tileNum	// Update permutation
			// Update the graphical representation
			box.id = num2puzzleID(tileNum)
			box.style.backgroundPositionX = -(tileNum % 4) * 100 + "px"
			box.style.backgroundPositionY = -Math.floor(tileNum / 4) * 100 + "px"
			box.className = "puzzle"
		}

		// For the 15th tile, we put it into one of the two remaining
		// available boxes based on solvability of the puzzle.
		permutation[boxes[0]] = tiles[0]
		permutation[boxes[1]] = tiles[1]
		let tileNum = tiles.shift()	// The final non-empty tile (i.e., tile 15)
		let box = document.getElementById("puzzlearea").children[boxes[0]]
		if (isEven(permutation)) {	// Solvable
			// Put the final non-empty tile into the FIRST available box
			console.log("Even")
			// Take the first available box
			box = document.getElementById("puzzlearea").children[boxes[0]]
			boxes.shift()	// Pop out the occupied box
		} else {	// Odd permutation -- not solvable in the current setting
			// Put the final non-empty tile into the SECOND available 
			// box to make it an even permutation.
			console.log("Odd")
			// Take the second available box
			box = document.getElementById("puzzlearea").children[boxes[1]]
			boxes.pop()		// Pop out the occupied box
		}
		// Update the graphical representation
		box.id = num2puzzleID(tileNum)
		box.style.backgroundPositionX = -(tileNum % 4) * 100 + "px"
		box.style.backgroundPositionY = -Math.floor(tileNum / 4) * 100 + "px"


		// Lastly, place the empty tile and update the related class names
		console.log(boxes)
		tileNum = tiles.shift()
		box = document.getElementById("puzzlearea").children[boxes[0]]
		box.id = num2puzzleID(tileNum)
		box.className = "empty"
		empty_x = Math.floor(boxes[0] / 4)
		empty_y = boxes[0] % 4

		// Set tiles around the empty tile to be movable
		let row = Math.floor(boxes[0] / 4)
		let col = boxes[0] % 4
		let tiles_to_check = [
			[row - 1, col], 
			[row, col - 1], 
			[row, col + 1], 
			[row + 1, col]
		]
		console.log(row, col)
		for (const [r, c] of tiles_to_check) {
			if (0 <= r && r < 4 && 0 <= c && c < 4) {
				console.log(r, c)
				let box = document.getElementById("puzzlearea").children[r * 4 + c]
				console.log(box)
				box.onmouseover = isMovable
			}
		}
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
				cur = puzzleID2num(puzzles[cur].id);
				result += cur + 1 + " ";
			} while (start != cur)
			result += ")";
			start = remaining[0];
			cur = start;
		} while (counter > 0)
		document.getElementById("permutation").innerText = result;
	}

	// Convert a puzzle id into a 0-indexed number
	function puzzleID2num(id) {
		return (parseInt(id.charAt(8))) * 4 + parseInt(id.charAt(6));
	}

	// Convert a 0-indexed number to a string formated puzzle id
	function num2puzzleID(num) {
		let row = Math.floor(num / 4)
		let col = num % 4
		return "puzzle" + row.toString() + '_' + col.toString()
	}

	// Given a permutation in object form, return true if
	// the permutation is even
	function isEven(permutation) {
		/* Use BFS to explore the permutation / map */

		let visited = {}
		for (let i = 0; i < 16; i++) {
			visited[i] = false
		}

		let num_of_2_cycle = 0	// Number of 2-cycles
		for (let i = 0; i < 16; i++) {
			if (!visited[i]) {
				let queue = [i]
				while (queue.length > 0) {
					let curr = queue.shift()
					visited[curr] = true
					if (!visited[curr]) {
						queue.push(permutation[curr])
						num_of_2_cycle++
					}
				}
			}
		}

		// Testing: if not all nodes are visited, 
		// it is an invalid permutation
		if (!Object.values(visited).reduce((x, y) => {
			return x && y
		}, true)) {
			console.log("isEven: Invalid permutation!")
			console.log(permutation)
			console.log(visited)
		}

		return num_of_2_cycle % 2 === 0
	}

}) ();