'use strict';

let _token = null;
let _gameId = null;
let _playerName = null;
let _allTiles = null;
let _currentGamestate = null;
let _gameStartedChecker;
let _myTurnChecker;
let _popupContainer;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();

	_token = loadFromStorage(_config.localStorageToken);
	_gameId = loadFromStorage(_config.localStorageGameId);
	_playerName = loadFromStorage(_config.localStoragePlayer);
	_popupContainer = document.querySelector('body');

	checkIfInGame();
	
	getTiles()
		.then(tiles => {
			_allTiles = tiles;
			getCurrentGameState();
		})
		.catch(errorHandler);

	_myTurnChecker = setInterval(getCurrentGameState, _config.delay);
}
