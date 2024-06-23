let rollCount = 1

export function addRollCount(){
    rollCount++

    const numberElem = document.querySelector(".roll-number")

    numberElem.innerHTML = rollCount
}

export function subRollCount(){
    rollCount--

    const numberElem = document.querySelector(".roll-number")

    numberElem.innerHTML = rollCount
}