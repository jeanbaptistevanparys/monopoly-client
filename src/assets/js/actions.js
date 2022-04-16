'use strict';

function testConnection() {
	fetchFromServer('/tiles', 'GET').then(_ => console.log('Status OK!')).catch(errorHandler);
	fetchFromServer('/', 'GET').then(info => console.log(info)).catch(errorHandler);
}

function defaultActions(gameState) {
	let playerInfo = gameState.players.filter(player => player.name == playerName)[0];
	let playerCurrentCardIndex = getIndexOfCardByName(playerInfo.currentTile);

	importNextTwelve(playerCurrentCardIndex);
}

function importNextTwelve(currentTileIndex) {
	for (let i = currentTileIndex + 1; i < currentTileIndex + 13; i++) {
		const $template = document.querySelector('#property-template').content.firstElementChild.cloneNode(true);
		if (!allTiles[i].color || allTiles[i].color == 'WHITE' || allTiles[i].type == 'railroad') {
			$template.querySelector('h3').style.color = 'BLACK';
		}
		if (allTiles[i].housePrice) {
			$template.querySelector('h3').innerText = allTiles[i].name;
			$template.querySelector('h3').style.backgroundColor = allTiles[i].color;
			$template.querySelector('p').innerHTML = `<span class="striketrough">M</span> ${allTiles[i].cost}`;
		} else {
			$template.querySelector('.player').classList.add(trimSpaces(allTiles[i].type).toLowerCase());
			$template.classList.add('special');
			$template.querySelector('h3').innerText = allTiles[i].type;
		}
		document.querySelector('.nextTwelve').insertAdjacentElement('beforeend', $template);
	}
}

function trimSpaces(string) {
	return string.split(' ').join('');
}

function getIndexOfCardByName(cardName) {
	for (let i = 0; i < allTiles.length; i++) {
		if (allTiles[i].name == cardName) {
			return i;
		}
	}
}
