'user strict';

function processConnectionForm(e) {
	e.preventDefault();
	let playerName = document.querySelector('#name').value;
	const amount = parseInt(document.querySelector('#amount').value);
	gameExistChecker(amount, playerName);
}

function gameExistChecker(amount, name) {
	fetchFromServer(
		`/games?prefix=${_config.gamePrefix}&numberOfPlayers=${amount}&started=false`,
		'GET'
	).then(games => {
		if (games.length === 0) {
			console.log('new game');
			createGame(name, amount);
		} else {
			const firstGame = games[0];
			joinGame(firstGame.id, name);
		}
	});
}

function createGame(name, amount) {
	const bodyParams = {
		prefix          : _config.gamePrefix,
		numberOfPlayers : amount
	};
	fetchFromServer('/games', 'POST', bodyParams).then(game => {
		joinGame(game.id, name);
	});
}

function joinGame(_gameId, name) {
	const requestBody = {
		playerName : name
	};
	fetchFromServer(`/games/${_gameId}/players`, 'POST', requestBody).then(tokenFromServer => {
		_token = tokenFromServer;
		saveToStorage(_config.localStorageToken, _token);
		saveToStorage(_config.localStorageGameId, _gameId);
		saveToStorage(_config.localStoragePlayer, name);
		checkGameStarted();
	});

	function checkGameStarted() {
		fetchFromServer(`/games/${_gameId}`, 'GET').then(gameState => {
			if (gameState.started) {
				bootGameBoardUi();
			} else {
				console.log('check');
				setTimeout(() => checkGameStarted(), _config.delay);
			}
		});
	}
}

function bootGameBoardUi() {
	window.location.href = 'game.html';
}
