"use strict";
let _token = null;

document.addEventListener('DOMContentLoaded',init);

function init(){
    testConnection();
    defaultPopup("header title ","leuke titel ","jaaa man");
}

function testf(e){
    e.preventDefault()
    console.log("test");
}
function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}