
// event.js
// This file contains event-related functions

document.addEventListener("keypress", event => {
	var log = document.getElementById("log");
	var inverseLog = document.getElementById("inverseLog")

	// Listen to the following key press events only when 
	// the input box is not focused
	if (document.activeElement != document.getElementById("apply-inputbox-id")) {
		// Space -- Add a space to logs
		if (event.keyCode === 32 && logOn == true) {
			log.innerHTML += " "
			inverseLog.innerHTML += " "
		}

		// 'r' -- Move tile to the right
		if (event.keyCode === 114) {
			moveDirection('R')
		}

		// 'u' -- Move a tile up
		if (event.keyCode === 117) {
			moveDirection('U')
		}

		// 'l' -- Move tile to the left
		if (event.keyCode === 108) {
			moveDirection('L')
		}

		// 'd' -- Move a tile down
		if (event.keyCode === 100) {
			moveDirection('D')
		}

		// 'c' -- Clear logs
		if (event.keyCode === 99 && logOn == true) {
			log.innerHTML = "";
			inverseLog.innerHTML = "";
		}

		// Ctrl + z -- Undo a move
		if (event.keyCode == 26) {
			undo();
		}
	}
})
