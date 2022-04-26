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

	let playerInfo = gameState.players.find(player => player.name == playerName);
	let playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

	importCurrentTile(playerCurrentTileIndex);
	importNextTwelveTiles(playerCurrentTileIndex);
	importPlayers();
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
	const start = currentTileIndex + 1;
	const end = currentTileIndex + 13;
	const playerPositions = getPlayersPos(currentGameState.players);

	for (let i = start; i < end; i++) {
		let players = null;
		if (playerPositions[i]) {
			players = playerPositions[i];
		}
		let propertyCard = makePropertyCard(i % 40, players);
		document.querySelector('.nextTwelve').insertAdjacentElement('beforeend', propertyCard);
	}
}

function importPlayers() {
	document.querySelector('aside').innerHTML = '';
	const players = currentGameState.players;
	players.forEach(player => {
		const playerCard = makePlayerCard(player);
		document.querySelector('aside').insertAdjacentElement('beforeend', playerCard);
	});
}

function makePlayerCard(player) {
	const $template = document.querySelector('#player-template').content.firstElementChild.cloneNode(true);
	$template.querySelector('h2').innerText = player.name;
	$template.querySelector('p').insertAdjacentHTML('beforeend', player.money);
	$template.querySelector('a').addEventListener('click', () => showPlayerInfoPopup(player.name, player.properties));
	return $template;
}

function makePropertyCard(tileIndex, players = null) {
	const tile = _allTiles[tileIndex];
	const $template = document.querySelector('#property-template').content.firstElementChild.cloneNode(true);
	const textColorBlack = !tile.color || tile.color == 'WHITE' || tile.color == 'YELLOW' || tile.type == 'railroad';
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

	if (players != null) {
		players.forEach(player => {
			const playerIndex = getIndexOfPlayer(player);
			const playerImg = `<img src="./assets/media/pawns/pawn-${playerIndex}.png" alt="${player}">`;
			$template.querySelector('.player').insertAdjacentHTML('beforeend', playerImg);
		});
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

	rollDice(_gameId, playerName).then(state => {
		console.log(state);
		defaultActions(state);
		closePopup(e);
		showRolledDicePopup(state.lastDiceRoll, closePopup);
		myTurnChecker = setInterval(getCurrentGameState, _config.delay);
	});
}

function checkIfCanPurchase() {
	const $buyBtn = document.querySelector('#buy');
	let canPurchase = currentGameState.directSale ? true : false;
	$buyBtn.classList.toggle('enabled', canPurchase);
	$buyBtn.removeEventListener('click', handleBuyProperty);
	$buyBtn.addEventListener('click', handleBuyProperty);
}

function handleBuyProperty() {
	let propertyName = currentGameState.directSale;
	if (propertyName != null) {
		buyProperty(_gameId, playerName, propertyName).then(res => console.log(res));
	}
}

function getCurrentGameState() {
	getGame(_gameId).then(gameState => {
		if (gameState.started) {
			currentGameState = gameState;
			defaultActions(currentGameState);
			clearInterval(gameStartedChecker);
		}
	});
}
