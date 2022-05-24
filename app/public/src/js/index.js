import axios from 'axios';


const buttons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const innerAttributes = document.querySelectorAll(".inner-att-form")
const apiUrl = 'http://10.167.1.25:8000/wms'
const wmsApiUrl = 'http://10.167.1.223:3001'
const wmsToken = '12345'
const selectedButtonColor = "rgb(221, 221, 221)";
const basicColor = "rgb(188, 188, 188)";
const messagePanelNumber = 4;
const equip_tag = "EQP-12";

let nonReadedMessage = false;
let selectedPanel = 0;

console.log(buttons)
console.log(tabPanels)

axios.defaults.headers.common['WMS-Webhook-Token'] = wmsToken;


innerAttributes.forEach((innerAttDiv) => {
    const input = innerAttDiv.children[1]
    input.addEventListener('focus', (event) => {
        const attFormWidth = innerAttDiv.offsetWidth;
        const labelWidth = innerAttDiv.children[0].offsetWidth;
        const inputWidth = attFormWidth - labelWidth;
        const padding = 10;
        input.style.width = `${inputWidth-4-padding}px`;
    })
    input.addEventListener('focusout', (event) => {
        if (input.value === '') {
           input.style.width = '0px';
        }
    })
    innerAttDiv.addEventListener('click', (event) => {
        input.focus();
    })
})


window.addEventListener('resize', (event) => {
    resizeSwiper(selectedPanel);
})


function translateAssetType(assetType) {
    assetType = assetType.toLowerCase();
    if (assetType === "coil" || assetType === 'bobina') {
        assetType = "1";
    } else if (assetType === 'sheet' || assetType === 'chapa') {
        assetType = "2";
    }
    return assetType
}

function getLoginWMSData() {
    const username = document.getElementById("login-wms-user").value;
    const password = document.getElementById("login-wms-password").value;
    
    const data = {
        username,
        password,
        equip_tag,
    }
    return data
}

function getLoginReqData() {
    const username = document.getElementById("login-req-user").value;
    const equip_tag = document.getElementById("equip-wms-key").value;

    const data = {
        username,
        equip_tag
    }

    return data
}

function getMoveOrderData() {
    console.log('move order data')
    const assetName = document.getElementById("move-order-asset-name").value;
    const assetType = translateAssetType(document.getElementById("move-order-asset-type").value);
    const asset = {
        name: assetName,
        type: assetType
    };
    
    const finalYard = document.getElementById("final-yard").value;
    const finalPack = document.getElementById("final-pack").value;
    const final_position = {
        yard: finalYard,
        pack: finalPack
    };
    
    const initialYard = document.getElementById("initial-yard").value;
    const initialPack = document.getElementById("initial-pack").value;
    const initial_position = {
        yard: initialYard,
        pack: initialPack
    } 
    
    console.log({initial_position})
    const username = document.getElementById("move-order-user").value;
    
    return {
        asset,
        final_position,
        initial_position,
        username,
        code: "INST1",
    }
}

function getNewAssetData() {
    const assetName = document.getElementById("new-asset-asset-name").value;
    const assetType = translateAssetType(document.getElementById("new-asset-asset-type").value);
    const asset = {
        name: assetName,
        type: assetType
    };

    return [{
        name: assetName,
        type: assetType
    }]
}

function printOnLog(data) {
    const logPanel = document.getElementById('log-panel');
    logPanel.style.display = "block";

    const logBody = document.getElementsByClassName('log-body')[0];
    logBody.innerHTML = JSON.stringify(data, null, 4);
}


function showPanelFirstTime(index) {
    buttons.forEach((button) => {
        button.style.backgroundColor = basicColor;
        button.style.textShadow = "0px 0px 0px black";
        button.style.borderWidth = "0px"
    })

    const messagePanel = document.getElementById("notification-message");
    messagePanel.innerHTML = JSON.stringify({
        "message": "Nenhuma mensagem recebida"
    }, undefined, 4);
    resizeSwiper(index) 

    selectedPanel = index;
    selectButton(buttons[index])
}


function resizeSwiper(selectedPanel) {
    const currentWindowWidth = window.innerWidth;
    const currentBodyMargin = parseInt(window.getComputedStyle(document.querySelector("body")).margin);
    tabPanels.forEach((panel, nIndex) => {
        const currentStyle = window.getComputedStyle(panel, null);
        const tabPanelWidth = parseInt(currentStyle.width) + parseInt(currentStyle.paddingLeft)*2;
        const diffIndex = nIndex - selectedPanel;
        let translateX = diffIndex*currentWindowWidth;
        const left = currentWindowWidth/2 - tabPanelWidth/2 - currentBodyMargin;
        panel.style.left = `${left + translateX}px`;
        panel.style.transition = "left 2s cubic-bezier(0.075, 0.82, 0.165, 1)";
    })
};

function resetButton(button) {
    button.style.backgroundColor = basicColor;
    button.style.textShadow = "0px 0px 0px black";
    button.style.borderWidth = "0px";
    button.style.borderColor = "darkgray"
}

function selectButton(button) {
    button.style.background = selectedButtonColor;
    button.style.textShadow = "1px 0px 0px black";
    button.style.borderWidth = "1px 1px 0 1px";
    button.style.borderColor = "darkgray"
}

function highlightButton(button) {
    button.style.transition = 'background 2s cubic-bezier(0.075, 0.82, 0.165, 1), border-color 4s cubic-bezier(0.075, 0.82, 0.165, 1)';
    button.style.background = 'rgb(162 213 161)';
    button.style.borderWidth = "1px 1px 1px 1px";
    // button.style.borderColor = 'rgb(162 213 161)'
}

window.showPanel = function(index) {

    buttons.forEach((button, buttonIndex) => {
        if (buttonIndex !== messagePanelNumber) {
            resetButton(button);
        } else {
            if (!nonReadedMessage) {
                resetButton(button)
            }
        }
    })

    resizeSwiper(index) 
    if (index === messagePanelNumber) {
        nonReadedMessage = false;
    }

    selectedPanel = index;
    selectButton(buttons[index])
}

window.sendRequest = function(tab) {
    console.log("Sending request")
    let jsonData;
    switch (tab){
        case 0:
            console.log('case 0');
            jsonData = getLoginWMSData();
            console.log(jsonData)
            axios.post(`${wmsApiUrl}/login/`, jsonData)
            .then((response) => {
                console.log(response)
                printOnLog(response)
            })
            .catch((err) => {
                printOnLog(err)
            })
            break;
        case 1:
            console.log('case 1');
            jsonData = getLoginReqData();
            console.log(jsonData)
            axios.post(`${apiUrl}/login/`, jsonData)
            .then((response) => {
                console.log(response)
                printOnLog(response)
            })
            .catch((err) => {
                printOnLog(err)
            })
            break;
        case 2:
            console.log('case 2');
            jsonData = getMoveOrderData();
            console.log(jsonData)
            axios.post(`${apiUrl}/instruction/`, jsonData)
            .then((response) => {
                console.log(response)
                printOnLog(response)
            })
            .catch((err) => {
                printOnLog(err)
            })
            break;
        case 3:
            console.log('case 3');
            jsonData = getNewAssetData();
            console.log(jsonData)
            axios.post(`${apiUrl}/assets/`, jsonData)
            .then((response) => {
                console.log(response)
                printOnLog(response)
            })
            .catch((err) => {
                printOnLog(err)
            })
            break;
    }
}

const websocket = require('./websocket');

websocket.socket.on(('notification'), (data) => {
    console.log({data});
    const messagePanel = document.getElementById("notification-message");
    messagePanel.innerHTML = JSON.stringify(data, undefined, 4);
    if (selectedPanel !== messagePanelNumber) {
        console.log('Different')
        console.log(buttons)
        nonReadedMessage = true;
        highlightButton(buttons[messagePanelNumber])
    }
})

showPanelFirstTime(selectedPanel);