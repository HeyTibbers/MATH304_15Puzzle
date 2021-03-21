
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
		let inverseDirection = {
			'R': 'L', 
			'L': 'R', 
			'U': 'D', 
			'D': 'U', 
			' ': ' '
		}
		if (logStack.length > 0) {
			moveDirection(inverseDirection[logStack.pop()])
			logStack.pop()

			let log = document.getElementById("log")
			let inverseLog = document.getElementById("inverseLog")
			let lst = log.innerHTML.split('')
			for (let i = 0; i < 2; i++) {
				while (lst.length > 0 && lst[lst.length - 1] === ' ') {
					lst.pop()
				}
				lst.pop()
			}
			log.innerHTML = lst.join('')
			lst.reverse()
			lst = lst.map((curr) => {
				return inverseDirection[curr]
			})
			inverseLog.innerHTML = lst.join('')
		}
	}
})
