import getCommandsListUpdater from './commands'

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

export default function dragEventsInit(){

    const updateCommandsList = getCommandsListUpdater()

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
}
