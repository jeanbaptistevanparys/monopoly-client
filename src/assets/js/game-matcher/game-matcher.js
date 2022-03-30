"user strict";

function processConnectionForm(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const amount = document.querySelector('#amount').value;
    console.log(name, amount);
    gameExistChecker(amount);
}

function gameExistChecker(amount) {
    fetchFromServer(`/games?prefix=${_config.gamePrefix}&numberOfPlayers=${amount}&started=false`, 'GET')
        .then(res => console.log(res))
        .catch(errorHandler);
}