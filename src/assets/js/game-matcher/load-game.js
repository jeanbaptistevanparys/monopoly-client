'use strict';

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

	games.forEach(game => {
		const $game = `<li class="game outer-elem" id="${game.id}">${game.id}</li>`;
		$gameList.insertAdjacentHTML('beforeend', $game);
		qs(`#${game.id}`).addEventListener('click', () => joinGame(game.id, name));
	});
}

let loading;
function startLoadingScreen() {
	const $loadingPieces = qsa('.loading-bar-piece');
	let start = 0;
	loading = setInterval(() => {
		$loadingPieces.forEach(piece => piece.classList.add('hidden'));

		$loadingPieces[start].classList.remove('hidden');
		$loadingPieces[(start + 1) % $loadingPieces.length].classList.remove('hidden');
		$loadingPieces[(start + 2) % $loadingPieces.length].classList.remove('hidden');
		start++;
		if (start === $loadingPieces.length) start = 0;
	}, 100);
}

function stopLoadingScreen() {
	if (loading) clearInterval(loading);
}

function showLoadingScreen(gameState) {
	const $loadingScreen = qs('.loading-screen');
	$loadingScreen.classList.remove('hidden');

	const numberOfPlayers = gameState.players.length;
	const maxPlayers = gameState.numberOfPlayers;
	qs('.player-count').innerHTML = `${numberOfPlayers}/${maxPlayers}`;
}

function hideLoadingScreen() {
	const $loadingScreen = qs('.loading-screen');
	$loadingScreen.classList.add('hidden');
	stopLoadingScreen();
}

function bootGameBoardUi() {
	window.location.href = 'game.html';
}
