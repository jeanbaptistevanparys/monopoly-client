'use strict';

let _token = null;
let _gameId = null;
let playerName = null;
let _allTiles = null;
let currentGameState = null;
let gameStartedChecker;
let myTurnChecker;
let _body;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();

	_token = loadFromStorage(_config.localStorageToken);
	_gameId = loadFromStorage(_config.localStorageGameId);
	playerName = loadFromStorage(_config.localStoragePlayer);
	_body = document.querySelector('body');

	checkIfInGame();

	getTiles()
		.then(tiles => {
			_allTiles = tiles;
			getCurrentGameState();
		})
		.catch(errorHandler);

	myTurnChecker = setInterval(getCurrentGameState, _config.delay);
}
