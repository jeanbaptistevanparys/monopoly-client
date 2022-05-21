'use strict';

let _token = null;
let _gameId;
let _playerName;
let _allTiles;
let _currentGameState;
let _isPaused = false;
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

	setAllEventListeners();
	setInterval(getCurrentGameState, _config.delay);
}

function setAllEventListeners() {
	qs('.leave-btn').addEventListener('click', leaveGame);
	qs('#start').addEventListener('click', showSettings);
	qs('body header .icon-close').addEventListener('click', checkLeaveGame);
	turnButtonOff('#sell', showSettings); // TODO: Make functions
}

function stopMyTurnChecker() {
	_isPaused = true;
}

function startMyTurnChecker() {
	_isPaused = false;
}

function getCurrentGameState() {
	getGameFetch(_gameId).then(gameState => {
		if (gameState.started) {
			checkIfGameEnded(gameState);
			defaultActions(gameState);
			isMyTurn(gameState);
		}
	});
}
