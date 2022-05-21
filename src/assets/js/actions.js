'use strict';

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
		}
		_currentGameState = gameState;
		checkIfRent();
		checkIfCanPurchase();
		checkIfRollDice();
		checkIfCanBuild();
		checkIfCanMortgage();
	}
}

function anythingChanged(gameState) {
	return !isEqual(_currentGameState, gameState);
}

function importCurrentTile(currentTileIndex) {
	const propertyCard = makePropertyCard(currentTileIndex);
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
		const propertyCard = makePropertyCard(i % 40, players);
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

	const pawnIndex = getPawnIndex(player);
	$template.querySelector('.pawn').src = `./assets/media/pawns/pawn-${pawnIndex}.png`;
	$template.querySelector('.pawn').alt = player.name;
	$template.setAttribute('data-player', player.name);
	$template.querySelector('h2').innerText = player.name;
	$template.querySelector('p').insertAdjacentHTML('beforeend', player.money);
	qs('.status', $template).classList.add('hidden');
	$template.querySelector('a').addEventListener('click', () => showPlayerInfoPopup(player.name, player.properties));
	if (player.name == _playerName) {
		qs('a', $template).remove();
		qs('h2', $template).style.fontWeight = 'bold';
		qs('.status', $template).classList.remove('hidden');
	}
	return $template;
}

function makePropertyCard(tileIndex, players = null) {
	const tile = _allTiles[tileIndex];
	let $template = document.querySelector('#property-template').content.firstElementChild.cloneNode(true);
	if (checkTextColor(tile)) {
		$template.querySelector('h3').style.color = 'BLACK';
	}

	$template = setOptions($template, tile);

	if (players != null) {
		players.forEach(player => {
			const pawnIndex = getPawnIndex(player);
			const playerImg = `<img src="./assets/media/pawns/pawn-${pawnIndex}.png" alt="${player}">`;
			$template.querySelector('.player').insertAdjacentHTML('beforeend', playerImg);
		});
	}

	return $template;
}

function setOptions($template, tile) {
	if (tile.housePrice) {
		$template.querySelector('h3').innerText = tile.name;
		$template.querySelector('h3').style.backgroundColor = tile.color;
		$template.querySelector('p').innerHTML = `<span class="striketrough">M</span> ${tile.cost}`;
	} else {
		$template.querySelector('.player').classList.add(trimSpaces(tile.type).toLowerCase());
		$template.classList.add('special');
		$template.querySelector('h3').innerText = tile.name;
	}
	return $template;
}

function checkTextColor(tile) {
	return !tile.color || tile.color === 'WHITE' || tile.color === 'YELLOW' || tile.type === 'railroad';
}

function checkIfRollDice() {
	if (isMyTurn() && _currentGameState.canRoll) {
		showDicePopup(handleRollDice);
		stopMyTurnChecker();
	} else {
		if (qs('.roll-dice', _$popupContainer)) qs('.roll-dice', _$popupContainer).remove();
	}
}

function handleRollDice(e) {
	e.preventDefault();

	rollDiceFetch(_gameId, _playerName)
		.then(state => {
			closePopup(e);
			showRolledDicePopup(state.lastDiceRoll, event => {
				closePopup(event);
				checkIfChanceOrCommunity(state);
			});
		})
		.catch(error => errorHandler(error));
}

function checkIfChanceOrCommunity(state) {
	const playerInfo = getPlayerInfo(_playerName, state);
	if (playerInfo.currentTile.includes('Chance') || playerInfo.currentTile.includes('Chest')) {
		stopMyTurnChecker();
		handleChanceOrCommunity(state, playerInfo.currentTile);
	} else {
		startMyTurnChecker();
	}
}

function handleChanceOrCommunity(state, currentTileName) {
	const playerTurns = state.turns.filter(turn => turn.player === _playerName);
	const playerMove = playerTurns[playerTurns.length - 1].moves.find(
		turn => turn.tile.includes('Chance') || turn.tile.includes('Chest')
	);
	const move = `${playerMove.tile} \n ${playerMove.description}`;

	showDefaultPopup(currentTileName, 'Moves', move, [
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
	const canPurchase = _currentGameState.directSale && isMyTurn();
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

	const propertyName = _currentGameState.directSale;
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
					],
					false
				);
			})
			.catch(error => errorHandler(error));
	}
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

	const propertyName = _currentGameState.directSale;
	skipPropertyFetch(_gameId, _playerName, propertyName).catch(error => errorHandler(error));
}

function markCurrentPlayer() {
	const currentPlayer = _currentGameState.currentPlayer;

	if (currentPlayer != null) {
		const $currentPlayer = qs(`aside .player[data-player="${currentPlayer}"]`);
		$currentPlayer.classList.add('lightgreen');
		qs('.status', $currentPlayer).innerHTML = 'Your turn!';
	}
}

function checkIfCanBuild() {
	const playerInfo = getPlayerInfo();
	const playerOwnsProperty = playerInfo.properties.find(
		propertyInfo => propertyInfo.property == playerInfo.currentTile
	);
	turnButtonOff('#build', handleBuild);
	if (playerOwnsProperty) {
		const tileInfo = getTileByName(playerInfo.currentTile);
		const propertyCountOfStreet = playerInfo.properties.filter(
			propertyInfo => getTileByName(propertyInfo.property).color == tileInfo.color
		).length;
		const hasStreet = propertyCountOfStreet == tileInfo.groupSize;
		if (hasStreet) {
			turnButtonOn('#build', handleBuild);
		}
	}
}

function handleBuild(e) {
	e.preventDefault();
	stopMyTurnChecker();

	e.target.removeEventListener('click', handleBuild);
	const playerInfo = getPlayerInfo();
	const propertyInfo = getPropertyInfo(playerInfo, playerInfo.currentTile);
	const $popupContent = `<ul class="build-options">
		<li class="outer-elem buildHouse">Build house</li>
		<li class="buildHotel">Build hotel</li>
	</ul>`;
	showHtmlPopup('Build', `Building on: ${propertyInfo.property}`, $popupContent, event => {
		startMyTurnChecker();
		closePopup(event);
	});

	checkForBuildOptions(propertyInfo);
}

function checkForBuildOptions(propertyInfo) {
	turnButtonOn('.buildHouse', () => handleBuildHouse(propertyInfo));
	turnButtonOn('.buildHotel', () => handleBuildHotel(propertyInfo));

	if (propertyInfo.houseCount < 4) {
		turnButtonOff('.buildHotel', () => handleBuildHotel(propertyInfo));
	} else {
		turnButtonOff('.buildHouse', () => handleBuildHouse(propertyInfo));
	}
	if (propertyInfo.hotelCount == 1) {
		turnButtonOff('.buildHouse', () => handleBuildHouse(propertyInfo));
		turnButtonOff('.buildHotel', () => handleBuildHotel(propertyInfo));
	}
}

function handleBuildHouse(tileInfo) {
	buildHouseFetch(_gameId, _playerName, tileInfo.property)
		.then(() => {
			showDefaultPopup(
				'House built!',
				'House built!',
				`Congratulations! You just built a house on ${tileInfo.property}!`,
				[
					{
						text     : 'Wohoo! Continue!',
						function : event => {
							closePopup(event);
						}
					}
				]
			);
		})
		.catch(error => errorHandler(error));
}

function handleBuildHotel(tileInfo) {
	buildHotelFetch(_gameId, _playerName, tileInfo.property)
		.then(() => {
			showDefaultPopup(
				'Hotel built!',
				'Hotel built!',
				`Congratulations! You just built a hotel on ${tileInfo.property}!`,
				[
					{
						text     : 'Wohoo! Continue!',
						function : event => {
							closePopup(event);
						}
					}
				]
			);
		})
		.catch(error => errorHandler(error));
}

function checkIfCanMortgage() {
	const propertyInfo = getPropertyInfo(getPlayerInfo(), getPlayerInfo().currentTile);
	const ownsProperty = propertyInfo ? true : false;
	turnButtonOff('#mort', handleMortgage);
	turnButtonOff('#unmort', handleUnmortgage);
	if (!ownsProperty) return;
	if (propertyInfo.mortgage) {
		turnButtonOn('#unmort', handleUnmortgage);
	} else {
		turnButtonOn('#mort', handleMortgage);
	}
}

function handleMortgage(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showDefaultPopup(
		'Mortgage property',
		'Mortgage property',
		'Do you really want to mortgage this property?',
		[
			{
				text     : 'Cancel',
				function : event => {
					closePopup(event);
					stopMyTurnChecker();
				}
			},
			{
				text     : 'Yes! Mortgage property',
				function : event => {
					closePopup(event);
					handleMortgageProperty();
				}
			}
		],
		true
	);
}

function handleMortgageProperty() {
	const propertyName = getPlayerInfo().currentTile;
	takeMortgageFetch(_gameId, _playerName, propertyName)
		.then(() => {
			showDefaultPopup(
				'Mortgage property',
				'Mortgaged property',
				`You just mortgaged the property: ${propertyName}`,
				[
					{
						text     : 'Continue!',
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

function handleUnmortgage(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showDefaultPopup(
		'Mortgage property',
		'Unmortgage property',
		'Do you really want to unmortgage this property?',
		[
			{
				text     : 'Cancel',
				function : event => {
					closePopup(event);
					stopMyTurnChecker();
				}
			},
			{
				text     : 'Yes! Unmortgage property',
				function : event => {
					closePopup(event);
					handleUnmortgageProperty();
				}
			}
		],
		true
	);
}

function handleUnmortgageProperty() {
	const propertyName = getPlayerInfo().currentTile;
	settleMortgageFetch(_gameId, _playerName, propertyName)
		.then(() => {
			showDefaultPopup(
				'Unmortgage property',
				'Unmortgage property',
				`You just Unmortgage the property: ${propertyName}`,
				[
					{
						text     : 'Continue!',
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

function handleShowTitledeed(propertyName) {
	const tileInfo = getTileByName(propertyName);
	const options = {
		rentWithOneHouse    : handleOneHouse,
		rentWithTwoHouses   : handleTwoHouses,
		rentWithThreeHouses : handleThreeHouses,
		rentWithFourHouses  : handleFourHouses,
		rentWithHotel       : handleWithHotel,
		housePrice          : housePrice
	};
	showTitledeedPopup(tileInfo.name, tileInfo, options);
}

function rentChecker() {
	const players = getPlayersOnYourProperty();
	players.forEach(player => {
		if (!loadFromStorage(_config.localStorageRent)) {
			handleRent(player);
		}
	});
}

function handleRent(player) {
	const previousPlayerInfo = getPlayerInfo(player.name);
	stopMyTurnChecker();
	collectDebtFetch(player.currentTile, player.name)
		.then(res => {
			saveToStorage(_config.localStorageRent, true);
			getGameFetch(_gameId)
				.then(gameState => {
					const newPlayerInfo = getPlayerInfo(player.name, gameState);
					const rentAmount = previousPlayerInfo.money - newPlayerInfo.money;
					if (res.result) {
						showDefaultPopup(
							'Rent',
							`${player.name} paid rent!`,
							`${player.name} paid M${rentAmount} rent!`,
							[
								{
									text     : 'Continue',
									function : e => {
										closePopup(e);
									}
								}
							]
						);
					}
				})
				.catch(error => errorHandler(error));
		})
		.catch(error => errorHandler(error));
}

function getPlayersOnYourProperty() {
	let res = [];
	let playerInfo = getPlayerInfo();
	playerInfo.properties.forEach(playerproperty => {
		_currentGameState.players.forEach(player => {
			if (player.currentTile === playerproperty.property && player.name != _playerName && isMyTurn()) {
				res.push(player);
				turnButtonOff('#rent', rentChecker);
			}
		});
	});
	return res;
}

function checkIfRent() {
	if (!isMyTurn()) {
		saveToStorage(_config.localStorageRent, false);
	}
	if (!getPlayersOnYourProperty().length == 0 && !loadFromStorage(_config.localStorageRent)) {
		turnButtonOn('#rent', rentChecker);
	} else {
		turnButtonOff('#rent', rentChecker);
	}
}

function showSettings(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showSettingsPopup(checkLeaveGame, checkGoBankrupt);
}

function checkLeaveGame(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showDefaultPopup('Leave game', 'Leave game', 'Do you really want to leave this game?', [
		{
			text     : 'Cancel',
			function : event => {
				closePopup(event);
				startMyTurnChecker();
			}
		},
		{
			text     : 'Yes! Leave game',
			function : event => {
				closePopup(event);
				handleLeaveGame();
			}
		}
	]);
}

function handleLeaveGame() {
	declareBankruptyFetch(_gameId, _playerName).then(() => {
		localStorage.clear();
		window.location.href = 'index.html';
	});
}

function checkGoBankrupt(e) {
	e.preventDefault();

	stopMyTurnChecker();
	showDefaultPopup('Go Bankrupt', 'Go Bankrupt', 'Do you really want to go bankrupt?', [
		{
			text     : 'Cancel',
			function : event => {
				closePopup(event);
				startMyTurnChecker();
			}
		},
		{
			text     : 'Yes! Go bankrupt',
			function : event => {
				closePopup(event);
				handleBankruptcy();
			}
		}
	]);
}

function handleBankruptcy() {
	declareBankruptyFetch(_gameId, _playerName).then(() => {
		showDefaultPopup('Bankruptcy', 'Bankruptcy', 'You are now bankrupt!', [
			{
				text     : 'Continue',
				function : event => {
					closePopup(event);
				}
			}
		]);
	});
}

function checkIfGameEnded(gameState) {
	if (!gameState.ended) return;

	stopMyTurnChecker();
	if (gameState.winner === _playerName) {
		handleWonGame();
	} else {
		handleLostGame();
	}
}

function handleWonGame() {
	showDefaultPopup(
		'Game ended',
		'Game ended',
		`Congratulations! You won the game!`,
		[
			{
				text     : 'Wohooo!',
				function : event => {
					closePopup(event);
					handleLeaveGame();
				}
			}
		],
		false
	);
}

function handleLostGame() {
	showDefaultPopup(
		'Game ended',
		'Game ended',
		`You lost the game...`,
		[
			{
				text     : 'OK...',
				function : event => {
					closePopup(event);
					handleLeaveGame();
				}
			}
		],
		false
	);
}
