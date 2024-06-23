const commandsMap = new Map();

const updateCommandsList = (itemId, action)=>{

  const commandsListElem = document.querySelector(".commands-list");
  if(action === "delete"){
    commandsMap.delete(itemId);
  }

  if(action === "set"){
    commandsMap.set(itemId, `giveitem c${itemId}`);
  }

  const commandsContent = commandsMap.values().reduce((acc, cur) => acc += `${cur}<br>`, "")
  commandsListElem.innerHTML = commandsContent

}

export default updateCommandsList