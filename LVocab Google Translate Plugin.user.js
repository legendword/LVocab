// ==UserScript==
// @name         LVocab Google Translate Plugin
// @namespace    http://legendword.com/
// @updateURL    https://github.com/legendword/LVocab/raw/master/LVocab%20Google%20Translate%20Plugin.user.js
// @version      0.2
// @description  LVocab Google Translate Plugin
// @author       Legendword
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @match        https://translate.google.ca/*
// @match        https://translate.google.co.uk/*
// @match        http://legendword.com/LVocab/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setClipboard
// @connect      legendword.com
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
        url: "http://legendword.com/LVocab/addnew.php",
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
        GM_log(GM_getValue("tsRequest"));
        setInterval(lvocab_addBtn, 500);
        GM_addValueChangeListener("tsRequest", function(name, oldv, newv, remote){
            if (remote==true&&newv=="1") translateWord();
        });
    }
}

function translateWordRequest() {
    if (document.getSelection().toString()==""||GM_getValue("tsRequest")=="1") return;
    GM_setValue("tsWord", document.getSelection().toString());
    GM_setValue("tsRequest", "1");
    GM_log("requested");
}

function translateWord() {
    var wd = GM_getValue("tsWord");
    GM_setValue("tsOriWord", document.getElementById("source").value);
    GM_setValue("tsOriCheck", document.getElementsByClassName("gt-card-ttl-txt")[1].innerHTML);
    document.getElementById("source").value = wd;
    setTimeout(translateWordAnswer, 100);
}

function translateWordAnswer() {
    if (GM_getValue("tsOriCheck")==document.getElementsByClassName("gt-card-ttl-txt")[1].innerHTML) {
        setTimeout(translateWordAnswer, 100);
        return;
    }
    if (document.getElementsByClassName("gt-cd")[1].style.display=="none") GM_setValue("tsMeaning", "");
    else GM_setValue("tsMeaning", document.getElementsByClassName("gt-cd-c")[1].innerHTML);
    if (document.getElementsByClassName("gt-cd")[0].style.display=="none") GM_setValue("tsTranslation", document.getElementsByClassName("tlid-translation translation")[0].innerHTML);
    else GM_setValue("tsTranslation", document.getElementsByClassName("gt-cd-c")[0].innerHTML);
    GM_setValue("tsRequest", "0");
    document.getElementById("source").value = GM_getValue("tsOriWord", "");
}

function lvocab_contextMenu(ev) {
    ev.preventDefault();
    document.getElementById("context-outer").style.top = ev.pageY+"px";
    document.getElementById("context-outer").style.left = ev.pageX+"px";
    document.getElementById("context-outer").style.display = "block";
}

function lvocab_contextMenuClose() {
    document.getElementById("context-outer").style.display = "none";
}

(function(){
    if (location.host=="legendword.com") {
        GM_log("LVocab Mode");
        if (GM_getValue("tsRequest")==null) {
            GM_setValue("tsRequest", "0");
        }
        document.body.addEventListener("contextmenu", lvocab_contextMenu);
        document.body.addEventListener("click", lvocab_contextMenuClose);
        document.getElementById("context-copy").addEventListener("click", function(){
            GM_setClipboard(document.getSelection().toString(), "text");
        });
        document.getElementById("context-lookup").addEventListener("click", translateWordRequest);
        GM_setValue("tsRequest", "0");
        GM_addValueChangeListener("tsRequest", function(name, oldv, newv, remote){
            if (remote==true&&newv=="0") {
                GM_log("Answer receiving...");
                $("#context-vocabWord").html(GM_getValue("tsWord"));
                $("#context-vocabMeaningContent").html(GM_getValue("tsMeaning"));
                $("#context-vocabTranslationContent").html(GM_getValue("tsTranslation"));
                $("#context-modal").modal();
            }
        });
    }
    else { //Google Translate
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
    }
})();
