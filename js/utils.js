'use strict'


function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        mat[i] = []
        for (var j = 0; j < COLS; j++) {
            mat[i][j].push('')
        }
    }
    return mat
}

function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

/****************************************************/

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name
            // var tdId = `cell-${i}-${j}`;    // add id to track!

            strHtml += `<td id="${tdId}" class="${className}" onclick=""></td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function createBoard() {
    // Create the Matrix
    var board = []
    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        board[i] = []
        for (var j = 0; j < board[0].length; j++) {
            var cell = '';
            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    console.log(board);
    return board;
}

/****************************************************/

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)// `.cell-${location.i}-${location.j}`
    elCell.innerHTML = value
}
function getClassName(location) {
    //`[data-i="${i}"][data-j="${j}"]`
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

/****************************************************/

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

/****************************************************/

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}
/****************************************************/
// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}

/****************************************************/
// Gets array of numbers and returns it shuffled
function shuffleNums(nums) {
    var shuffledNums = []
    for (var i = 0; i < gMaxNum; i++) {
        var randIdx = getRandomInt(0, nums.length)
        var num = nums[randIdx]
        nums.splice(randIdx, 1)
        shuffledNums[i] = num
    }
    return shuffledNums
}

/****************************************************/
// returns a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/****************************************************/
// Gets date
function getTime() {
    return new Date().toString().split(' ')[4];
}

/****************************************************/
// counts neighbors
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j] === LIFE) neighborsCount++;
        }
    }
    return neighborsCount;
}

/****************************************************/
function getEmptyCells() {
    gEmptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameElement === null)
                gEmptyCells.push({ i, j })
        }
    }
    console.log('gEmptyCells.length:', gEmptyCells.length)
    return gEmptyCells
}

/****************************************************/
// returning a fixed number from array
function drawNum(gNums) {
    var randIdx = getRandomInt(0, gNums.length)
    var num = gNums[randIdx]
    gNums.splice(randIdx, 1)
    return num
}

/****************************************************/
function mergeSort(arr) {
    if (arr.length <= 1) return arr

    var middle = parseInt(arr.length / 2)
    var left = arr.slice(0, middle)
    var right = arr.slice(middle, arr.length)
    // N(LOG N)
    return merge(mergeSort(left), mergeSort(right))
}


// This function merges 2 sorted arrays into a single array
function merge(arr1, arr2) {
    var result = []
    // while there are items in both arrays
    while (arr1.length && arr2.length) {
        // push the smaller
        if (arr1[0] <= arr2[0]) {
            result.push(arr1.shift())
        } else {
            result.push(arr2.shift())
        }
    }
    // Add the remaining items
    while (arr1.length) result.push(arr1.shift())
    while (arr2.length) result.push(arr2.shift())

    return result
}

// O(N**2)
// Worst Case: [10, 9, 8, 1]
function bubbleSort(a) {
    var swapped = true
    while (swapped) {
        swapped = false
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i] > a[i + 1]) {
                var temp = a[i]
                a[i] = a[i + 1]
                a[i + 1] = temp
                swapped = true
            }
        }
    }
}

/****************************************************/
// items is a sorted array
function binarySearch(items, item) {
    // items is a sorted array
    // initial values for start, middle and end
    var leftIdx = 0
    var rightIdx = items.length - 1
    var middleIdx = Math.floor((leftIdx + rightIdx) / 2)
    // While the middle is not what we're looking for and the list does not have a single item
    while (leftIdx <= rightIdx) {
        if (items[middleIdx] === item) return middleIdx

        if (item < items[middleIdx]) {
            rightIdx = middleIdx - 1
        } else {
            leftIdx = middleIdx + 1
        }

        // recalculate middle on every iteration
        middleIdx = Math.floor((leftIdx + rightIdx) / 2)
    }
    return -1
}

// items is a sorted array
function binarySearchRecursion(items, item, leftIdx = 0, rightIdx = items.length - 1) {
    if (leftIdx > rightIdx) {
        return -1
    }
    var middleIdx = Math.floor((rightIdx + leftIdx) / 2)
    if (items[middleIdx] === item) {
        return middleIdx
    } else if (items[middleIdx] > item) {
        return binarySearchRecursion(items, item, leftIdx, middleIdx - 1)
    } else {
        return binarySearchRecursion(items, item, middleIdx + 1, rightIdx)
    }
}

