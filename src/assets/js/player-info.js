'use strict';

function importPLayerInfo() {
	const thisPlayer = getPlayerInfo(_playerName);
	const properties = thisPlayer.properties;
	displayName(thisPlayer);
	displayMoney(thisPlayer);
	displayerNumberOfHousesAndHotels();
	displayNumberOfgetOutOfJailFreeCards(thisPlayer);
	displayProperties(properties);
}

function displayName(player) {
	qs('#player-info h2').innerText = player.name;
}

function displayerNumberOfHousesAndHotels() {
	qs('#player-info .info p:nth-of-type(1) em').innerText = _currentGameState.availableHouses;
	qs('#player-info .info p:nth-of-type(2) em').innerText = _currentGameState.availableHotels;
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
	properties.forEach(propertyInfo => {
		getTileFetch(propertyInfo.property).then(tile => {
			const $template = makePropertyCard(tile.position);
			$template.setAttribute('title', 'Show info');
			if (propertyInfo.mortgage) {
				$template.insertAdjacentHTML('beforeend', '<p>Mortgaged</p>');
			}
			$template.addEventListener('click', () => handleShowTitledeed(propertyInfo));
			qs('#player-info .properties').insertAdjacentElement('beforeend', $template);
		});
	});
}
