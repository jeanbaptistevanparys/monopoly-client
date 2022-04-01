"use strict";

function importNextTwelve(currentTile) {

    fetchFromServer('/tiles').then(tiles => {
        for (let i = 0; i < 11; i++) {
            const $template = document.querySelector("#property-template").content.firstElementChild.cloneNode(true);
            if (!tiles[i].color || tiles[i].color == 'WHITE' || tiles[i].type == 'railroad') {
                $template.querySelector("h3").style.color = 'BLACK';
            }
            if (tiles[i].housePrice) {
                $template.querySelector("h3").innerText = tiles[i].name;
                $template.querySelector("h3").style.backgroundColor = tiles[i].color;
                $template.querySelector("p").innerHTML = `<span class="striketrough">M</span> ${tiles[i].cost}`;
            } else {
                $template.querySelector(".player").classList.add(trimSpaces(tiles[i].type).toLowerCase());
                $template.classList.add('special');
                $template.querySelector("h3").innerText = tiles[i].type;
            }
            document.querySelector('.nextTwelve').insertAdjacentElement('beforeend', $template);
        }
    })
        .catch(errorHandler);

}

function trimSpaces(string) {
    return string.split(' ').join('');
}