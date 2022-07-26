'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '😃'
const LOOSE = '🤯'
const WIN = '😎'
const LIFE = '♥️'
const HINT = '💡'

var gBoard
var gLevel
var gSelectedElCell = null
var gElement
var gStartTime
var gGameInterval
var gSeconde
var gIsFirstClick
var gCellCoord
var gClickCount
var gLife
var gGame
var gBestScore
var gIsHint
var gHint

function initGame() {
    // game init
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    // life init
    gLife = 3
    var elCount = document.querySelector('.life-counter')
    elCount.textContent = `${LIFE.repeat(gLife)}`

    gIsFirstClick = false

    gIsHint = false
    gHint = 3
    var elHint = document.querySelector('.hint-counter')
    elHint.textContent = `${HINT.repeat(gLife)}`

    // time init
    gSeconde = 0
    document.getElementById("seconds").textContent = '00'
    document.getElementById("minutes").textContent = '00'
    stopTimer()

    // msg init for display none
    var elMsg = document.querySelector('.massage')
    elMsg.style.display = 'none'

    // again (smiley) init 
    var elBtn = document.querySelector('.again')
    elBtn.textContent = NORMAL

    document.getElementById("best-record").hidden = true

    // board default level init
    gLevel = {
        SIZE: 4,
        MINES: 2,
    }

    // start to play
    play()
}

function play() {
    // create the board game
    // MODEL
    gBoard = createBoard()

    // DOM
    renderBoard()


}
// MODEL
function createBoard() {
    // Create the Matrix
    var board = []

    // length according to the level 
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            // create the cell obj 
            var cell = createCell();

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // create the mines
    createMines(board)


    // console.log(board);
    return board;
}

function createCell() {


    var cell = {
        minesAroundCount: 1,
        isShown: true,
        isMine: false,
        isMarked: false,
    }
    return cell
}

function createMines(board) {

    for (let i = 0; i < gLevel.MINES; i++) {
        var idxI = getRandomInt(0, gLevel.SIZE)
        var idxJ = getRandomInt(0, gLevel.SIZE)
        board[idxI][idxJ].isMine = true
    }

}

/****************************************/
//DOM
function renderBoard() {

    var strHtml = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            // add id to track!
            var tdId = `cell-${i}-${j}`

            // if mine add the mine img to minesAroundCount
            if (gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = MINE

            } else {
                // count neighbors and add there value to minesAroundCount
                var negsCount = setMinesNegsCount(i, j, gBoard)
                // if the value is 0 add space instead
                gBoard[i][j].minesAroundCount = (negsCount) ? negsCount : ' '
            }


            strHtml += `<td id="${tdId}" class="valid" onmousedown="getClickIdx(event, this)">
            <span class="text">${gBoard[i][j].minesAroundCount}</span>
            </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml

}

/****************************************/
// neighbors function
function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

/****************************************/

function getClickIdx(e, element) {
    // the player cant play
    if (!gGame.isOn) return
    // if clicked on the hint
    if (gIsHint) {
        var hintInterval = setInterval(() => {
            expandShown()
        }, 1000)

        setTimeout(() => {
            clearInterval(hintInterval)
            unExpandShown()
        }, 1500);


    }
    gIsHint = false


    // start the timer
    if (!gIsFirstClick) startTimer()
    gIsFirstClick = true

    // catch the element from the DOM in the MODEL
    gElement = element
    gCellCoord = getCellCoord(gElement.id)
    gSelectedElCell = gBoard[gCellCoord.i][gCellCoord.j]




    // left clicked
    // and cell that didn't open yet
    // and cell that didn't marked
    if (e.button === 0 && gSelectedElCell.isShown === true && !gSelectedElCell.isMarked) {


        // if its not a mine
        if (!gSelectedElCell.isMine) {

            leftClickCell()
        }

        // if its a mine
        else {
            leftClickMine()
        }
        //right clicked
    } else if (e.button === 2 && gSelectedElCell.isShown === true) {
        rightClick()
    }


    checkGameOver()
}

function rightClick() {

    if (!gSelectedElCell.isMarked) {
        // update the MODEL
        gSelectedElCell.isMarked = true
        gGame.markedCount++

        // add a flag at the DOM
        var elText = gElement.querySelector('.text')
        elText.textContent = FLAG
        elText.style.display = 'block'
    }
    else {
        // update the MODEL
        gSelectedElCell.isMarked = false
        gGame.markedCount--

        // add a flag at the DOM
        var elText = gElement.querySelector('.text')
        elText.textContent = ' '
        elText.style.display = 'none'
    }
}

function leftClickCell() {
    // if the value don't have mines neighbors then reveal all the neighbors
    if (gSelectedElCell.minesAroundCount === ' ') {
        expandShown()
        // if the value have neighbors
    } else {
        //MODEL
        gSelectedElCell.isShown = false
        //DOM
        reveal()
    }


}

function leftClickMine() {
    // attempts left -1
    gLife--

    // there are still attempts left
    if (gLife > 0) {
        // reveal the mine MODEL
        gSelectedElCell.isShown = false
        //DOM
        reveal()
        // update the life counter at the DOM
        var elCount = document.querySelector('.life-counter')
        elCount.textContent = `${LIFE.repeat(gLife)}`
    }
    else {
        // revel all the mines
        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine === true) {
                    var cell = { i, j }
                    gSelectedElCell.isShown = false
                    gElement = document.querySelector(`#cell-${cell.i}-${cell.j}`)
                    //DOM
                    reveal()
                }
            }
        }
        // display a massage to the user at the DOM
        msgToUsr(false)
    }
}

/****************************************/
var gAllReadyShown
function expandShown() {
    gAllReadyShown = []
    for (var i = gCellCoord.i - 1; i <= gCellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = gCellCoord.j - 1; j <= gCellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            // if the cell is already reveal                   
            if (gBoard[i][j].isShown === false) continue


            // update the MODEL
            gBoard[i][j].isShown = false
            var cell = { i, j }
            // update the DOM
            gElement = document.querySelector(`#cell-${cell.i}-${cell.j}`)
            reveal()
        }
    }
}

function unExpandShown() {
    for (var i = gCellCoord.i - 1; i <= gCellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = gCellCoord.j - 1; j <= gCellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            // update the MODEL
            gBoard[i][j].isShown = true
            var cell = { i, j }

            // update the DOM
            gGame.shownCount--
            gElement = document.querySelector(`#cell-${cell.i}-${cell.j}`)
            gElement.classList.toggle('checked')
            var elText = gElement.querySelector('.text')
            elText.style.display = 'none'
        }
    }
}

/****************************************/

function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

/****************************************/

// which level do the player wanna play
function handleLevel(el) {
    var level = el.textContent[0]
    switch (level) {
        case '4':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;

        case '8':
            gLevel.SIZE = 8
            gLevel.MINES = 4
            break;

        case '1':
            gLevel.SIZE = 12
            gLevel.MINES = 6
            break;

    }
    play()

}
/****************************************/
function storage() {
    document.getElementById("best-record").hidden = false
    // localStorage.removeItem("basicLevel");
    // localStorage.removeItem("mediumLevel");
    // localStorage.removeItem("hardLevel");
    if (gLevel.SIZE === 4) {
        localStorage.basicLevel = 1000
        if (gGame.secsPassed < localStorage.basicLevel) {
            localStorage.basicLevel = gGame.secsPassed
            // Retrieve
            document.getElementById("best-record").innerHTML = `best score: ${localStorage.basicLevel}`
        }
    } else if (gLevel.SIZE === 8) {
        localStorage.mediumLevel = 10000

        if (gGame.secsPassed < localStorage.mediumLevel) {
            localStorage.mediumLevel = gGame.secsPassed
            // Retrieve
            document.getElementById("best-record").innerHTML = `best score: ${localStorage.mediumLevel}`
        }
    } else {
        localStorage.hardLevel = 10000

        if (gGame.secsPassed < localStorage.hardLevel) {
            localStorage.hardLevel = gGame.secsPassed
            // Retrieve
            document.getElementById("best-record").innerHTML = `best score: ${localStorage.hardLevel}`
        }
    }

}
/****************************************/
//timer//
function checkTime(value) {
    return value > 9 ? value : "0" + value
}

function startTimer() {
    gGameInterval = setInterval(() => {
        document.getElementById("seconds").innerHTML = checkTime(++gSeconde % 60)
        document.getElementById("minutes").innerHTML = checkTime(parseInt(gSeconde / 60, 10))
    }, 1000);
}

function stopTimer() {

    clearInterval(gGameInterval)
    gGame.secsPassed = gSeconde

}

/****************************************/

function hintHandler(el) {
    gHint--
    gIsHint = true
    el.textContent = `${HINT.repeat(gHint)}`
}
/****************************************/

function reveal() {
    gGame.shownCount++
    gElement.classList.toggle('checked')
    var elText = gElement.querySelector('.text')
    elText.style.display = 'block'
}

function checkGameOver() {

    var length = gBoard.length ** 2
    // all mines marked and all cells revealed
    console.log('gGame.shownCount:', gGame.shownCount)
    console.log(' gGame.markedCount:', gGame.markedCount)
    console.log('length:', length)
    if (gGame.shownCount + gGame.markedCount === length) msgToUsr(true)


}

function msgToUsr(isWinner) {
    gGame.isOn = false
    var elMsg = document.querySelector('.massage')
    var elBtn = document.querySelector('.again')
    stopTimer()
    if (isWinner) {
        elMsg.textContent = 'win'
        elBtn.textContent = WIN
        storage()
    }
    else {
        elMsg.textContent = 'lose'
        elBtn.textContent = LOOSE

    }

    elMsg.style.display = 'block'
}
/****************************************/

window.addEventListener("contextmenu", e => e.preventDefault());
