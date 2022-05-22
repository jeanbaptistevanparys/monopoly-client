'use strict';

let loading;
const loadingQuery = '.loading-screen';

function checkGameStarted(_gameId) {
	getGameFetch(_gameId).then(gameState => {
		if (gameState.started) {
			bootGameBoardUi();
			hideLoadingScreen();
		} else {
			showLoadingScreen(gameState);
			setTimeout(() => checkGameStarted(_gameId), _config.delay);
		}
	});
}

function showAvailableGames(games, name) {
	const $createGameForm = qs('.start-game');
	const $gameListPopup = qs('.game-list');
	const $gameList = qs('ul', $gameListPopup);
	$createGameForm.classList.add('hidden');
	$gameListPopup.classList.remove('hidden');

	$gameList.innerHTML = '';
	games.forEach(game => {
		const $game = `<li class="game outer-elem" id="${game.id}">${game.id}</li>`;
		$gameList.insertAdjacentHTML('beforeend', $game);
		qs(`#${game.id}`).addEventListener('click', () => joinGame(game.id, name));
	});
}

function makeLoadingScreen() {
	let $loadingScreen = `
	<img src="assets/media/Monopoly-logo.jpg" alt="Monopoly Logo">
			<p>Waiting for players</p>
			<h2>Players: <span class="player-count"></span></h2>
			<div class="loading-bar">`;
	for (let i = 0; i < 20; i++) {
		$loadingScreen += `<div class="loading-bar-piece hidden"></div>`;
	}
	$loadingScreen += `</div>
						<form action="#">
							<input type="submit" value="Back" class="leave-btn outer-elem">
						</form>`;
	return $loadingScreen;
}

function showStartGameForm(e) {
	e.preventDefault();

	qs('.start-game').classList.remove('hidden');
	qs('.game-list').classList.add('hidden');
}

function startLoadingScreen() {
	qs(loadingQuery).insertAdjacentHTML('beforeend', makeLoadingScreen());
	qs('.leave-btn').addEventListener('click', leaveGame);
	const $loadingPieces = qsa('.loading-bar-piece');
	let start = 0;
	loading = setInterval(() => {
		$loadingPieces.forEach(piece => piece.classList.add('hidden'));

		$loadingPieces[start].classList.remove('hidden');
		$loadingPieces[(start + 1) % $loadingPieces.length].classList.remove('hidden');
		$loadingPieces[(start + 2) % $loadingPieces.length].classList.remove('hidden');
		start++;
		if (start === $loadingPieces.length) {
			start = 0;
		}
	}, 100);
}

function stopLoadingScreen() {
	if (loading) {
		clearInterval(loading);
	}
}

function showLoadingScreen(gameState) {
	const $loadingScreen = qs(loadingQuery);
	$loadingScreen.classList.remove('hidden');

	const numberOfPlayers = gameState.players.length;
	const maxPlayers = gameState.numberOfPlayers;
	qs('.player-count').innerHTML = `${numberOfPlayers}/${maxPlayers}`;
}

function hideLoadingScreen() {
	const $loadingScreen = qs(loadingQuery);
	$loadingScreen.classList.add('hidden');
	stopLoadingScreen();
}

function leaveGame(e) {
	e.preventDefault();

	declareBankruptyFetch(
		loadFromStorage(_config.localStorageGameId),
		loadFromStorage(_config.localStoragePlayer)
	).then(() => {
		localStorage.clear();
		window.location.href = _config.joinGamePage;
	});
}

function bootGameBoardUi() {
	if (!window.location.href.includes('game.html')) {
		window.location.href = 'game.html';
	}
}
