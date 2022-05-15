'use strict';

function importPLayerInfo() {
	const thisPlayer = getThisPlayer();
	const properties = thisPlayer.properties;
	displayName();
	displayMoney(thisPlayer);
	displayerNumberOfHousesAndHotels(properties);
	displayNumberOfProperties(properties);
	displayProperties(properties);
}

function getThisPlayer() {
	let thisPlayer;
	for (const playerIndex in currentGameState.players) {
		if (currentGameState.players[playerIndex].name == _playerName) {
			thisPlayer = currentGameState.players[playerIndex];
		}
	}
	return thisPlayer;
}

function displayName() {
	qs('#player-info h2').innerText = _playerName;
}

function displayerNumberOfHousesAndHotels(properties) {
	let numberOfHouses = 0;
	let numberOfHotels = 0;
	for (const propertyIndex in properties) {
		if (properties[propertyIndex].houseCount) {
			numberOfHouses += properties[propertyIndex].houseCount;
		}
		if (properties[propertyIndex].hotelCount) {
			numberOfHotels += properties[propertyIndex].hotelCount;
		}
	}
	qs('#player-info .info p:nth-of-type(1) em').innerText = numberOfHouses;
	qs('#player-info .info p:nth-of-type(2) em').innerText = numberOfHotels;
}

function displayNumberOfProperties(properties) {
	qs('#player-info .info p:nth-of-type(3) em').innerText = properties.length;
}

function displayMoney(thisPlayer) {
	qs('#player-info .info .money').innerText = '';
	qs('#player-info .info .money').insertAdjacentHTML(
		'beforeend',
		`<span class="striketrough">M</span>${thisPlayer.money}`
	);
}

function displayProperties(properties) {
	qs('#player-info .properties').innerHTML = '';
	for (const propertyIndex in properties) {
		const $template = qs('#player-property').content.firstElementChild.cloneNode(true);
		getTileFetch(properties[propertyIndex].property).then(res => {
			const tile = res;
			$template.querySelector('h3').innerText = tile.name;
			$template.querySelector('p').innerHTML = `<span class="striketrough">M</span> ${tile.cost}`;
			$template.style.backgroundColor = 'WHITE';
			$template.querySelector('h3').style.backgroundColor = tile.color;
		});
		qs('#player-info .properties').insertAdjacentElement('beforeend', $template);
	}
}
