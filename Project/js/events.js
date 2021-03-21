
// event.js
// This file contains event-related functions

document.addEventListener("keypress", event => {
	var log = document.getElementById("log");
	var inverseLog = document.getElementById("inverseLog")
	// 'C' -- Clear logs
	if (event.keyCode === 99 && logOn == true) {
		log.innerHTML = "";
		inverseLog.innerHTML = "";
	}
	// Space -- Add a space to logs
	if (event.keyCode === 32 && logOn == true) {
		log.innerHTML = log.innerHTML + " ";
		inverseLog.innerHTML = inverseLog.innerHTML + " ";
	}
})

