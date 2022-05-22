'use strict';

let _token = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();
	document.querySelector('form').addEventListener('submit', processConnectionForm);
	qs('.back-btn').addEventListener('click', showStartGameForm);
	checkIfPLayerIsLoggedIn();
}

function checkIfPLayerIsLoggedIn() {
	if (_token !== null || loadFromStorage(_config.localStorageToken)) {
		bootGameBoardUi();
	}
}
