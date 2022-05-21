'use strict';

let _token = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();
	document.querySelector('form').addEventListener('submit', processConnectionForm);
	qs('.back-btn').addEventListener('click', showStartGameForm);
	qs('.leave-btn').addEventListener('click', leaveGame);
	checkIfPLayerIsLoggedIn();
}

function checkIfPLayerIsLoggedIn() {
	if (_token !== null || loadFromStorage(_config.localStorageToken)) {
		bootGameBoardUi();
	}
}
