'use strict';

function importPLayerInfo() {
	const thisPlayer = getPlayerInfo(_playerName);
	const properties = thisPlayer.properties;
	displayName(thisPlayer);
	displayMoney(thisPlayer);
	displayerNumberOfHousesAndHotels(properties);
	displayNumberOfgetOutOfJailFreeCards(thisPlayer);
	displayProperties(properties);
}

function displayName(player) {
	qs('#player-info h2').innerText = player.name;
}

function displayerNumberOfHousesAndHotels(properties) {
	let numberOfHouses = 0;
	let numberOfHotels = 0;
	properties.forEach(property => {
		if (property.houseCount) {
			numberOfHouses += property.houseCount;
		}
		if (property.hotelCount) {
			numberOfHotels += property.hotelCount;
		}
	});
	qs('#player-info .info p:nth-of-type(1) em').innerText = numberOfHouses;
	qs('#player-info .info p:nth-of-type(2) em').innerText = numberOfHotels;
}

function displayNumberOfgetOutOfJailFreeCards(player) {
	qs('#player-info .info p:nth-of-type(3) em').innerText = player.getOutOfJailFreeCards;
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
	properties.forEach(property => {
		getTileFetch(property.property).then(tile => {
			const $template = makePropertyCard(tile.position);
			qs('#player-info .properties').insertAdjacentElement('beforeend', $template);
		});
	});
}
