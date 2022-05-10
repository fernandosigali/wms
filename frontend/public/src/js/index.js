const axios = require('axios');

const buttons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const apiUrl = 'http://10.167.1.25:8000/wms'
const wmsToken = '12345'

console.log(buttons)
console.log(tabPanels)

axios.defaults.headers.common['WMS-Webhook-Token'] = '12345';


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

window.showPanel = function(index) {
    tabPanels.forEach((tabPanel) => {
        tabPanel.style.display = "none";
    })
    buttons.forEach((button) => {
        button.style.backgroundColor = "rgb(239, 239, 239)"
        button.style.color = "black";
        button.style.fontWeight = "lighter";
    })

    tabPanels[index].style.display = "block";
    buttons[index].style.background = "rgba(255, 78, 2, 0.8)";
    buttons[index].style.color = "white";
    buttons[index].style.fontWeight = "bold";
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

showPanel(0);