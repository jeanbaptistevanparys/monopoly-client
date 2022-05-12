'use strict';

function getInfo() {
	return fetchFromServer('/', 'GET');
}

function getTiles() {
	return fetchFromServer('/tiles', 'GET');
}

function getTile(tile) {
	return fetchFromServer(`/tiles/${tile}`, 'GET');
}

function getChance() {
	return fetchFromServer('/chance', 'GET');
}

function getCommunityChest() {
	return fetchFromServer('/community-chest', 'GET');
}

function getGames(started, numberOfPlayers, prefix) {
	return fetchFromServer(`/games/started?${started}&numberOfPlayers${numberOfPlayers}&prefix${prefix}`, 'GET');
}

function createGame(prefix, numberOfPlayers) {
	const bodyParams = {
		prefix          : prefix,
		numberOfPlayers : numberOfPlayers
	};
	return fetchFromServer('/games', 'POST', bodyParams);
}

function joinGame(_gameId, playerName) {
	const bodyParams = {
		playerName : playerName
	};
	return fetchFromServer(`/games/${_gameId}/players`, 'POST', bodyParams);
}

function getDummyGame() {
	return fetchFromServer('/games/dummy', 'GET');
}

function getGame(_gameId) {
	return fetchFromServer(`/games/${_gameId}`, 'GET');
}

function rollDice(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/dice`, 'POST');
}

function declareBankrupty(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/bankrupty`, 'POST');
}

function setTaxEstimate(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/tax/estimate`, 'POST');
}

function setTaxCompute(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/tax/compute`, 'POST');
}

function buyProperty(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}`, 'POST');
}

function skipProperty(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}`, 'DELETE');
}

function buildHouse(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/houses`, 'POST');
}

function sellHouse(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/houses`, 'DELETE');
}

function buildHotel(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'POST');
}

function sellHotel(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'DELETE');
}

function takeMortgage(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'POST');
}

function settleMortgage(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'DELETE');
}

function collectDebt(_gameId, playerName, propertyName, debtorName) {
	return fetchFromServer(
		`/games/${_gameId}/players/${playerName}/properties/${propertyName}/visitors/${debtorName}/rent`,
		'DELETE'
	);
}

function jailPay(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/prison/${playerName}/fine`, 'POST');
}

function jailFree() {
	return fetchFromServer(`/games/${_gameId}/prison/${playerName}/free`, 'POST');
}

function getBankAuctions(_gameId) {
	return fetchFromServer(`/games/${_gameId}/bank/auctions`, 'GET');
}

function placeBankBid(_gameId, propertyName, bidder, amount) {
	const bodyParams = {
		bidder : bidder,
		amount : amount
	};
	return fetchFromServer(`/games/${_gameId}/bank/auctions/${propertyName}/bid`, 'POST', bodyParams);
}

function getPlayerAuctions(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions`, 'GET');
}

function startPlayerAuction(_gameId, playerName, propertyName, startBid, duration) {
	const bodyParams = {
		'start-bid' : startBid,
		duration    : duration
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions/${propertyName}`, 'POST', bodyParams);
}

function placePLayerBid(_gameId, playerName, propertyName, bidder, amount) {
	const bodyParams = {
		bidder : bidder,
		amount : amount
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions/${propertyName}/bid`, 'POST', bodyParams);
}

function offerTrade(_gameId, playerName, player, offerArray, requestArray) {
	const bodyParams = {
		player : player,
		offer  : offerArray,
		return : requestArray
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/trades`, 'POST', bodyParams);
}
