'use strict';

const closeIconQuery = '.icon-close';

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
		$template.querySelector(closeIconQuery).addEventListener('click', closePopup);
	}
	if (error) {
		$template.classList.add('error');
	}
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

function showPlayerInfoPopup(title, message, playername, properties, func) {
	const $template = document.querySelector('#playerinfo').content.firstElementChild.cloneNode(true);
	$template.querySelector('.playerpopup header h2').innerText = title;
	$template.querySelector('.playerpopup-content h3').innerText = message;
	$template.querySelector('.playerpopup-content h2').innerText = playername;
	$template.querySelector('.playerpopup .properties section').remove();
	properties.forEach(propertyInfo => {
		const tileInfo = getTileByName(propertyInfo.property);
		const $card = makePropertyCard(tileInfo.position);
		$template.querySelector('.playerpopup .properties').insertAdjacentElement('beforeend', $card);
		$card.addEventListener('click', e => func(propertyInfo, e));
	});
	$template.querySelector(closeIconQuery).addEventListener('click', e => {
		closePopup(e);
		checkIfCanMortgage();
		startMyTurnChecker();
	});
	_$popupContainer.insertAdjacentElement('beforeend', $template);
}

function showTitledeedPopup(streetname, property, optionsWithFunctions) {
	const $template = document.querySelector('#titledeed').content.firstElementChild.cloneNode(true);
	$template.querySelector('.titledeed-content h2').innerText = streetname;
	$template.querySelectorAll('.titledeed .icons div').forEach(e => e.addEventListener('click', closePopup));
	const $optionsContainer = $template.querySelector('.titledeed-content .values');

	let hasOptions = false;
	const propertyInfo = getTileByName(property.property);
	Object.keys(propertyInfo).forEach(option => {
		if (optionsWithFunctions.includes(option)) {
			hasOptions = true;
			const sameIndex =
				optionsWithFunctions.findIndex(o => o.includes(option)) === property.houseCount + property.hotelCount;
			const hasImprovementClass = sameIndex ? 'lightgreen' : '';
			const $optionText = `<p class="left">${option}</p>`;
			const $optionPrice = `<p class="right"><span class="striketrough">M</span> ${propertyInfo[option]}</p>`;
			const $optionItem = `<li class="option inner-elem ${hasImprovementClass}">${$optionText}${$optionPrice}</li>`;
			$optionsContainer.insertAdjacentHTML('beforeend', $optionItem);
		}
	});
	if (!hasOptions) {
		$optionsContainer.insertAdjacentHTML('beforeend', '<h2 class="left">No options available</h2>');
	}
	if (property.mortgage) {
		$optionsContainer.insertAdjacentHTML(
			'beforeend',
			`<li class="option inner-elem">
				<p class="left">Mortgaged for:</p><p class="right"><span class="striketrough">M</span> ${propertyInfo.mortgage}</p>
			</li>`
		);
	}
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

function showSettingsPopup(leaveFunc, bankruptcyFunc) {
	const $template = document.querySelector('#settings').content.firstElementChild.cloneNode(true);
	const $leaveGameBtn = qs('#leave', $template);
	const $goBankruptBtn = qs('#bankrupt', $template);
	const $closeBtn = qs('#close', $template);

	$closeBtn.addEventListener('click', closePopup);
	$leaveGameBtn.addEventListener('click', e => {
		leaveFunc(e);
		closePopup(e);
	});
	$goBankruptBtn.addEventListener('click', e => {
		bankruptcyFunc(e);
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

function showHtmlPopup(headertitle, title, html, func) {
	const $template = document.querySelector('#popup-with-html').content.firstElementChild.cloneNode(true);
	$template.querySelector('header h2').innerText = headertitle;
	$template.querySelector('.popup-content h2').innerText = title;
	$template.querySelector('.popup-content .html-content').innerHTML = html;
	$template.querySelector('.popup-content .close-btn').addEventListener('click', func);
	$template.querySelector(closeIconQuery).addEventListener('click', closePopup);
	_$popupContainer.insertAdjacentElement('beforeend', $template);
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
