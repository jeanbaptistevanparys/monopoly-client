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
    $template.querySelectorAll(".playerpopup .icons div").forEach(e => e.addEventListener("click", closePopup));
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

function showTitledeedPopup(streetname, properties) {
    const $template = document.querySelector("#titledeed").content.firstElementChild.cloneNode(true);
    $template.querySelector(".titledeed header h2").innerText = "Titledeed";
    $template.querySelector(".titledeed-content h2").innerText = "STREETNAME";
    $template.querySelectorAll(".titledeed .icons div").forEach(e => e.addEventListener("click", closePopup));
    const $prop = $template.querySelectorAll(".titledeed-content .values p");
    $template.querySelectorAll(".titledeed-content .values p").forEach(e => e.remove());
    let keylist = ["rentWithOneHouse", "rentWithTwoHouses", "rentWithThreeHouses", "rentWithFourHouses", "rentWithHotel", "housePrice"];
    Object.keys(properties).forEach(key => {
        if (keylist.includes(key)) {
            let p1 = $prop[0].cloneNode(true);
            p1.innerText = `-${key}`
            let p2 = $prop[1].cloneNode(true);
            p2.innerHTML = `<span class="striketrough">M</span> ${prop[key]}`;
            $template.querySelector(".titledeed-content .values").insertAdjacentElement("beforeend", p1);
            $template.querySelector(".titledeed-content .values").insertAdjacentElement("beforeend", p2);
        }
    });
    _body.insertAdjacentElement("beforeend", $template);
}

function showTradePopup(playername, gamestate) {
    const $template = document.querySelector("#trade").content.firstElementChild.cloneNode(true);
    $template.querySelector(".trade-content .trade-names h2").innerText = playername;
    $template.querySelectorAll(".trade .icons div").forEach(e => e.addEventListener("click", closePopup));
    const $option = $template.querySelector(".trade-names select option").cloneNode(true);
    $template.querySelector(".trade-names select option").remove()
    gamestate["players"].forEach(player => {
        if (playername != player.name) {
            let $opt = $option.cloneNode(true);
            $opt.innerText = player.name;
            $opt.setAttribute("value", player.name);
            $template.querySelector(".trade-names select").insertAdjacentElement("beforeend", $opt);
        }
    });
    loadOptions($template.querySelector(".tradables ul + ul"), gamestate, $template.querySelector(".trade-names select").value);
    loadOptions($template.querySelector(".tradables ul"), gamestate, playername);
    $template.querySelector(".trade-names select").addEventListener("change", () => {
        loadOptions(
            $template.querySelector(".tradables ul + ul"),
            gamestate,
            $template.querySelector(".trade-names select").value
        )
    })
    _body.insertAdjacentElement("beforeend", $template);
}

function loadOptions($container, gamestate, playername) {
    const $template = document.querySelector("#trade").content.firstElementChild.cloneNode(true);
    let $li = $template.querySelector(".tradables ul li").cloneNode(true);
    $container.querySelectorAll("li").forEach(e => e.remove());
    gamestate["players"].forEach(player => {
        if (player.name == playername) {
            player["properties"].forEach(propertie => {
                let $copyli = $li.cloneNode(true);
                $copyli.querySelector("input").setAttribute("id", propertie.property);
                $copyli.querySelector("label").setAttribute("for", propertie.property);
                $copyli.querySelector("label").innerText = propertie.property;
                $container.insertAdjacentElement("beforeend", $copyli);
            })
        }
    });
}

function closePopup(e) {
    e.preventDefault();
    e.target.closest("article").remove();
}