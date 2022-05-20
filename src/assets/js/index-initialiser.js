'use strict';

let _token;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();
	document.querySelector('form').addEventListener('submit', processConnectionForm);
	checkIfPLayerIsLoggedIn();
}

function checkIfPLayerIsLoggedIn() {
	if (_token !== null || loadFromStorage(_config.localStorageToken)) {
		bootGameBoardUi();
	}
}
