'use strict';

let _token = null;
let gameId = null;
let started = false;
let playerName = null;
let allTiles = null;
let gameStartedChecker;
let _body;

document.addEventListener('DOMContentLoaded', init);

function init() {
	_token = loadFromStorage(_config.localStorageToken);
	gameId = loadFromStorage(_config.localStorageGameId);
	playerName = loadFromStorage(_config.localStoragePlayer);

	getTiles().then(tiles => (allTiles = tiles)).catch(errorHandler);

	testConnection();

	gameStartedChecker = setInterval(getCurrentGameState, _config.delay);
}

function getCurrentGameState() {
	let currentGameState = getGame(gameId);

	currentGameState.then(state => {
		if (state.started) {
			started = true;
			clearInterval(gameStartedChecker);
			defaultActions(state);
		}
	});
}
