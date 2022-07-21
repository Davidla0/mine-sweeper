'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel
var gSelectedElCell = null
var gStartTime
var gGameInterval
var gSecond = 0
var gIsFirstClick
var gCellCoord

function initGame() {
    gIsFirstClick = false

    var elMsg = document.querySelector('.massage')
    var elBtn = document.querySelector('.again')
    elMsg.style.display = 'none'
    // elBtn.classList.toggle('massage')
    gLevel = {
        SIZE: 4,
        MINES: 2,
    }
    play()
}

function play() {

    gBoard = createBoard()
    renderBoard(gBoard)


}

function createBoard() {
    // Create the Matrix
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = createCell();
            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // create the mines
    for (let i = 0; i < gLevel.MINES; i++) {
        var idxI = getRandomInt(0, gLevel.SIZE)
        var idxJ = getRandomInt(0, gLevel.SIZE)
        while (idxJ === idxI) {
            idxJ = getRandomInt(0, gLevel.SIZE)
        }
        // console.log('idxI:', idxI)
        // console.log('idxJ:', idxJ)
        board[idxI][idxJ].isMine = true
    }


    // console.log(board);
    return board;
}

function renderBoard(board) {

    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // figure class name
            var className = 'valid'

            // add id to track!
            var tdId = `cell-${i}-${j}`

            if (gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = MINE

            } else {
                // count neighbors and add there value to minesAroundCount
                var negCount = setMinesNegsCount(i, j, gBoard)
                gBoard[i][j].minesAroundCount = (negCount) ? negCount : ' '

            }

            // set the position
            gBoard[i][j].position.i = i
            gBoard[i][j].position.j = j

            strHtml += `<td id="${tdId}" class="${className}" onmousedown="getClickIdx(event, this)">
            <span class="text">${gBoard[i][j].minesAroundCount}</span>
            </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function createCell() {
    var i = Infinity
    var j = Infinity

    var cell = {
        position: { i, j },
        minesAroundCount: 1,
        isShown: true,
        isMine: false,
        isMarked: false

    }
    return cell
}

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

function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

// which level do the player wanna play
function handleLevel(el) {
    gLevel = {}
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

}

function getClickIdx(e, element) {


    console.log(gBoard);
    if (!gIsFirstClick) {
        startTimer()
        gIsFirstClick = true
    }

    gSelectedElCell = element;
    gCellCoord = getCellCoord(gSelectedElCell.id);


    if (e.button === 0 && gBoard[gCellCoord.i][gCellCoord.j].isShown === true) {
        //MODEL
        // gBoard[gCellCoord.i][gCellCoord.j].isShown = false

        console.log('event: ', e)

        if (!gBoard[gCellCoord.i][gCellCoord.j].isMine) {  // if its not a mine

            if (gBoard[gCellCoord.i][gCellCoord.j].minesAroundCount === ' ') { // if the value don't have neighbors
                for (var i = gCellCoord.i - 1; i <= gCellCoord.i + 1; i++) {
                    if (i < 0 || i >= gBoard.length) continue;
                    for (var j = gCellCoord.j - 1; j <= gCellCoord.j + 1; j++) {
                        if (j < 0 || j >= gBoard[i].length) continue;                     // duplicate achusharmuta 
                        if (gBoard[i][j].isShown === false) continue;
                        gBoard[i][j].isShown = false
                        var cell = gBoard[i][j].position
                        gSelectedElCell = document.querySelector(`#cell-${cell.i}-${cell.j}`)
                        reveal()
                    }
                }

            } else { // if the value have neighbors
                //MODEL
                gBoard[gCellCoord.i][gCellCoord.j].isShown = false
                //DOM
                reveal()
            }

        }
        else {   // if its a mine

            // revel all the mines
            for (let i = 0; i < gBoard.length; i++) {
                for (let j = 0; j < gBoard[0].length; j++) {
                    if (gBoard[i][j].isMine === true) {
                        var cell = gBoard[i][j].position
                        gSelectedElCell = document.querySelector(`#cell-${cell.i}-${cell.j}`)
                        //DOM
                        reveal()
                    }
                }
            }

            msgToUsr(false)


        }

    } else if (e.button === 2) {
        console.log('right:', element)
        gBoard[gCellCoord.i][gCellCoord.j].isMarked = true
        var elText = element.querySelector('.text')
        elText.textContent = FLAG
        elText.style.display = 'block'
    }
    gameOver()
}

function gameOver() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine === true) {
                reveal()
            }
        }

    }
}


function checkTime(value) {
    return value > 9 ? value : "0" + value
}

function startTimer() {
    gGameInterval = setInterval(() => {
        document.getElementById("seconds").innerHTML = checkTime(++gSecond % 60)
        document.getElementById("minutes").innerHTML = checkTime(parseInt(gSecond / 60, 10))
    }, 1000);
}

function stopTimer() {
    clearInterval(gGameInterval)
}


// window.addEventListener('click', (event) => {
//     getClickIdx(event.button)
// })

// window.addEventListener('contextmenu', (event) => {
//     getClickIdx(event.button)
// })

window.addEventListener("contextmenu", e => e.preventDefault());



function reveal() {
    console.log(gSelectedElCell);
    gSelectedElCell.classList.toggle('checked')
    var elText = gSelectedElCell.querySelector('.text')
    elText.style.display = 'block'
}


function gameOver() {
    var markedCounter = 0
    var cellCounter = 0
    var length = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShown) cellCounter++
            if (gBoard[i][j].isMarked) markedCounter++
            length++
        }
    }

    // all mines marked and all cells revealed
    if (cellCounter + markedCounter === length) msgToUsr(true)


}

function msgToUsr(isWinner) {

    var elMsg = document.querySelector('.massage')
    var elBtn = document.querySelector('.again')

    stopTimer()
    if (isWinner) {
        elMsg.textContent = 'win'
    }
    else {
        elMsg.textContent = 'lose'
    }

    elMsg.style.display = 'block'
    elBtn.classList.toggle('massage')
}