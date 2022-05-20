'use strict';

function showDefaultPopup(
	headertitle,
	title,
	message,
	buttons = [ { text: 'continue', function: closePopup } ],
	closeByCross = true,
	error = false
) {
	const $template = document.querySelector('#default').content.firstElementChild.cloneNode(true);
	$template.querySelector('header h2').innerText = headertitle;
	$template.querySelector('.popup-content h2').innerText = title;
	$template.querySelector('.popup-content form p').innerText = message;
	const $button = $template.querySelector('.submit-btns input').cloneNode();
	$template.querySelector('.submit-btns input').remove();
	buttons.forEach(btn => {
		const $btn = $button.cloneNode();
		$btn.setAttribute('value', btn.text);
		$btn.addEventListener('click', btn.function);
		$template.querySelector('.submit-btns').insertAdjacentElement('beforeend', $btn);
	});
	if (closeByCross) {
		$template.querySelector('.icon-close').addEventListener('click', closePopup);
	} else {
		$template.querySelector('.icon-close').remove();
	}
	if (error) $template.classList.add('error');
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showDicePopup(funct) {
	const $template = document.querySelector('#dice').content.firstElementChild.cloneNode(true);
	$template.querySelector("input[type='submit']").addEventListener('click', funct);
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showRolledDicePopup(numbers, funct) {
	const $template = document.querySelector('#roll-dice').content.firstElementChild.cloneNode(true);
	$template.querySelector('.roll-dice form p').innerText = numbers[0] + numbers[1];
	$template.querySelector('.roll-dice section img').src = `assets/media/dice/${numbers[0]}.png`;
	$template.querySelector('.roll-dice section img + img').src = `assets/media/dice/${numbers[1]}.png`;
	$template.querySelector('.roll-dice form input').addEventListener('click', funct);
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showPlayerInfoPopup(playername, properties) {
	const $template = document.querySelector('#playerinfo').content.firstElementChild.cloneNode(true);
	$template.querySelector('.playerpopup header h2').innerText = playername;
	$template.querySelector('.playerpopup-content h2').innerText = playername;
	$template.querySelector('.playerpopup .properties section').remove();
	properties.forEach(propertyInfo => {
		const tileInfo = getTileByName(propertyInfo.property);
		const $card = makePropertyCard(tileInfo.position);
		$template.querySelector('.playerpopup .properties').insertAdjacentElement('beforeend', $card);
	});
	$template.querySelector('.icon-close').addEventListener('click', closePopup);
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showTitledeedPopup(streetname, property, optionsWithFunctions) {
	const $template = document.querySelector('#titledeed').content.firstElementChild.cloneNode(true);
	$template.querySelector('.titledeed header h2').innerText = 'Titledeed';
	$template.querySelector('.titledeed-content h2').innerText = streetname;
	$template.querySelectorAll('.titledeed .icons div').forEach(e => e.addEventListener('click', closePopup));
	const $optionsContainer = $template.querySelector('.titledeed-content .values');
	$template.querySelectorAll('.titledeed-content .values p').forEach(e => e.remove());

	Object.keys(property).forEach(option => {
		if (Object.keys(optionsWithFunctions).includes(option)) {
			const $optionText = `<p class="left">${option}</p>`;
			const $optionPrice = `<p class="right"><span class="striketrough">M</span> ${property[option]}</p>`;
			const $optionItem = `<li class="option inner-elem" data-option="${option}">${$optionText}${$optionPrice}</li>`;
			$optionsContainer.insertAdjacentHTML('beforeend', $optionItem);
			qs(`[data-option="${option}"]`, $optionsContainer).addEventListener('click', optionsWithFunctions[option]);
		}
	});
	$template.querySelectorAll('.icon-close, input[type="submit"]').forEach(closeBtn =>
		closeBtn.addEventListener('click', e => {
			closePopup(e);
			checkIfCanBuild();
			if (!isMyTurn()) {
				startMyTurnChecker();
			}
		})
	);
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showTradePopup(playername, gamestate) {
	const selector = '.trade-names select';
	const $template = document.querySelector('#trade').content.firstElementChild.cloneNode(true);
	$template.querySelector('.trade-content .trade-names h2').innerText = playername;
	$template.querySelectorAll('.trade .icons div').forEach(e => e.addEventListener('click', closePopup));
	const $option = $template.querySelector(selector + ' option').cloneNode(true);
	$template.querySelector(selector + ' option').remove();
	gamestate['players'].forEach(player => {
		if (playername !== player.name) {
			const $opt = $option.cloneNode(true);
			$opt.innerText = player.name;
			$opt.setAttribute('value', player.name);
			$template.querySelector(selector).insertAdjacentElement('beforeend', $opt);
		}
	});
	loadOptions($template.querySelector('.tradables ul + ul'), gamestate, $template.querySelector(selector).value);
	loadOptions($template.querySelector('.tradables ul'), gamestate, playername);
	$template.querySelector(selector).addEventListener('change', () => {
		loadOptions($template.querySelector('.tradables ul + ul'), gamestate, $template.querySelector(selector).value);
	});
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showSettingsPopup(func) {
	const $template = document.querySelector('#settings').content.firstElementChild.cloneNode(true);
	const $leaveGameBtn = qs('#leave', $template);
	const $closeBtn = qs('#close', $template);

	$closeBtn.addEventListener('click', closePopup);
	$leaveGameBtn.addEventListener('click', e => {
		func(e);
		closePopup(e);
	});
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function loadOptions($container, gameState, playerName) {
	const $template = document.querySelector('#trade').content.firstElementChild.cloneNode(true);
	const $li = $template.querySelector('.tradables ul li').cloneNode(true);
	$container.querySelectorAll('.action').forEach(e => e.remove());
	gameState['players'].forEach(player => {
		if (player.name === playerName) {
			player['properties'].forEach(propertie => {
				const $copyli = $li.cloneNode(true);
				$copyli.querySelector('input').setAttribute('id', propertie.property);
				$copyli.querySelector('label').setAttribute('for', propertie.property);
				$copyli.querySelector('label').innerText = propertie.property;
				$container.insertAdjacentElement('beforeend', $copyli);
			});
		}
	});
}

function closePopup(e) {
	e.preventDefault();
	e.target.closest('article').remove();
}

function removePopupByClass(selector) {
	if (_$popupContainer.querySelector(selector)) {
		qs(selector, _$popupContainer).remove();
	}
}
