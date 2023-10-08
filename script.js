import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput()

function setupInput() {
    window.addEventListener("keydown", handleInput, {once: true})
}

async function handleInput(e){
    switch (e.key) {
        case "ArrowUp":
            await muveUp()
            break
            case "ArrowDown":
            await muveDown()
            break
            case "ArrowLeft":
            await muveLeft()
            break
            case "ArrowRight":
            await muveRight()
            break
            default:
                setupInput()
                return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    setupInput()
}

function muveUp() {
    return slideTiles(grid.cellsByColumn)
}

function muveLeft() {
    return slideTiles(grid.cellsByRow)
}

function muveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function muveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
    cells.flatMat(group => {
        const promises = []
       for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--){
            const moveToCell = group[j]
            if(!moveToCell.canAccept(cell.tile)) break
            lastValidCell = moveToCell
        }
        if(lastValidCell != null){
            promises.push(cell.tile.waitForTransition())
            if(lastValidCell.tile !== null){
                lastValidCell.mergeTile = cell.tile
            }else {
                lastValidCell.tile = cell.tile
            }
            cell.tile = null
        }
       }
       return promises
    })
)}