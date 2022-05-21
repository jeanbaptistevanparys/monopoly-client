'use strict';

function getInfoFetch() {
	return fetchFromServer('/', 'GET');
}

function getTilesFetch() {
	return fetchFromServer('/tiles', 'GET');
}

function getTileFetch(tile) {
	return fetchFromServer(`/tiles/${tile}`, 'GET');
}

function getChanceFetch() {
	return fetchFromServer('/chance', 'GET');
}

function getCommunityChestFetch() {
	return fetchFromServer('/community-chest', 'GET');
}

function getGamesFetch(started, numberOfPlayers, prefix) {
	return fetchFromServer(`/games?prefix=${prefix}&numberOfPlayers=${numberOfPlayers}&started=${started}`, 'GET');
}

function createGameFetch(prefix, numberOfPlayers) {
	const bodyParams = {
		prefix          : prefix,
		numberOfPlayers : numberOfPlayers
	};
	return fetchFromServer('/games', 'POST', bodyParams);
}

function joinGameFetch(_gameId, playerName) {
	const bodyParams = {
		playerName : playerName
	};
	return fetchFromServer(`/games/${_gameId}/players`, 'POST', bodyParams);
}

function getDummyGameFetch() {
	return fetchFromServer('/games/dummy', 'GET');
}

function getGameFetch(_gameId) {
	return fetchFromServer(`/games/${_gameId}`, 'GET');
}

function rollDiceFetch(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/dice`, 'POST');
}

function declareBankruptyFetch(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/bankruptcy`, 'POST');
}

function setTaxEstimateFetch(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/tax/estimate`, 'POST');
}

function setTaxComputeFetch(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/tax/compute`, 'POST');
}

function buyPropertyFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}`, 'POST');
}

function skipPropertyFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}`, 'DELETE');
}

function buildHouseFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/houses`, 'POST');
}

function sellHouseFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/houses`, 'DELETE');
}

function buildHotelFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'POST');
}

function sellHotelFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/hotel`, 'DELETE');
}

function takeMortgageFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'POST');
}

function settleMortgageFetch(_gameId, playerName, propertyName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/properties/${propertyName}/mortgage`, 'DELETE');
}

function collectDebtFetch( propertyName, debtorName) {
	return fetchFromServer(
		`/games/${_gameId}/players/${_playerName}/properties/${propertyName}/visitors/${debtorName}/rent`,
		'DELETE'
	);
}

function jailPayFetch() {
	return fetchFromServer(`/games/${_gameId}/prison/${_playerName}/fine`, 'POST');
}

function jailFreeFetch() {
	return fetchFromServer(`/games/${_gameId}/prison/${_playerName}/free`, 'POST');
}

function getBankAuctionsFetch(_gameId) {
	return fetchFromServer(`/games/${_gameId}/bank/auctions`, 'GET');
}

function placeBankBidFetch(_gameId, propertyName, bidder, amount) {
	const bodyParams = {
		bidder : bidder,
		amount : amount
	};
	return fetchFromServer(`/games/${_gameId}/bank/auctions/${propertyName}/bid`, 'POST', bodyParams);
}

function getPlayerAuctionsFetch(_gameId, playerName) {
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions`, 'GET');
}

function startPlayerAuctionFetch(_gameId, playerName, propertyName, startBid, duration) {
	const bodyParams = {
		'start-bid' : startBid,
		duration    : duration
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions/${propertyName}`, 'POST', bodyParams);
}

function placePLayerBidFetch(_gameId, playerName, propertyName, bidder, amount) {
	const bodyParams = {
		bidder : bidder,
		amount : amount
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/auctions/${propertyName}/bid`, 'POST', bodyParams);
}

function offerTradeFetch(_gameId, playerName, player, offerArray, requestArray) {
	const bodyParams = {
		player : player,
		offer  : offerArray,
		return : requestArray
	};
	return fetchFromServer(`/games/${_gameId}/players/${playerName}/trades`, 'POST', bodyParams);
}
