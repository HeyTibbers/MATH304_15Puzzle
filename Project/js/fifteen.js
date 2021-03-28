
"use strict";

// Location of the empty tile
var empty_x = 3;
var empty_y = 3;

// Stack for move log
var logStack = [];

// Switch of move log
var logOn = true;

// Shuffled or not, alter congratulation(solved) only when shuffled
var shuffled = false;

// Background of each puzzle tile
var imageSrc = "url('./imgs/background.jpg')"

// attaches a function to the calculate button
window.onload = function() {
	addBlocks();
	document.getElementById("shufflebutton").onclick = shuffle;
	document.getElementById("reset-button").onclick = reset;
	document.getElementById("undo-button").onclick = undo;
	document.getElementById("picture-button").onclick = picture;
	document.getElementById("help-button").onclick = help;
	calcPermuation();
	document.getElementById("move-log-switch").onclick = function() {
		let switch_text = document.getElementById("switch-text")
		let log_text_div = document.getElementsByClassName("log-text")
		if (logOn === false) {
			logOn = true
			switch_text.innerHTML = "Disable recording: "
			for (let i = 0; i < log_text_div.length; i++) {
				log_text_div[i].style.color = "black"
			}
			document.getElementById("log").style.color = "black"
			document.getElementById("inverseLog").style.color = "black"
		} else {
			logOn = false
			switch_text.innerHTML = "Enable recording: "
			for (let i = 0; i < log_text_div.length; i++) {
				log_text_div[i].style.color = "grey"
			}
			document.getElementById("log").style.color = "grey"
			document.getElementById("inverseLog").style.color = "grey"
		}
	}

	document.getElementById("apply-inputbox-id").addEventListener("input", (event) => {
		if (checkMoveSeq()) {
			document.getElementById("apply-inputbox-id").style.backgroundColor = ""
			document.getElementById("apply-invalid-msg").innerHTML = ""
			document.getElementById("apply-button").disabled = false
		} else {
			document.getElementById("apply-inputbox-id").style.backgroundColor = "pink"
			document.getElementById("apply-invalid-msg").innerHTML = "Invalid action detected!"
			document.getElementById("apply-button").disabled = true
		}
	})

	document.getElementById("apply-button").onclick = apply
}

// Initialization -- Add tiles to the board
function addBlocks() {
	empty_x = 3
	empty_y = 3
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
		newDiv.style.backgroundImage = imageSrc;
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

// Reset the board to the original state
function reset() {
	let container = document.getElementById("puzzlearea")
	while (container.children.length > 0) {
		container.removeChild(container.lastChild)
	}
	shuffled = false
	clearLogs()
	addBlocks()
	calcPermuation()
}

// Undo a move 
function undo() {
	// Define inverse actions
	let inverseDirection = {
		'R': 'L', 
		'L': 'R', 
		'U': 'D', 
		'D': 'U', 
		' ': ' '
	}

	if (logStack.length > 0) {
		// Update the log text only when the log text matches the 
		// actions in the log stack
		let log = document.getElementById("log")
		let inverseLog = document.getElementById("inverseLog")
		if (log.innerHTML.replace(/\s/g, '').toUpperCase() === logStack.join('')) {
			let lst = log.innerHTML.split('')
			for (let i = 0; i < 2; i++) {
				while (lst.length > 0 && lst[lst.length - 1] === ' ') {
					lst.pop()
				}
				lst.pop()
			}
			log.innerHTML = lst.join('')
			lst = lst.reverse()
			lst = lst.map((curr) => {
				return inverseDirection[curr]
			})
			inverseLog.innerHTML = lst.join('')
		} else {
			console.log(logStack)
			console.log(log.innerHTML)
		}


		// Perform inverse move for the top element of the stack
		moveDirection(inverseDirection[logStack.pop()])

		// Performing inverse move will produce a record in the log stack
		// So we need to pop out this extra one
		logStack.pop()
	}
}

// switch background src
function picture() {
	let pictureButton = document.getElementById("picture-button")
	
	if (imageSrc == "url('./imgs/background.jpg')") {
		pictureButton.innerHTML = "Picture"
		imageSrc = "url('./imgs/number_grid.jpg')"
	} else {
		pictureButton.innerHTML = "Number"
		imageSrc = "url('./imgs/background.jpg')"
	}
	for (var i = 0; i < 16; i++) {
		let tileID = num2puzzleID(i)
		let tile = document.getElementById(tileID.toString())
		if (tile.classList != "empty") {
			tile.style.backgroundImage = imageSrc
		}
	}
}

// help alter 
function help() {
	var shortcut = "Shortcut Keys:"
	var moveShortcut = "\n    'r': swap empty tile with right tile\n    'l': swap empty tile with left tile\n    'u': swap empty tile with up tile\n    'd': swap empty tile with down tile";
	var clearLogShortcut = "\n    'c': clear move log"
	var spaceLogShortcut = "\n    'Space': separate move log"
	var undoShortcut = "\n    'Ctrl+z': undo a move"
	alert(shortcut + moveShortcut + clearLogShortcut + spaceLogShortcut + undoShortcut);
}

// Move a tile based on a given direction.
// 'direction' is one of 'R', 'U', 'L', or 'D'
function moveDirection(direction) {
	let empty_tile = document.querySelector(".empty")
	let tile_x, tile_y
	if (direction === 'R') {
		tile_x = empty_x
		tile_y = empty_y - 1
	} else if (direction === 'U') {
		tile_x = empty_x + 1
		tile_y = empty_y
	} else if (direction === 'L') {
		tile_x = empty_x
		tile_y = empty_y + 1
	} else if (direction === 'D') {
		tile_x = empty_x - 1
		tile_y = empty_y
	} else {
		console.log("moveDirection: Invalid direction:" + direction)
		return
	}
	if (0 <= tile_x && tile_x < 4 && 0 <= tile_y && tile_y < 4) {
		let box_id = num2boxID(tile_x * 4 + tile_y)
		movePuzzle(document.getElementById(box_id).children[0])
	} else {
		console.log("Illegal move")
	}
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

		addLog(t1)			// Write move log
		calcPermuation()	// Update permutation
	}

	// Check solved
	checkSolved(); 
}

// check the puzzle is in solved state
function checkSolved() {
	for (var i = 0; i < 16; i++) {
		let boxID = num2boxID(i)
		let box = document.getElementById(boxID.toString())
		if (box.children[0].id != num2puzzleID(i)) {
			return
		}
	}

	if (shuffled) {
		shuffled = false
		alert("Congratulation!")
	}
} 

// Check if the move sequence is valid
function checkMoveSeq() {
	let textbox = document.getElementById("apply-inputbox-id")
	let s = textbox.value
	let validCharacters = [' ', 'r', 'u', 'd', 'l', 'R', 'U', 'D', 'L']
	let isValid = true
	for (let i = 0; i < s.length; i++) {
		if (s[i] != ' ' 
				&& s[i] != 'r'
				&& s[i] != 'u'
				&& s[i] != 'l'
				&& s[i] != 'd'
				&& s[i] != 'R'
				&& s[i] != 'U'
				&& s[i] != 'L'
				&& s[i] != 'D') {
			isValid = false
			break
		}
	}
	return isValid
}

// Apply a move sequence
function apply() {
	if (checkMoveSeq()) {
		let textbox = document.getElementById("apply-inputbox-id")
		let s = textbox.value
		let sequence = s.replace(/\s/g, '').toUpperCase().split('')
		for (const move of sequence) {
			moveDirection(move)
		}
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
		} else {
			direction = "L";
			inverseDirection = "R";
		}
	} else {
		if (puzzle.style.top > empty.style.top) {
			direction = "D";
			inverseDirection = "U";
		} else {
			direction = "U"
			inverseDirection = "D";
		}
	}
	logStack.push(direction);

	if (logOn == true) {
		var log = document.getElementById("log")
		var inverseLog = document.getElementById("inverseLog")
		log.innerHTML += direction
		inverseLog.innerHTML = inverseDirection + inverseLog.innerHTML
	}
}

// Clear out the move logs and log stack
function clearLogs() {
	// Clear out the log stack
	logStack.splice(0, logStack.length)

	let log = document.getElementById("log");
	let inverseLog = document.getElementById("inverseLog")
	log.innerHTML = "";
	inverseLog.innerHTML = "";
}

function shuffle() {
	shuffled = true

	// Clear out the log stack, log and logInverse
	clearLogs()

	let permutation = {}	// Permutation of the puzzle
	let boxIndices = []		// Available boxes; Used for generating random permutation
	for (let i = 0; i < 16; i++) {
		boxIndices.push(i)
	}

	// Generate random permutation
	for (let i = 0; i < 16; i++) {
		let j = Math.floor(Math.random() * boxIndices.length)
		permutation[i] = boxIndices[j]
		boxIndices.splice(j, 1)
	}

	// Check parity (i.e., solvability) of the random permutation
	if (!isEven(permutation)) {
		// If it is odd (i.e., not solvable), swap tile 1 and
		// tile 2 to make it even (i.e., solvable)
		let tmp = permutation[0]
		permutation[0] = permutation[1]
		permutation[1] = tmp
	}

	// Put tiles into the boxes based on the generated ramdon permutation
	for (let i = 0; i < 16; i++) {
		// Generate new tile div
		let tile_div = document.createElement("div")

		if (i == 15) {	// Special case: empty tile
			tile_div.classList.add("empty")
			// Update position of empty tile
			empty_x = Math.floor(permutation[i] / 4)
			empty_y = permutation[i] % 4
		} else {		// Regular tiles
			tile_div.classList.add("puzzle")
			tile_div.style.backgroundImage = imageSrc
		}

		// Put the tile into the ramdonly selected box
		let box = document.getElementById(num2boxID(permutation[i]))

		// Remove the old div from the box div
		box.removeChild(box.lastChild)

		tile_div.id = num2puzzleID(i)
		tile_div.onmouseover = isMovable
		tile_div.onclick = move
		tile_div.style.top = Math.floor(permutation[i] / 4) * 100 + "px"
		tile_div.style.left = (permutation[i] % 4) * 100 + "px"
		tile_div.style.backgroundPositionX = -(i % 4) * 100 + "px"
		tile_div.style.backgroundPositionY = -Math.floor(i / 4) * 100 + "px"

		// Add new div to the box div
		box.appendChild(tile_div)
	}

	// Calculate and display the new permutation
	calcPermuation()
}

function calcPermuation() {
	// Select all the boxes
	// Compare the box id's and the tile id's

	let boxes = document.querySelectorAll(".box")
	let permutation = {}

	for (let i = 0; i < boxes.length; i++) {
		permutation[puzzleID2num(boxes[i].lastChild.id)] = boxID2num(boxes[i].id)
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

// Convert a 0-indexed number to a string formated box id
function num2boxID(num) {
	return "box-" + num
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
			let count_element = 0
			while (queue.length > 0) {
				let curr = queue.shift()
				count_element += 1
				visited[curr] = true
				if (!visited[permutation[curr]]) {
					queue.push(permutation[curr])
				}
			}
			num_of_2_cycle += count_element - 1
		}
	}

	let even_boxes = [0, 2, 5, 7, 8, 10, 13, 15]	// 0-indexed
	let box_parity = 1
	for (let i = 0; i < even_boxes.length; i++) {
		if (permutation[15] === even_boxes[i]) {
			box_parity = 0
			break
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
	return (num_of_2_cycle % 2) === box_parity
}


