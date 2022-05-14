'use strict';

let _token = null;
let _gameId = null;
let playerName = null;
let _allTiles = null;
let _currentGameState = null;
let _myTurn = false;
let _popupContainer;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();

	_token = loadFromStorage(_config.localStorageToken);
	_gameId = loadFromStorage(_config.localStorageGameId);
	playerName = loadFromStorage(_config.localStoragePlayer);
	_popupContainer = qs('.popup-container');

	checkIfInGame();

	getTiles()
		.then(tiles => {
			_allTiles = tiles;
			getCurrentGameState();
		})
		.catch(errorHandler);

	setInterval(getCurrentGameState, _config.delay);
}

function stopMyTurnChecker() {
	_myTurn = true;
}

function startMyTurnChecker() {
	_myTurn = false;
	console.debug();
}
