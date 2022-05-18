'use strict';

function generateVisualAPIErrorInConsole() {
	console.error('%c%s', 'background-color: red;color: white', '! An error occurred while calling the API');
}

function errorHandler(error) {
	console.error(error);
	stopMyTurnChecker();
	showDefaultPopup(
		`Error ${error.failure}`,
		'Error #45212 ! \n (although nobody knows what this means)',
		`An error has occurred:\n\n${error.cause}`,
		[
			{
				text     : 'OK',
				function : e => {
					closePopup(e);
					startMyTurnChecker();
				}
			}
		],
		true,
		'error'
	);
}
