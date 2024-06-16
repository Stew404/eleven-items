export default function getCommandsListUpdater(){
  const commandsListElem = document.querySelector(".commands-list");
  const commandsMap = new Map();


  return (itemId, action)=>{
    if(action === "delete"){
      commandsMap.delete(itemId);
    }

    if(action === "set"){
      commandsMap.set(itemId, `giveitem c${itemId}`);
    }

    const commandsContent = commandsMap.values().reduce((acc, cur) => acc += `${cur}<br>`, "")
    commandsListElem.innerHTML = commandsContent

  }
}