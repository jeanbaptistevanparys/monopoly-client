"use strict";

function showDefaultPopup(headertitle, title, message, buttons = [{ text: "continue", function: closePopup }]) {
    const $template = document.querySelector("#default").content.firstElementChild.cloneNode(true);
    $template.querySelector("header h2").innerText = headertitle;
    $template.querySelector(".popup-content h2").innerText = title;
    $template.querySelector(".popup-content form p").innerText = message;
    const $button = $template.querySelector(".submit-btns input").cloneNode();
    $template.querySelector(".submit-btns input").remove()
    buttons.forEach(btn => {
        let $btn = $button.cloneNode();
        console.log(btn);
        $btn.setAttribute("value", btn.text);
        $btn.addEventListener("click", btn.function);
        $template.querySelector(".submit-btns").insertAdjacentElement("beforeend", $btn);
    });
    _body.insertAdjacentElement("beforeend", $template);
}

function showDicePopup(funct) {
    const $template = document.querySelector("#dice").content.firstElementChild.cloneNode(true);
    $template.querySelector("input[type='submit']").addEventListener("click", funct);
    _body.insertAdjacentElement("beforeend", $template);
}

function showRolledDicePopup(number, funct) {
    const $template = document.querySelector("#roll-dice").content.firstElementChild.cloneNode(true);
    $template.querySelector(".roll-dice form p").innerText = number;
    $template.querySelector(".roll-dice form input").addEventListener("click", funct);
    _body.insertAdjacentElement("beforeend", $template);
}

function showPlayerInfoPopup(playername,properties=[{name: 'Mediterranean', position: 1, cost: 60, mortgage: 30, rent: 2}]) {
    const $template = document.querySelector("#playerinfo").content.firstElementChild.cloneNode(true);
    $template.querySelector(".playerpopup header h2").innerText = playername;
    $template.querySelector(".playerpopup header h2").innerText = playername;
    $template.querySelector(".playerpopup .icons div").addEventListener("click", closePopup);
    const $prop = $template.querySelector(".playerpopup .properties section").cloneNode(true);
    $template.querySelector(".playerpopup .properties section").remove()
    properties.forEach(propertie => {
        let $propcopy = $prop.cloneNode(true);
        console.log(propertie);
        $propcopy.querySelector("h3").innerText = propertie.name;
        $propcopy.querySelector("p").innerhtml = `<span class="striketrough">M</span> ${propertie.cost}`;
        $propcopy.addEventListener("click", propertie.function);
        $template.querySelector(".playerpopup .properties").insertAdjacentElement("beforeend", $propcopy);
    });
    _body.insertAdjacentElement("beforeend", $template);
}

function closePopup(e) {
    e.preventDefault();
    e.target.closest("article").remove();
}
