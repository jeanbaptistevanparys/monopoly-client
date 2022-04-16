'use strict';

function trimSpaces(string) {
	return string.split(' ').join('');
}

function getIndexOfTileByName(tileName) {
	for (let i = 0; i < allTiles.length; i++) {
		if (allTiles[i].name == tileName) {
			return i;
		}
	}
}
