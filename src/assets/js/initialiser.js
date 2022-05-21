'use strict';

let _token = null;
let _gameId = null;
let _playerName = null;
let _allTiles = null;
let _currentGameState = null;
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
	qs('#start').addEventListener('click', showSettings);
	qs('body header .icon-close').addEventListener('click', checkBankruptcy);
	turnButtonOff('#sell', showSettings); // TODO: Make functions
	turnButtonOff('#mort', showSettings); // TODO: Make functions
	turnButtonOff('#unmort', showSettings); // TODO: Make functions
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
			defaultActions(gameState);
			isMyTurn(gameState);
		}
	});
}
