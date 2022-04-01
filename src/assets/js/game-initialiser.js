"use strict";
let _token = null;

document.addEventListener('DOMContentLoaded',init);

function init(){
    testConnection();
    document.querySelector('form').addEventListener('submit', processConnectionForm);
    checkIfPLayerIsLoggedIn();
}

function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}

function checkIfPLayerIsLoggedIn() {
    if (_token !== null || loadFromStorage(_config.localStorageToken)) {
        bootGameBoardUi();
    } else {
        console.log('startscherm tonen')
    }
}