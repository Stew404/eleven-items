import './style.css'

import items from "./items.json"

let passiveItems = items.filter(item => item.type === "passive")
let activeItems = items.filter(item => item.type === "active")

let usedPassiveIds = []
let usedActiveIds = []

document.querySelector('#app').innerHTML = `
  <div class="items-dispenser">
    <h2 class="dispenser-header">Выберите предмет</h2>
    <div class="dispenser-main"></div>
  </div>
  <div class="bottom-row">
    <div class="commands">
      <p class="commands-list"></p>
      <button class="commands-back">Назад</button>
    </div>
    <div class="inventory">
      <div class="inventory-build"></div>
      <div class="inventory-stock"></div>
    </div>
  </div>
`

function getRandomIds(count = 5, itemsArr = passiveItems){
  const randomIds = new Set()

  const usedIds = itemsArr[0].type === "active" ? usedActiveIds : usedPassiveIds

  console.log(usedIds)

  while (randomIds.size < count) {
    const number = Math.floor(Math.random()*itemsArr.length)

    if(!usedIds.includes(number)){
      randomIds.add(number)
    }
  }

  return [...randomIds]
}

function createItemNode(item) {

  const itemNode = document.createElement("div");

  itemNode.classList.add(`suggested-item`)
  itemNode.innerHTML = `
    <div class="suggested-item-img-wrapper">
      <img class="suggested-item-img" src="${item.icon.url}" alt="${item.name.en}" width="${item.icon.width}" height="${item.icon.height}">
    </div>
    <p class="suggested-item-quality">Качество: ${item.quality}</p>
    <button class="suggested-item-button" data-item-id="${item.id}">Выбрать</button>
  `
  return itemNode
}

let currentTurn = 1;

function getUndoFunctions(){
  let ids = []
  let itemsType = ""
  let lastAddedItemId = null

  const itemsArrays = {
    "active": activeItems,
    "passive": passiveItems
  }

  const setPrevState = (newIds, newItemsType, newLastAddedItemId)=>{
    ids = newIds
    itemsType = newItemsType
    lastAddedItemId = newLastAddedItemId
  }

  const returnToPrevState = ()=>{

    if(!ids.length){
      return
    }

    currentTurn--;

    renderSuggestedItems(ids, itemsArrays[itemsType]);

    const lastAddedItemElem = document.querySelector(`.inventory-item-wrapper[data-item-id="${lastAddedItemId}"]`)
    lastAddedItemElem.remove()
    updateCommandsList(lastAddedItemId, "delete")

    ids = []
  }
  
  return [setPrevState, returnToPrevState]
}

const [setPrevState, returnToPrevState] = getUndoFunctions();

const undoButton = document.querySelector(".commands-back")

undoButton.addEventListener("click", ()=>{
  returnToPrevState()
})


function renderSuggestedItems(ids = getRandomIds(), curItems = passiveItems){

  const itemsDispenserElem = document.querySelector(".items-dispenser .dispenser-main");

  itemsDispenserElem.innerHTML = ""

  for (let i = 0; i < ids.length; i++) {
    const item = curItems[ids[i]];

    const itemNode = createItemNode(item)

    itemNode
    .querySelector(`button`)
    .addEventListener("click", (e)=>{
      
      const isCurrentTurnEleventh = currentTurn % 11 === 0;

      if(isCurrentTurnEleventh){
        usedActiveIds = [...usedActiveIds, ...ids]
      } else {
        usedPassiveIds = [...usedPassiveIds, ...ids]
      }

      const curItemsType =  isCurrentTurnEleventh ? "active" : "passive";
      const curItemId = e.target.dataset.itemId

      addItemToInventory(curItemId);
      setPrevState(ids, curItemsType, curItemId);

      if(currentTurn % 11 === 10) {
        renderSuggestedItems(getRandomIds(5, activeItems), activeItems);
      } else {
        renderSuggestedItems();
      }

      currentTurn++;
    })
  
    itemsDispenserElem.appendChild(itemNode)

    setTimeout(() => {
      itemNode.style.opacity = "1";
    }, 1);
  }
}



function getCommandsListUpdater(){
  const commandsListElem = document.querySelector(".commands-list");
  const commandsMap = new Map();


  return (itemId, action)=>{
    if(action === "delete"){
      console.log(action)
      commandsMap.delete(itemId);
    }

    if(action === "set"){
      commandsMap.set(itemId, `giveitem c${itemId}`);
    }

    const commandsContent = commandsMap.values().reduce((acc, cur) => acc += `${cur}<br>`, "")
    commandsListElem.innerHTML = commandsContent

  }
}

const updateCommandsList = getCommandsListUpdater()

function addItemToInventory(itemId){
  const inventoryElem = document.querySelector(".inventory-build")

  const itemNode = document.createElement("div")
  const item = items.filter(item => item.id === parseInt(itemId))[0]
  
  itemNode.classList.add("inventory-item-wrapper")
  itemNode.dataset.itemId = itemId
  itemNode.draggable = true
  itemNode.innerHTML = `<img draggable="false" class="inventory-item-img" src="${item.icon.url}" alt="${item.name.en}">`

  inventoryElem.appendChild(itemNode);
  
  updateCommandsList(itemId, "set")

  
  
}

const buildListElem = document.querySelector(".inventory-build")
const stockListElem = document.querySelector(".inventory-stock")

buildListElem.addEventListener("dragstart", (e)=>{
  e.target.classList.add("dragged")
})

buildListElem.addEventListener("dragend", (e)=>{
  e.target.classList.remove("dragged")
})

stockListElem.addEventListener("dragstart", (e)=>{
  e.target.classList.add("dragged")
})

stockListElem.addEventListener("dragend", (e)=>{
  e.target.classList.remove("dragged")
})

function dragOverHandler (e, draggedElem){
  e.preventDefault()

  const curElem = e.target

  const isMoveable = draggedElem !== curElem 
    && (curElem.classList.contains("inventory-build") || curElem.classList.contains("inventory-stock"))

  if(!isMoveable){
    return
  }

  curElem.appendChild(draggedElem)
}

buildListElem.addEventListener("dragover", (e)=>{
  const draggedElem = document.querySelector(".dragged");
  dragOverHandler(e, draggedElem)

  updateCommandsList(draggedElem.dataset.itemId, "set")
})

stockListElem.addEventListener("dragover", (e)=>{
  const draggedElem = document.querySelector(".dragged");
  dragOverHandler(e, draggedElem)

  updateCommandsList(draggedElem.dataset.itemId, "delete")
})


renderSuggestedItems();



