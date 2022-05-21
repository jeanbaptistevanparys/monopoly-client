'use strict';

const _config = {
	delay                 : 1500,
	groupnumber           : '00',
	gamePrefix            : 'group12',
	localStorageToken     : 'playerToken',
	localStorageGameId    : '_gameId',
	localStoragePlayer    : 'player',
	localStoragePawnIndex : 'pawnIndex',
	localStorageRent      : 'handledRent',
	errorHandlerSelector  : '.errormessages p',
	getAPIUrl             : function() {
		return `https://project-i.ti.howest.be/monopoly-${this.groupnumber}/api`;
	}
};
