"use strict";
let _token = null;
let _body;

document.addEventListener('DOMContentLoaded',init);

function init(){
    _body = document.querySelector("body");
    testConnection();
    showPlayerInfo();
}

function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}
