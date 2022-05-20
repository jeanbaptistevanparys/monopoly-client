'user strict';

function processConnectionForm(e) {
	e.preventDefault();
	const playerName = document.querySelector('#name').value;
	const amount = parseInt(document.querySelector('#amount').value);
	gameExistChecker(amount, playerName);
}

function gameExistChecker(amount, name) {
	getGamesFetch(false, amount, _config.gamePrefix).then(games => {
		if (games.length === 0) {
			console.log('New Game');
			createGame(name, amount);
		} else {
			showAvailableGames(games, name);
		}
	});
}

function createGame(name, amount) {
	createGameFetch(_config.gamePrefix, amount).then(game => {
		joinGame(game.id, name);
	});
}

function joinGame(_gameId, name) {
	joinGameFetch(_gameId, name).then(tokenFromServer => {
		_token = tokenFromServer;
		saveToStorage(_config.localStorageToken, _token);
		saveToStorage(_config.localStorageGameId, _gameId);
		saveToStorage(_config.localStoragePlayer, name);
		startLoadingScreen();
		checkGameStarted(_gameId);
	});
}
