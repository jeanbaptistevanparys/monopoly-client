"use strict";

function defaultPopup(headertitle, title, message, button, buttons=[]) {
    const $template = document.querySelector("#default").content.firstElementChild.cloneNode(true);
    $template.querySelector("header h2").innerText = headertitle;
    $template.querySelector(".popup-content h2").innerText = title;
    $template.querySelector(".popup-content form p").innerText = message;
    $template.querySelector(".submit-btns input").setAttribute("value", button);
    console.log(buttons)
    buttons.forEach(btn => {
        const $btn = $template.querySelector(".submit-btns input").cloneNode();
        console.log(btn.text);
        $btn.setAttribute("value", btn.text);
        $template.querySelector(".submit-btns").insertAdjacentElement("beforeend", $btn);
    });
    document.querySelector("body").insertAdjacentElement("beforeend", $template);
}
