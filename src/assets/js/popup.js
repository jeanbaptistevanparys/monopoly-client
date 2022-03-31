"use strict";

function showDefaultPopup(headertitle, title, message, buttons = [{ text: "continue", function: closePopup }]) {
    const $template = document.querySelector("#default").content.firstElementChild.cloneNode(true);
    $template.querySelector("header h2").innerText = headertitle;
    $template.querySelector(".popup-content h2").innerText = title;
    $template.querySelector(".popup-content form p").innerText = message;
    const $btn = $template.querySelector(".submit-btns input").cloneNode();
    $template.querySelector(".submit-btns input").remove()
    buttons.forEach(btn => {
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

function showRolledDicePopup(number, fucnt) {
    const $template = document.querySelector("#roll-dice").content.firstElementChild.cloneNode(true);
    $template.querySelector(".roll-dice form p").innerText = number;
    console.log($template.querySelector(".roll-dice form input"));
    $template.querySelector(".roll-dice form input").addEventListener("click", closePopup);
    _body.insertAdjacentElement("beforeend", $template);
}

function closePopup(e) {
    e.preventDefault();
    e.target.closest("article").remove();
}
