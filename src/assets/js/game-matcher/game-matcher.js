"user strict";

function processConnectionForm(e) {
    e.preventDefault();
    const playerName = document.querySelector('#name').value;
    const amount = parseInt(document.querySelector('#amount').value);
    gameExistChecker(amount, playerName);
}

function gameExistChecker(amount, playerName) {
    fetchFromServer(`/games?prefix=${_config.gamePrefix}&numberOfPlayers=${amount}&started=false`, 'GET')
        .then(games => {
            if (games.length === 0) {
                console.log('new game')
                createGame(playerName, amount)

            } else {
                const firstGame = games[0];
                joinGame(firstGame.id, playerName)
            }
        });
}

function createGame(playerName, amount) {
    const bodyParams = {
        "prefix": _config.gamePrefix,
        "numberOfPlayers": amount
    };
    fetchFromServer('/games', 'POST', bodyParams).then(game => {
        joinGame(game.id, playerName)
    });
}

function joinGame(gameId, playerName) {
    const requestBody = {
        'playerName': playerName
    }
    fetchFromServer(`/games/${gameId}/players`, 'POST', requestBody).then(tokenFromServer => {
        _token = tokenFromServer;
        saveToStorage('playerToken', _token);
        checkGameStarted(gameId);
    });

    function checkGameStarted(gameId) {
        fetchFromServer(`/games/${gameId}`, 'GET').then(gameState => {
            if (gameState.started) {
                bootGameBoardUi();
            } else {
                console.log('check');
                setTimeout(() => checkGameStarted(gameId), _config.delay);
            }
        })
    }
}

function bootGameBoardUi() {
    window.location.href = 'game.html';
}


