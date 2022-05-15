'use strict';

let rentCollected = false;

function testConnection() {
	getTilesFetch().then(_ => console.log('Status OK!')).catch(errorHandler);
	getInfoFetch().then(info => console.log(info)).catch(errorHandler);
}

function checkIfInGame() {
	if (!loadFromStorage(_config.localStorageToken)) {
		window.location.href = 'index.html';
	}
	startLoadingScreen();
	checkGameStarted(_gameId);
}

function defaultActions(gameState) {
	currentGameState = gameState;

	let playerInfo = gameState.players.find(player => player.name == playerName);
	let playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

	importCurrentTile(playerCurrentTileIndex);
	importNextTwelveTiles(playerCurrentTileIndex);
	importPLayerInfo();
	importPlayers();
	checkIfCanPurchase();
	checkIfRollDice();
	if (!_myTurn) {
		_currentGameState = gameState;
		console.log(_currentGameState);

		let playerInfo = gameState.players.find(player => player.name == _playerName);
		let playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

		importCurrentTile(playerCurrentTileIndex);
		importNextTwelveTiles(playerCurrentTileIndex);
		importPlayers();
		checkIfCanPurchase();
		checkIfRollDice();
	}
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
	const playerPositions = getPlayersPos(_currentGameState.players);

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
	const players = _currentGameState.players;
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
	if (isMyTurn() && _currentGameState.canRoll) {
		showDicePopup(handleRollDice);
		stopMyTurnChecker();
	}
}

function handleRollDice(e) {
	e.preventDefault();

	rollDiceFetch(_gameId, _playerName)
		.then(state => {
			console.log(state);
			closePopup(e);
			showRolledDicePopup(state.lastDiceRoll, event => {
				closePopup(event);
				startMyTurnChecker();
			});
		})
		.catch(error => errorHandler(error));
}

function checkIfCanPurchase() {
	let canPurchase = _currentGameState.directSale && isMyTurn();
	console.log('Can purchase: ', canPurchase);
	stopMyTurnChecker();
	removePopupByClass('.popup');
	if (canPurchase) {
		showDefaultPopup('Purchase', `Purchase: ${_currentGameState.directSale}`, 'Do you want to buy this property?', [
			{
				text     : 'Ignore property',
				function : e => {
					closePopup(e);
					checkIfSkipProperty(e);
				}
			},
			{
				text     : 'Buy property',
				function : e => {
					handleBuyProperty(e);
					closePopup(e);
				}
			}
		]);
	} else {
		removePopupByClass('.popup');
		startMyTurnChecker();
	}
}

function handleBuyProperty(e) {
	e.preventDefault();

	let propertyName = _currentGameState.directSale;
	if (propertyName != null) {
		buyPropertyFetch(_gameId, _playerName, propertyName)
			.then(res => {
				showDefaultPopup(
					'Purchased!',
					`Purchased ${res.property} !`,
					`Congratulations! You just bought:\n\n${res.property} !`,
					[
						{
							text     : 'Continue',
							function : event => {
								closePopup(event);
								startMyTurnChecker();
							}
						}
					]
				);
			})
			.catch(error => errorHandler(error));
	}
}

function handleBuyProperty() {
	let propertyName = currentGameState.directSale;
	if (propertyName != null) {
		buyProperty(_gameId, playerName, propertyName).then(res => {
			console.log(res);
		});
	}
}

function handleRent(currentTileIndex) {
	const tile = getTile(currentTileIndex);
	_currentGamestate.players.forEach(player => {
		player.properties.forEach(property => {
			if (property.name === tile.name && player.name != _playerName) {
				collectDebt(_gameId, _playerName, property.property, player.name);
				showDefaultPopup('Rent', 'you payed rent', ' to ' + debtorName);
				rentCollected = true;
			}
		});
	});
}

function getCurrentGameState() {
	getGame(_gameId).then(gameState => {
		if (gameState.started) {
			_currentGamestate = gameState;
			defaultActions(_currentGamestate);
			clearInterval(_gameStartedChecker);
		}
	});
}
function checkIfSkipProperty(e) {
	e.preventDefault();

	showDefaultPopup('Skip buy property', 'Skip buy property', 'Do you really want to skip this property?', [
		{
			text     : 'Cancel',
			function : event => {
				checkIfCanPurchase();
				closePopup(event);
			}
		},
		{
			text     : 'Yes! Skip property',
			function : event => {
				closePopup(event);
				handleSkipProperty(event);
				startMyTurnChecker();
			}
		}
	]);
}

function handleSkipProperty(e) {
	e.preventDefault();

	let propertyName = _currentGameState.directSale;
	skipPropertyFetch(_gameId, _playerName, propertyName).catch(error => errorHandler(error));
}

function getCurrentGameState() {
	getGameFetch(_gameId).then(gameState => {
		if (gameState.started) {
			_currentGameState = gameState;
			defaultActions(_currentGameState);
		}
	});
}
