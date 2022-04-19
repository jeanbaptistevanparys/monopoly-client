'use strict';

function getIndexOfTileByName(tileName) {
	for (let i = 0; i < allTiles.length; i++) {
		if (allTiles[i].name == tileName) {
			return i;
		}
	}
}

function trimSpaces(string) {
	return string.split(' ').join('');
}

function qs(selector, parent = document) {
	return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
	return [ ...parent.querySelectorAll(selector) ];
}
