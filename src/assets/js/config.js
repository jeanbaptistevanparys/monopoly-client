"use strict";

const _config = {
    groupnumber: '00',
    gamePrefix: 'group12',
    errorHandlerSelector: '.errormessages p',
    getAPIUrl: function() { return `https://project-i.ti.howest.be/monopoly-${this.groupnumber}/api`;}
}