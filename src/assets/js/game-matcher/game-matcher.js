"user strict";

function processConnectionForm(e) {
    e.preventDefault();
    const playerName = document.querySelector('#name').value;
    const amount = parseInt(document.querySelector('#amount').value);
    console.log(playerName, amount);
    
    gameExistChecker(amount, playerName);
}

function gameExistChecker(amount, playerName) {
    fetchFromServer(`/games?prefix=${_config.gamePrefix}&numberOfPlayers=${amount}&started=false`, 'GET')
        .then(games => {
            if (games.length === 0) {
                console.log('new game');
                const bodyParams = {
                    'prefix': _config.gamePrefix,
                    'numberOfplayers': amount
                };
                fetchFromServer('/games', 'POST', bodyParams).then(game => {
                    joinGame(game.id, playerName)
                });
        } else {
            console.log('connect')

            const firstGame = games[0];
            joinGame(firstGame.id, playerName)
        }});
} 

function joinGame(gameId, playerName){
    const requestBody = {
        'playerName' : playerName
    }
    fetchFromServer(`/games/${gameId}/players`, 'POST', requestBody).then(res => console.log(res));
}