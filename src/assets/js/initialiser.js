'use strict';

let _token = null;
let gameId = null;
let started = false;
let playerName = null;
let allTiles = null;
let gameStartedChecker;
let myTurnChecker;
let _body;

document.addEventListener('DOMContentLoaded', init);

function init() {
	testConnection();

	_token = loadFromStorage(_config.localStorageToken);
	gameId = loadFromStorage(_config.localStorageGameId);
	playerName = loadFromStorage(_config.localStoragePlayer);
	_body = document.querySelector('body');

	checkIfInGame();

	getTiles()
		.then(tiles => {
			allTiles = tiles;
			getCurrentGameState();
		})
		.catch(errorHandler);
}
