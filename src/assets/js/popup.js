"use strict";

function defaultPopup(headertitle, title, message, buttons=[{text:"continue",function: hidePopup }]) {
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
    document.querySelector("body").insertAdjacentElement("beforeend", $template);
}

function hidePopup(e){
    e.preventDefault();
    e.target.closest("article").remove()
}
