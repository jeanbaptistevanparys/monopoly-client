'use strict';

let _token = null;
let _gameId = null;
let _playerName = null;
let _allTiles = null;
let _currentGameState = null;
let _myTurn = false;
let _$popupContainer;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();

	_token = loadFromStorage(_config.localStorageToken);
	_gameId = loadFromStorage(_config.localStorageGameId);
	_playerName = loadFromStorage(_config.localStoragePlayer);
	_$popupContainer = qs('.popup-container');

	checkIfInGame();

	getTilesFetch()
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
}
