const buttons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel")


console.log(buttons)
console.log(tabPanels)

function showPanel(index) {
    tabPanels.forEach((tabPanel) => {
        tabPanel.style.display = "none";
    })
    buttons.forEach((button) => {
        button.style.backgroundColor = "rgb(239, 239, 239)"
    })
    tabPanels[index].style.display = "block"
    buttons[index].style.background = "darkgray"
}

showPanel(0)