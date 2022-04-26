'use strict';

function testConnection() {
	fetchFromServer('/tiles', 'GET')
		.then((_) => console.log('Status OK!'))
		.catch(errorHandler);
	fetchFromServer('/', 'GET')
		.then((info) => console.log(info))
		.catch(errorHandler);
}

function checkIfInGame() {
	if (!_token) {
		window.location.href = 'index.html';
	}
}

function defaultActions(gameState) {
	_currentGamestate = gameState;

	const playerInfo = gameState.players.find(
		(player) => player.name == _playerName
	);
	const playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

	importCurrentTile(playerCurrentTileIndex);
	importNextTwelveTiles(playerCurrentTileIndex);
	importPlayers();
	checkIfCanPurchase();
	checkIfRollDice();
	handleRent(playerCurrentTileIndex);
}

function importCurrentTile(currentTileIndex) {
	let propertyCard = makePropertyCard(currentTileIndex);
	document.querySelector('.property-card').innerHTML = '';
	document
		.querySelector('.property-card')
		.insertAdjacentElement('beforeend', propertyCard);
}

function importNextTwelveTiles(currentTileIndex) {
	document.querySelector('.nextTwelve').innerHTML = '';
	const start = currentTileIndex + 1;
	const end = currentTileIndex + 13;
	const playerPositions = getPlayersPos(_currentGamestate.players);

	for (let i = start; i < end; i++) {
		let players = null;
		if (playerPositions[i]) {
			players = playerPositions[i];
		}
		let propertyCard = makePropertyCard(i % 40, players);
		document
			.querySelector('.nextTwelve')
			.insertAdjacentElement('beforeend', propertyCard);
	}
}

function importPlayers() {
	document.querySelector('aside').innerHTML = '';
	const players = _currentGamestate.players;
	players.forEach((player) => {
		const playerCard = makePlayerCard(player);
		document
			.querySelector('aside')
			.insertAdjacentElement('beforeend', playerCard);
	});
}

function makePlayerCard(player) {
	const $template = document
		.querySelector('#player-template')
		.content.firstElementChild.cloneNode(true);
	$template.querySelector('h2').innerText = player.name;
	$template.querySelector('p').insertAdjacentHTML('beforeend', player.money);
	$template
		.querySelector('a')
		.addEventListener('click', () =>
			showPlayerInfoPopup(player.name, player.properties)
		);
	return $template;
}

function makePropertyCard(tileIndex, players = null) {
	const tile = _allTiles[tileIndex];
	const $template = document
		.querySelector('#property-template')
		.content.firstElementChild.cloneNode(true);
	const textColorBlack =
		!tile.color ||
		tile.color == 'WHITE' ||
		tile.color == 'YELLOW' ||
		tile.type == 'railroad';
	if (textColorBlack) {
		$template.querySelector('h3').style.color = 'BLACK';
	}
	if (tile.housePrice) {
		$template.querySelector('h3').innerText = tile.name;
		$template.querySelector('h3').style.backgroundColor = tile.color;
		$template.querySelector(
			'p'
		).innerHTML = `<span class="striketrough">M</span> ${tile.cost}`;
	} else {
		$template
			.querySelector('.player')
			.classList.add(trimSpaces(tile.type).toLowerCase());
		$template.classList.add('special');
		$template.querySelector('h3').innerText = tile.type;
	}

	if (players != null) {
		players.forEach((player) => {
			const playerIndex = getIndexOfPlayer(player);
			const playerImg = `<img src="./assets/media/pawns/pawn-${playerIndex}.png" alt="${player}">`;
			$template
				.querySelector('.player')
				.insertAdjacentHTML('beforeend', playerImg);
		});
	}

	return $template;
}

function checkIfRollDice() {
	if (
		_currentGamestate.currentPlayer == _playerName &&
		_currentGamestate.canRoll
	) {
		showDicePopup(handleRollDice);
		clearInterval(_myTurnChecker);
	}
}

function handleRollDice(e) {
	e.preventDefault();

	rollDice(_gameId, _playerName).then((state) => {
		console.log(state);
		defaultActions(state);
		closePopup(e);
		showRolledDicePopup(state.lastDiceRoll, closePopup);
		_myTurnChecker = setInterval(getCurrentGameState, _config.delay);
	});
}

function checkIfCanPurchase() {
	const $buyBtn = document.querySelector('#buy');
	let canPurchase = _currentGamestate.directSale ? true : false;
	$buyBtn.classList.toggle('enabled', canPurchase);
	$buyBtn.removeEventListener('click', handleBuyProperty);
	$buyBtn.addEventListener('click', handleBuyProperty);
}

function handleBuyProperty() {
	let propertyName = _currentGamestate.directSale;
	if (propertyName != null) {
		buyProperty(_gameId, _playerName, propertyName).then((res) =>
			console.log(res)
		);
	}
}

function handleRent(currentTileIndex) {
	const tile = getTile(currentTileIndex);
	let prop;
	let debtorName;
	_currentGamestate.players.forEach((player) => {
		player.properties.forEach((property) => {
			if (property.name === tile.name) {
				prop = property;
				debtorName = player.name;
			}
		});
	});
	if (prop != null && debtorName != null) {
		collectDebt(_gameId, debtorName, prop.property, _playerName);
		console.log(prop, debtorName);
	}
}

function getCurrentGameState() {
	getGame(_gameId).then((gameState) => {
		if (gameState.started) {
			_currentGamestate = gameState;
			defaultActions(_currentGamestate);
			clearInterval(_gameStartedChecker);
		}
	});
}
