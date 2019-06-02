// ==UserScript==
// @name         LVocab Google Translate Plugin
// @namespace    http://legendword.com/
// @version      0.1
// @description  LVocab Google Translate Plugin
// @author       Legendword
// @match        https://translate.google.com/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-idle
// ==/UserScript==

'use strict';

function lvocab_click() {
    //var wd = document.getElementsByClassName("gt-card-ttl-txt")[1].innerHTML;
    var wd = document.getElementById("source").value;
    var mn = document.getElementsByClassName("gt-cd-c")[1].innerHTML;
    var ts = document.getElementsByClassName("gt-cd-c")[0].innerHTML;
    if (document.getElementsByClassName("gt-cd")[0].style.display=="none") {
        ts = document.getElementsByClassName("tlid-translation translation")[0].innerHTML;
    }
    document.getElementsByClassName("gt-cd-tr")[1].innerHTML = "";
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost/LVocab/addnew.php",
        data: "word="+encodeURIComponent(wd)+"&meaning="+encodeURIComponent(mn)+"&translation="+encodeURIComponent(ts),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(msg) {
            if (msg.responseText=="success") {
                document.getElementsByClassName("lvocab-plugin-button")[0].children[0].innerHTML = "Added to LVocab";
                document.getElementsByClassName("lvocab-plugin-button")[0].children[0].style.color = "#0ab611";
            }
            else {
                document.getElementsByClassName("gt-cd-tr")[1].innerHTML = "Error when adding to LVocab:<br />"+msg.responseText;
            }
        }
    })
}

function lvocab_addBtn() {
    if ((!document.querySelector(".lvocab-plugin-button"))&&(!document.querySelector(".tlid-result-view.cllist.empty"))) {
        var dv = document.createElement("div");
        var dw = document.createElement("div");
        document.querySelectorAll(".gt-cd-tl")[1].appendChild(dv);
        dv.appendChild(dw);
        dv.setAttribute("class","tlid-input-button input-button header-button lvocab-plugin-button");
        dw.setAttribute("class", "text");
        dw.innerHTML = "Add to LVocab";
        dv.onclick = lvocab_click;
    }
}

function lvocab() {
    if (!document.querySelector(".tlid-result-view.cllist")) {
        //tlid-input-button input-button header-button
        GM_log("LVocab Plugin Loading...");
        setTimeout(lvocab, 100);
    }
    else {
        GM_log("LVocab Plugin Loaded (v0.1)");
        setInterval(lvocab_addBtn, 500);
    }
}

(function(){
    setTimeout(lvocab, 100);
    GM_addStyle(`
.gt-cd-tl>div {
display: inline-block;
}
.lvocab-plugin-button {
padding-left: 16px !important;
margin-left: 20px !important;
}
`);
})();