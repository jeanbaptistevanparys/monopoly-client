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

function showPlayerInfoPopup(playername, properties) {
    const $template = document.querySelector("#playerinfo").content.firstElementChild.cloneNode(true);
    $template.querySelector(".playerpopup header h2").innerText = playername;
    $template.querySelector(".playerpopup-content h2").innerText = playername;
    $template.querySelector(".playerpopup .icons div").addEventListener("click", closePopup);
    const $prop = $template.querySelector(".playerpopup .properties section").cloneNode(true);
    $template.querySelector(".playerpopup .properties section").remove()
    properties.forEach(propertie => {
        let $propcopy = $prop.cloneNode(true);
        $propcopy.querySelector("h3").innerText = propertie.name;
        $propcopy.querySelector("h3").style.backgroundColor = propertie.color;
        $propcopy.querySelector("p").innerHTML = `<span class="striketrough">M</span> ${propertie.cost}`;
        $template.querySelector(".playerpopup .properties").insertAdjacentElement("beforeend", $propcopy);
    });
    _body.insertAdjacentElement("beforeend", $template);
}

function showTitledeedPopup(streetname, prop = {
    "name": "Mediterranean",
    "position": 1,
    "cost": 60,
    "mortgage": 30,
    "rent": 2,
    "rentWithOneHouse": 10,
    "rentWithTwoHouses": 30,
    "rentWithThreeHouses": 90,
    "rentWithFourHouses": 160,
    "rentWithHotel": 250,
    "housePrice": 50,
    "streetColor": "PURPLE",
    "groupSize": 2,
    "color": "PURPLE",
    "type": "street",
    "nameAsPathParameter": "Mediterranean"
}) {
    const $template = document.querySelector("#titledeed").content.firstElementChild.cloneNode(true);
    $template.querySelector(".titledeed header h2").innerText = "Titledeed";
    $template.querySelector(".titledeed-content h2").innerText = "STREETNAME";
    $template.querySelector(".titledeed .icons div").addEventListener("click", closePopup);
    const $prop = $template.querySelectorAll(".titledeed-content .values p");
    $template.querySelectorAll(".titledeed-content .values p").forEach(e => e.remove());
    let keylist = ["rentWithOneHouse","rentWithTwoHouses","rentWithThreeHouses","rentWithFourHouses","rentWithHotel","housePrice"]
    Object.keys(prop).forEach(key => {
        if (keylist.includes(key)) {
            let p1 = $prop[0].cloneNode(true);
            p1.innerText = `-${key}`
            let p2 = $prop[1].cloneNode(true);
            p2.innerHTML = `<span class="striketrough">M</span> ${prop[key]}`
            console.log(key, prop[key])
            $template.querySelector(".titledeed-content .values").insertAdjacentElement("beforeend", p1);
            $template.querySelector(".titledeed-content .values").insertAdjacentElement("beforeend", p2);
        }
    });
    _body.insertAdjacentElement("beforeend", $template);
}

function closePopup(e) {
    e.preventDefault();
    e.target.closest("article").remove();
}
