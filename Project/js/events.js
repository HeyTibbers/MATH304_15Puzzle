
// event.js
// This file contains event-related functions

document.addEventListener("keypress", event => {
	var log = document.getElementById("log");
	var inverseLog = document.getElementById("inverseLog")

	// 'c' -- Clear logs
	if (event.keyCode === 99 && logOn == true) {
		log.innerHTML = "";
		inverseLog.innerHTML = "";
	}

	// Space -- Add a space to logs
	if (event.keyCode === 32 && logOn == true) {
		log.innerHTML = log.innerHTML + " ";
		inverseLog.innerHTML = inverseLog.innerHTML + " ";
	}

	// 'r' -- Move tile to the right
	if (event.keyCode === 114) {
		moveDirection('R')
	}

	// 'u' -- Move a tile up
	if (event.keyCode === 117) {
		moveDirection('U')
	}

	// 'L' -- Move tile to the left
	if (event.keyCode === 108) {
		moveDirection('L')
	}

	// 'D' -- Move a tile down
	if (event.keyCode === 100) {
		moveDirection('D')
	}

	// Ctrl + z -- Undo a move
	if (event.keyCode == 26) {
		undo();
	}
})
