'use strict';

function testConnection() {
	fetchFromServer('/tiles', 'GET').then(_ => console.log('Status OK!')).catch(errorHandler);
	fetchFromServer('/', 'GET').then(info => console.log(info)).catch(errorHandler);
}

function checkIfInGame() {
	if (!_token) {
		window.location.href = 'index.html';
	}
}

function defaultActions(gameState) {
	currentGameState = gameState;

	let playerInfo = gameState.players.filter(player => player.name == playerName)[0];
	let playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

	importCurrentTile(playerCurrentTileIndex);
	importNextTwelveTiles(playerCurrentTileIndex);
	checkIfCanPurchase();
	checkIfRollDice();
}

function importCurrentTile(currentTileIndex) {
	let propertyCard = makePropertyCard(currentTileIndex);
	document.querySelector('.property-card').innerHTML = '';
	document.querySelector('.property-card').insertAdjacentElement('beforeend', propertyCard);
}

function importNextTwelveTiles(currentTileIndex) {
	document.querySelector('.nextTwelve').innerHTML = '';
	let start = currentTileIndex + 1;
	let end = currentTileIndex + 13;
	for (let i = start; i < end; i++) {
		let propertyCard = makePropertyCard(i % 40);
		document.querySelector('.nextTwelve').insertAdjacentElement('beforeend', propertyCard);
	}
}

function makePropertyCard(tileIndex) {
	let tile = allTiles[tileIndex];
	const $template = document.querySelector('#property-template').content.firstElementChild.cloneNode(true);
	let textColorBlack = !tile.color || tile.color == 'WHITE' || tile.color == 'YELLOW' || tile.type == 'railroad';
	if (textColorBlack) {
		$template.querySelector('h3').style.color = 'BLACK';
	}
	if (tile.housePrice) {
		$template.querySelector('h3').innerText = tile.name;
		$template.querySelector('h3').style.backgroundColor = tile.color;
		$template.querySelector('p').innerHTML = `<span class="striketrough">M</span> ${tile.cost}`;
	} else {
		$template.querySelector('.player').classList.add(trimSpaces(tile.type).toLowerCase());
		$template.classList.add('special');
		$template.querySelector('h3').innerText = tile.type;
	}
	return $template;
}

function checkIfRollDice() {
	if (currentGameState.currentPlayer == playerName && currentGameState.canRoll) {
		showDicePopup(handleRollDice);
		clearInterval(myTurnChecker);
	}
}

function handleRollDice(e) {
	e.preventDefault();

	rollDice(gameId, playerName).then(state => {
		console.log(state);
		defaultActions(state);
		closePopup(e);
		let rolledNumber = state.lastDiceRoll[0] + state.lastDiceRoll[1];
		showRolledDicePopup(rolledNumber, closePopup);
		getGameStateLoop();
	});
}

function checkIfCanPurchase() {
	let buyBtn = document.querySelector('#buy');
	let canPurchase = currentGameState.directSale ? true : false;
	buyBtn.classList.toggle('enabled', canPurchase);
	if (canPurchase) {
		buyBtn.addEventListener('click', handleBuyProperty);
	} else {
		buyBtn.removeEventListener('click', handleBuyProperty);
	}
}

function handleBuyProperty() {
	let propertyName = currentGameState.directSale;
	if (propertyName != null) {
		buyProperty(gameId, playerName, propertyName).then(res => console.log(res));
	}
}

function getGameStateLoop() {
	myTurnChecker = setInterval(() => {
		getGame(gameId).then(gameState => {
			currentGameState = gameState;
			checkIfCanPurchase();
			checkIfRollDice();
		});
	}, _config.delay);
}
