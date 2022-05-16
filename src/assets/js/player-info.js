'use strict';

function importPLayerInfo() {
	const thisPlayer = _currentGameState.players.find(player => player.name == _playerName);
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
		const $template = qs('#player-property').content.firstElementChild.cloneNode(true);
		getTileFetch(property.property).then(res => {
			const tile = res;
			$template.querySelector('h3').innerText = tile.name;
			$template.querySelector('p').innerHTML = `<span class="striketrough">M</span> ${tile.cost}`;
			$template.style.backgroundColor = 'WHITE';
			$template.querySelector('h3').style.backgroundColor = tile.color;
		});
		qs('#player-info .properties').insertAdjacentElement('beforeend', $template);
	});
}
