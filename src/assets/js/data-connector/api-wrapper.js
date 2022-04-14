"use strict";

function getInfo() {
    fetchFromServer('/', 'GET')
        .then(res => {
            return res;
        });
}

function getTiles() {
    fetchFromServer('/tiles', 'GET')
        .then(res => {
            return res;
        });
}

function getTile(tile) {
    fetchFromServer(`/tiles/${tile}`, 'GET')
        .then(res => {
            return res;
        });
}


function getChance() {
    fetchFromServer('/chance', 'GET')
        .then(res => {
            return res;
        });
}

function getCommunityChest() {
    fetchFromServer('/community-chest', 'GET')
        .then(res => {
            return res;
        });
}

function getGames(started, numberOfPlayers, prefix) {
    fetchFromServer(`/games/started?${started}&numberOfPlayers${numberOfPlayers}&prefix${prefix}`, 'GET')
        .then(res => {
            return res;
        });
}

function createGame(prefix, numberOfPlayers) {
    const bodyParams = {
        "prefix": prefix,
        "numberOfPlayers": numberOfPlayers
    };
    fetchFromServer('/games', 'POST', bodyParams)
        .then(res => {
            return res;
        });
}

function joinGame(gameId, playerName) {
    const bodyParams = {
        "playerName": playerName
    };
    fetchFromServer(`/games/${gameId}/players`, 'POST', bodyParams)
        .then(res => {
            return res;
        });
}

function getDummyGame() {
    fetchFromServer('/games/dummy', 'GET')
        .then(res => {
            return res;
        });
}

function getGame(gameId) {
    fetchFromServer(`/games/${gameId}`, 'GET')
        .then(res => {
            return res;
        });
}

function rollDice(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/dice`, 'POST')
        .then(res => {
            return res;
        });
}

function declareBankrupty(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/bankrupty`, 'POST')
        .then(res => {
            return res;
        });
}

function setTaxEstimate(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/tax/estimate`, 'POST')
        .then(res => {
            return res;
        });
}

function setTaxCompute(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/tax/compute`, 'POST')
        .then(res => {
            return res;
        });
}

function buyProperty(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}`, 'POST')
        .then(res => {
            return res;
        });
}

function skipProperty(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}`, 'DELETE')
        .then(res => {
            return res;
        });
}

function buildHouse(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/houses`, 'POST')
        .then(res => {
            return res;
        });
}

function sellHouse(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/houses`, 'DELETE')
        .then(res => {
            return res;
        });
}

function buildHotel(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'POST')
        .then(res => {
            return res;
        });
}

function sellHotel(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'DELETE')
        .then(res => {
            return res;
        });
}

function takeMortgage(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'POST')
        .then(res => {
            return res;
        });
}

function settleMortgage(gameId, playerName, propertyName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'DELETE')
        .then(res => {
            return res;
        });
}

function collectDebt(gameId, playerName, propertyName, debtorName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/properties/${propertyName}/visitors/${debtorName}/rent`, 'DELETE')
        .then(res => {
            return res;
        });
}

function jailPay(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/prison/${playerName}/fine`, 'POST')
        .then(res => {
            return res;
        });
}

function jailFree() {
    fetchFromServer(`/games/${gameId}/prison/${playerName}/free`, 'POST')
        .then(res => {
            return res;
        });
}

function getBankAuctions(gameId) {
    fetchFromServer(`/games/${gameId}/bank/auctions`, 'GET')
        .then(res => {
            return res;
        });
}

function placeBankBid(gameId, propertyName, bidder, amount) {
    const bodyParams = {
        "bidder": bidder,
        "amount": amount
      }
    fetchFromServer(`/games/${gameId}/bank/auctions/${propertyName}/bid`, 'POST', bodyParams)
        .then(res => {
            return res
        });
}

function getPlayerAuctions(gameId, playerName) {
    fetchFromServer(`/games/${gameId}/players/${playerName}/auctions`, 'GET')
        .then(res => {
            return res
        });
}

function startPlayerAuction(gameId, playerName, propertyName, startBid, duration) {
    const bodyParams = {
        "start-bid": startBid,
        "duration": duration
    }
    fetchFromServer(`/games/${gameId}/players/${playerName}/auctions/${propertyName}`, 'POST', bodyParams)
        .then(res => {
            return res
        });
}

function placePLayerBid(gameId, playerName, propertyName, bidder, amount) {
    const bodyParams = {
        "bidder": bidder,
        "amount": amount
    }
    fetchFromServer(`/games/${gameId}/players/${playerName}/auctions/${propertyName}/bid`, 'POST', bodyParams)
        .then(res => {
            return res;
        });
}

function offerTrade(gameId, playerName, player, offerArray, requestArray) {
    const bodyParams = {
        "player": player,
        "offer": offerArray,
        "return": requestArray
    }
    fetchFromServer(`/games/${gameId}/players/${playerName}/trades`, 'POST', bodyParams)
        .then(res => {
            return res
        });
} 
