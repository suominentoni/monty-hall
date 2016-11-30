const rl = require('readline-sync')

const random = getRandomDoorIndex()

function getRandomDoorIndex() {
    return Math.floor(Math.random() * 3) + 1
}

const doors = [
    {id:1, win: false, selected: false, open: false},
    {id:2, win: false, selected: false, open: false},
    {id:3, win: false, selected: false, open: false},
].map(d => {
    return random == d.id
        ? {id:d.id, win: true, selected: false, open: false}
        : d
})

let gameState = {
    doors: doors,
    hasAnsweredChangeDoorQuestion: false,
    game: true
}


function gameLoop(gameState) {
    const newState =
        !isADoorSelected(gameState)
        ? selectDoor(gameState)
        : !isOneDoorOpen(gameState)
        ? openNonWinningDoor(gameState)
        : !gameState.hasAnsweredChangeDoorQuestion
        ? askChangeDoorQuestion(gameState)
        : didWin(gameState)

    return newState.game
        ? gameLoop(newState)
        : finishGame(newState)
}

function isADoorSelected(g) {
    return g.doors
        .map(d => d.selected)
        .includes(true)
}

function selectDoor(g) {
    let selectedDoorId = rl.question('Choose a door (1-3): ')
    return setSelectedDoor(g, selectedDoorId)
}

function setSelectedDoor(g, selectedDoor) {
    const openDoor = (id) => {
        return g.doors.map(d => {
            return d.id == selectedDoor
                ? {id: d.id, win: d.win, selected: true, open: d.open}
                : {id: d.id, win: d.win, selected: false, open: d.open}
        })
    }

    return selectedDoor.match(/[1-3]/)
        ? updateGameState(
            openDoor(selectedDoor),
            g.hasAnsweredChangeDoorQuestion,
            g.game)
        : g
}

function isOneDoorOpen(g) {
    console.log("You chose door number " + g.doors.find(d => d.selected).id)
    return g.doors.reduce((c, d) => c ? c : d.open, false)
}

function openNonWinningDoor(g) {
    const doors = g.doors.map(d => {
        return !d.open && !d.win && !d.selected
            ? {id: d.id, win: d.win, selected: d.selected, open: true}
            : {id: d.id, win: d.win, selected: d.selected, open: d.open}
    })
    console.log(`Door number ${doors.find(d => d.open).id} is opened for you. There's a goat behind it.`)
    return updateGameState(doors, g.hasAnsweredChangeDoorQuestion, g.game)
}

function askChangeDoorQuestion(g) {
    let change = rl.question("Would you like to a) select the other door instead or b) stick to the current one? (a/b): ")

    return change.match(/a|b/)
        ? updateGameState(handleDoorChange(g, change), true, g.game)
        : g
}

function handleDoorChange(g, change) {
    return change === "a"
        ? changeDoor(g)
        : g.doors
}

function changeDoor(g) {
    console.log("You chose to select the other door instead")
    return g.doors.map((d) => {
        return !d.selected && !d.win
            ? {id: d.id, win: d.win, selected: true, open: d.open}
            : {id: d.id, win: d.win, selected: false, open: d.open}
    })
}

function didWin(g) {
    const didWin = g.doors.find(d => d.win && d.selected)

    didWin ? printWinMessage(g) : printLooseMessage(g)
    return updateGameState(g, g.hasAnsweredChangeDoorQuestion, false)
}

function printWinMessage(g) {
    console.log("\n************************************* YOU WIN *************************************")
    console.log(`You opened door number ${g.doors.find(d => d.selected).id} and there's a SPORTS CAR BEHIND IT`)
    console.log("***********************************************************************************\n")
}

function printLooseMessage(g) {
    console.log("\n******************************* YOU LOOSE *********************************")
    console.log(`You opened door number ${g.doors.find(d => d.selected).id} and there's a GOAT behind it`)
    console.log("***************************************************************************\n")
}

function updateGameState(doors, hasAnswered, game) {
    return {
        doors: doors,
        hasAnsweredChangeDoorQuestion: hasAnswered,
        game: game
    }
}

function finishGame(g) {
    console.log("Thanks for playing!\n")
}

gameLoop(gameState)

