(function() {
	"use strict";

	// Location of the empty tile
	var empty_x = 3;
	var empty_y = 3;

	// Stack for move log
	var logStack = [];

	// Switch of move log
	var logOn = false;

	// attaches a function to the calculate button
	window.onload = function() {
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

	// Initialization -- Add tiles to the board
	function addBlocks() {
		let container = document.getElementById("puzzlearea");
		for (let i = 0; i <= 14; i++) {
			// A box for containing the tile
			let box = document.createElement('div')
			box.className = 'box'
			box.id = "box-" + i.toString()

			// Tile
			let newDiv = document.createElement("div");
			newDiv.classList.add("puzzle");
			newDiv.id = ("puzzle" + Math.floor(i / 4) + "_" + i % 4);
			newDiv.onmouseover = isMovable;
			newDiv.onclick = move;
			newDiv.style.top = Math.floor(i / 4) * 100 + "px";
			newDiv.style.left = (i % 4) * 100 + "px";
			newDiv.style.backgroundPositionX = -(i % 4) * 100 + "px";
			newDiv.style.backgroundPositionY = -Math.floor(i / 4) * 100 + "px";
			box.appendChild(newDiv)
			container.appendChild(box);
		}

		// Empty tile
		let box = document.createElement('div')
		box.className = 'box'
		box.id = "box-15"

		let newDiv = document.createElement("div");
		newDiv.classList.add("empty");
		newDiv.id = "puzzle3_3";
		newDiv.style.left = "300px";
		newDiv.style.top = "300px";
		box.appendChild(newDiv)
		container.appendChild(box);
	}

	// Given tile id, check whether the corresponding tile is movable
	function isMovablePuzzle(id) {
		// Get the current position of the given tile
		let tile = document.getElementById(id)
		let boxNum = boxID2num(tile.parentNode.id)
		let row = Math.floor(boxNum / 4), col = boxNum % 4

		// Tiles that are adjacent to the empty tiles
		let tiles_to_check = [
			[empty_x - 1, empty_y], 
			[empty_x, empty_y - 1], 
			[empty_x, empty_y + 1], 
			[empty_x + 1, empty_y]
		]

		// Check if the current tile is one of the 
		// neighbours of the empty tile
		for (const [r, c] of tiles_to_check) {
			if (row == r && col == c) {
				document.getElementById(id).classList.add("movable")
				return true
			}
		}

		document.getElementById(id).classList.remove("movable")
		return false
	}

	// Move a given tile
	function movePuzzle(tile) {
		// First, check if the given tile is movable
		if (isMovablePuzzle(tile.id)) {

			empty_x = parseInt(boxID2num(tile.parentNode.id) / 4)
			empty_y = boxID2num(tile.parentNode.id) % 4

			let t1 = tile.cloneNode(true)
			let t2 = document.querySelector(".empty").cloneNode(true)
			t1.style.top = t2.style.top
			t1.style.left = t2.style.left
			t1.onmouseover = isMovable
			t1.onclick = move
			t2.style.top = tile.style.top
			t2.style.left = tile.style.left

			let tile_box = tile.parentNode
			let empty_box = document.querySelector(".empty").parentNode
			tile_box.removeChild(tile_box.lastChild)
			empty_box.removeChild(empty_box.lastChild)

			tile_box.appendChild(t2)
			empty_box.appendChild(t1)

			calcPermuation();
			addLog(tile);
		}
	}

	function isMovable() {
		isMovablePuzzle(this.id);
	}

	function move() {
		movePuzzle(this);
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
			let box = document.getElementById("puzzlearea").children[boxNum].children[0]
			permutation[boxNum] = tileNum	// Update permutation
			// Update the graphical representation
			box.id = num2puzzleID(tileNum)
			box.style.backgroundPositionX = -(tileNum % 4) * 100 + "px"
			box.style.backgroundPositionY = -Math.floor(tileNum / 4) * 100 + "px"
			box.className = "puzzle"
			box.onmouseover = isMovable
			box.onclick = move
		}

		// For the 15th tile, we put it into one of the two remaining
		// available boxes based on solvability of the puzzle.
		permutation[boxes[0]] = tiles[0]
		permutation[boxes[1]] = tiles[1]
		let tileNum = tiles.shift()	// The final non-empty tile (i.e., tile 15)
		let box = document.getElementById("puzzlearea").children[boxes[0]].children[0]
		if (isEven(permutation)) {	// Solvable
			// Put the final non-empty tile into the FIRST available box

			// Take the first available box
			box = document.getElementById("puzzlearea").children[boxes[0]].children[0]
			boxes.shift()	// Pop out the occupied box
		} else {	// Odd permutation -- not solvable in the current setting
			// Put the final non-empty tile into the SECOND available 
			// box to make it an even permutation.

			// Take the second available box
			box = document.getElementById("puzzlearea").children[boxes[1]].children[0]
			boxes.pop()		// Pop out the occupied box
		}
		// Update the graphical representation
		box.id = num2puzzleID(tileNum)
		box.style.backgroundPositionX = -(tileNum % 4) * 100 + "px"
		box.style.backgroundPositionY = -Math.floor(tileNum / 4) * 100 + "px"
		box.onmouseover = isMovable
		box.onclick = move

		// Lastly, place the empty tile and update the related class names
		tileNum = tiles.shift()
		box = document.getElementById("puzzlearea").children[boxes[0]].children[0]
		box.id = num2puzzleID(tileNum)
		box.className = "empty"
		empty_x = Math.floor(boxes[0] / 4)
		empty_y = boxes[0] % 4

		calcPermuation()
	}

	function calcPermuation() {
		// Select all the boxes
		// Compare the box id's and the tile id's

		let boxes = document.querySelectorAll(".box")
		let permutation = {}

		for (let i = 0; i < boxes.length; i++) {
			permutation[boxID2num(boxes[i].id)] = puzzleID2num(boxes[i].lastChild.id)
		}

		// Run BFS to generate the cycle notation
		let visited = {}, results = []
		for (let i = 0; i < 16; i++) {
			visited[i] = false
		}
		for (let i = 0; i < 16; i++) {
			if (!visited[i]) {
				let curr_results = []
				let queue = [i]
				while (queue.length > 0) {
					let curr = queue.shift()
					curr_results.push(curr)
					visited[curr] = true
					if (!visited[permutation[curr]]) {
						queue.push(permutation[curr])
					}
				}
				// Exclude 1-cycles
				if (curr_results.length > 1) {
					results.push(curr_results)
				}
			}
		}

		// For each list in 'results':
		//     Add 1 to every element to obtain 1-indexed representation
		//     And then convert them to strings
		//     Combine those number together and add brackets on both sides
		results = results.map((lst) => {
			return '(' + lst.map((x) => {
				return (x + 1).toString()
			}).join(', ') + ')'
		})

		if (results.length === 0) {		// Identity
			document.getElementById("permutation").innerText = 'Identity'
		} else {
			document.getElementById("permutation").innerText = results.join(' ')
		}
	}

	// Convert a puzzle id into a 0-indexed number
	function puzzleID2num(id) {
		return (parseInt(id.charAt(6))) * 4 + parseInt(id.charAt(8));
	}

	// Convert a 0-indexed number to a string formated puzzle id
	function num2puzzleID(num) {
		let row = Math.floor(num / 4)
		let col = num % 4
		return "puzzle" + row.toString() + '_' + col.toString()
	}

	// Convert a box ID into a 0-indexed number
	function boxID2num(id) {
		return parseInt(id.split('-').pop())
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
					if (!visited[permutation[curr]]) {
						queue.push(permutation[curr])
						num_of_2_cycle += 1
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