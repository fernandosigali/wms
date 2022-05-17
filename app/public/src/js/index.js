import axios from 'axios';
import io from 'socket.io-client';

const buttons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const innerAttributes = document.querySelectorAll(".inner-att-form")
const apiUrl = 'http://10.167.1.25:8000/wms'
const wmsToken = '12345'
const highlightedColor = "rgb(221, 221, 221)";
const basicColor = "rgb(188, 188, 188)";
const wsPort = 3001;
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

function translateAssetType(assetType) {
    assetType = assetType.toLowerCase();
    if (assetType === "coil" || assetType === 'bobina') {
        assetType = "1";
    } else if (assetType === 'sheet' || assetType === 'chapa') {
        assetType = "2";
    }
    return assetType
}

function getLoginData() {
    const username = document.getElementById("login-user").value;
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
        button.style.fontWeight = "lighter";
        button.style.borderWidth = "0px"
    })
    
    const currentWindowWidth = window.innerWidth;

    tabPanels.forEach((panel, nIndex) => {
        let translateX = `translateX(${nIndex*currentWindowWidth})`;
        console.log(translateX)
        panel.style.transform = translateX;
        console.log(panel)
    })

    buttons[index].style.background = highlightedColor;
    buttons[index].style.textShadow = "1px 0px 0px black";
    buttons[index].style.borderWidth = "1px 1px 0 1px"
}

window.showPanel = function(index) {

    buttons.forEach((button) => {
        button.style.backgroundColor = basicColor;
        button.style.textShadow = "0px 0px 0px black";
        button.style.borderWidth = "0px"
    })

    tabPanels[selectedPanel].style.display = "none"
    selectedPanel = index;
    tabPanels[index].style.display = "block";
    buttons[index].style.background = highlightedColor;
    buttons[index].style.textShadow = "1px 0px 0px black";
    buttons[index].style.borderWidth = "1px 1px 0 1px"
}

window.sendRequest = function(tab) {
    console.log("Sending request")
    let jsonData;
    switch (tab){
        case 0:
            console.log('case 0');
            jsonData = getLoginData();
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
        case 1:
            console.log('case 1');
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
        case 2:
            console.log('case 2');
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

const socket = io.connect(`http://10.167.1.223:${wsPort}`, {
    withCredentials: true,
    transports : ['websocket'] 
});


socket.on(('notification'), (data) => {
    console.log({data});
    const messagePanel = document.getElementById("notification-message");
    messagePanel.innerHTML = JSON.stringify(data, undefined, 4);
})


showPanelFirstTime(selectedPanel);