'use strict';

function trimSpaces(string) {
	return string.split(' ').join('');
}

function qs(selector, parent = document) {
	return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
	return [ ...parent.querySelectorAll(selector) ];
}

function getIndexOfTileByName(tileName) {
	for (let i = 0; i < _allTiles.length; i++) {
		if (_allTiles[i].name === tileName) {
			return i;
		}
	}
	return null;
}

function getPlayersPos(players) {
	const positions = {};
	players.forEach(player => {
		const playerPosIndex = getIndexOfTileByName(player.currentTile);
		if (!positions[playerPosIndex]) {
			positions[playerPosIndex] = [ player ];
		} else {
			positions[playerPosIndex].push(player);
		}
	});
	return positions;
}

// function getIndexOfPlayer(playerObj) {
// 	return _currentGameState.players.findIndex(player => player === playerObj);
// }

function getPawnIndex(playerObj) {
	if (playerObj.name === _playerName) {
		return loadFromStorage(_config.localStoragePawnIndex);
	}
	const index = _currentGameState.players.findIndex(player => player === playerObj);
	if (index === loadFromStorage(_config.localStoragePawnIndex)) {
		return _currentGameState.players.findIndex(player => player.name === _playerName);
	}
	return index;
}

function getPlayerInfo(playerName = _playerName, gameState = _currentGameState) {
	return gameState.players.find(player => player.name === playerName);
}

function getTileByName(tileName) {
	return _allTiles.find(tile => tile.name == tileName);
}

function getPropertyInfo(playerInfo, propertyName) {
	return playerInfo.properties.find(propertyInfo => propertyInfo.property == propertyName);
}

function isMyTurn() {
	return _currentGameState.currentPlayer === _playerName;
}

const isEqual = (...objects) => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));

function turnButtonOff(selector, func) {
	qs(selector).removeEventListener('click', func);
	qs(selector).classList.remove('outer-elem', 'lightgreen');
	qs(selector).classList.add('inner-elem');
}

function turnButtonOn(selector, func) {
	qs(selector).addEventListener('click', func);
	qs(selector).classList.remove('inner-elem');
	qs(selector).classList.add('outer-elem', 'lightgreen');
}
