'use strict';

function testConnection() {
	getTilesFetch()
		.then((_) => console.log('Status OK!'))
		.catch(errorHandler);
	getInfoFetch()
		.then((info) => console.log(info))
		.catch(errorHandler);
}

function checkIfInGame() {
	if (!loadFromStorage(_config.localStorageToken)) {
		window.location.href = 'index.html';
	}
	startLoadingScreen();
	checkGameStarted(_gameId);
}

function defaultActions(gameState) {
	if (!_isPaused) {
		if (anythingChanged(gameState) || _currentGameState == null) {
			_currentGameState = gameState;

			const playerInfo = getPlayerInfo(_playerName);
			const playerCurrentTileIndex = getIndexOfTileByName(playerInfo.currentTile);

			importCurrentTile(playerCurrentTileIndex);
			importNextTwelveTiles(playerCurrentTileIndex);
			importPLayerInfo();
			importPlayers();
			markCurrentPlayer();
			checkIfRent();
		}
		_currentGameState = gameState;
		checkIfEnoughPlayers();
		checkIfCanPurchase();
		checkIfRollDice();
	}
}

function anythingChanged(gameState) {
	return !isEqual(_currentGameState, gameState);
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
	const playerPositions = getPlayersPos(_currentGameState.players);

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
	const players = _currentGameState.players;
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

	const playerIndex = getIndexOfPlayer(player);
	$template.querySelector(
		'.pawn'
	).src = `./assets/media/pawns/pawn-${playerIndex}.png`;
	$template.querySelector('.pawn').alt = player.name;
	$template.setAttribute('data-player', player.name);
	$template.querySelector('h2').innerText = player.name;
	$template.querySelector('p').insertAdjacentHTML('beforeend', player.money);
	$template
		.querySelector('a')
		.addEventListener('click', () =>
			showPlayerInfoPopup(player.name, player.properties)
		);
	return $template;
}

function getPawnBackground(player) {}

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
	if (isMyTurn() && _currentGameState.canRoll) {
		showDicePopup(handleRollDice);
		stopMyTurnChecker();
	}
}

function handleRollDice(e) {
	e.preventDefault();

	rollDiceFetch(_gameId, _playerName)
		.then((state) => {
			closePopup(e);
			showRolledDicePopup(state.lastDiceRoll, (event) => {
				closePopup(event);
				checkIfChangeOrCommunity(state);
			});
		})
		.catch((error) => errorHandler(error));
}

function checkIfChangeOrCommunity(state) {
	const playerInfo = getPlayerInfo(_playerName, state);
	if (playerInfo.currentTile.includes('Chance') || playerInfo.currentTile.includes('Chest')) {
		stopMyTurnChecker();
		handleChanceOrCommunity(playerInfo.currentTile);
	} else {
		startMyTurnChecker();
	}
}

function handleChanceOrCommunity(currentTileName) {
	const playerTurns = _currentGameState.turns.filter(turn => turn.player == _playerName);
	const playerMoves = playerTurns[playerTurns.length - 1].moves;
	let moves = '';
	playerMoves.forEach(move => {
		moves += `${move.tile}:\n\n ${move.description} \n\n\n`;
	});

	showDefaultPopup(currentTileName, 'Moves', moves, [
		{
			text     : 'Close',
			function : e => {
				closePopup(e);
				startMyTurnChecker();
			}
		}
	]);
}

function checkIfCanPurchase() {
	let canPurchase = _currentGameState.directSale && isMyTurn();
	stopMyTurnChecker();
	removePopupByClass('.popup');
	if (canPurchase) {
		showDefaultPopup(
			'Purchase',
			`Purchase: ${_currentGameState.directSale}`,
			'Do you want to buy this property?',
			[
				{
					text: 'Ignore property',
					function: (e) => {
						closePopup(e);
						checkIfSkipProperty(e);
					},
				},
				{
					text: 'Buy property',
					function: (e) => {
						handleBuyProperty(e);
						closePopup(e);
					},
				},
			]
		);
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
			.then((res) => {
				showDefaultPopup(
					'Purchased!',
					`Purchased ${res.property} !`,
					`Congratulations! You just bought:\n\n${res.property} !`,
					[
						{
							text: 'Continue',
							function: (event) => {
								closePopup(event);
								startMyTurnChecker();
							},
						},
					]
				);
			})
			.catch((error) => errorHandler(error));
	}
}

function checkIfSkipProperty(e) {
	e.preventDefault();

	showDefaultPopup(
		'Skip buy property',
		'Skip buy property',
		'Do you really want to skip this property?',
		[
			{
				text: 'Cancel',
				function: (event) => {
					checkIfCanPurchase();
					closePopup(event);
				},
			},
			{
				text: 'Yes! Skip property',
				function: (event) => {
					closePopup(event);
					handleSkipProperty(event);
					startMyTurnChecker();
				},
			},
		]
	);
}

function handleSkipProperty(e) {
	e.preventDefault();

	let propertyName = _currentGameState.directSale;
	skipPropertyFetch(_gameId, _playerName, propertyName).catch((error) =>
		errorHandler(error)
	);
}

function markCurrentPlayer() {
	const currentPlayer = _currentGameState.currentPlayer;

	if (currentPlayer != null) {
		const $currentPlayer = qs(`aside .player[data-player="${currentPlayer}"]`);
		$currentPlayer.classList.add('playing');
	}
}

function getCurrentGameState() {
	getGameFetch(_gameId).then((gameState) => {
		if (gameState.started) {
			defaultActions(gameState);
			isMyTurn(gameState);
		}
	});
}

function rentChecker() {
	const player = isRent();
	player.forEach(p => handleRent(p.currentTile, p.name));
}

function handleRent(propertyname, playername) {
	collectDebtFetch(propertyname, playername);
	console.log('COLLECTED RENT', _gameId, _playerName, propertyname, playername);
	stopMyTurnChecker();
	showDefaultPopup('Rent', 'you collected rent from', playername, [
		{
			text: 'Continue',
			function: (e) => {
				closePopup(e);
			},
		},
	]);
}

function isRent() {
	let res = [];
	let playerInfo = getPlayerInfo();
	playerInfo.properties.forEach((playerproperty) => {
		_currentGameState.players.forEach((player) => {
			if (
				player.currentTile === playerproperty.property &&
				player.name != _playerName && isMyTurn()
			) {
				res.push(player);
				rentButtonOff();
			}
		});
	});
	return res;
}

function checkIfRent() {
	if (!isRent().length == 0) {
		qs('#rent').classList.remove('inner-elem');
		qs('#rent').classList.add('outer-elem');
		qs('#rent').classList.add('lightgreen');
	} else {
		rentButtonOff();
	}
}

function rentButtonOff() {
	qs('#rent').classList.remove('lightgreen');
	qs('#rent').classList.remove('outer-elem');
	qs('#rent').classList.add('inner-elem');
}

function showSettings(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showSettingsPopup(checkBankruptcy);
}

function checkBankruptcy(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showDefaultPopup(
		'Leave game',
		'Leave game',
		'Do you really want to leave this game?',
		[
			{
				text: 'Cancel',
				function: (event) => {
					closePopup(event);
					startMyTurnChecker();
				},
			},
			{
				text: 'Yes! Leave game',
				function: (event) => {
					closePopup(event);
					handleBankruptcy();
				},
			},
		]
	);
}

function handleBankruptcy() {
	declareBankruptyFetch(_gameId, _playerName).then(() => {
		localStorage.clear();
		window.location.href = 'index.html';
	});
}

function checkIfEnoughPlayers() {
	const notEnoughPlayersPlaying =
		_currentGameState.players.filter((player) => player.bankrupt !== false)
			.length < 2;
	if (notEnoughPlayersPlaying) {
		stopMyTurnChecker();
		showDefaultPopup(
			'Not enough players',
			'Not enough players',
			'There are not enough players to resume the game',
			[
				{
					text: 'OK',
					function: (event) => {
						closePopup(event);
						handleBankruptcy();
					},
				},
			]
		);
	}
}
