const messageDisplay = document.querySelector('.message-container')
const tileDisplay = document.querySelector('.tile-container')
const wordleDisplay = document.querySelector('.panel-container')
const keyboard = document.querySelector('.key-container')

const wordles = ['HAPPY', 'B-DAY', 'SIMON']
const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-','ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let round = 0
let currentRow = 0
let currentTile = 0
let isFlipping = false
let isRoundOver = false
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow' + guessRowIndex)

    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow' + guessRowIndex + 'tile' + guessIndex)
        tileElement.classList.add('tile')

        rowElement.append(tileElement)
    })

    tileDisplay.append(rowElement)
})

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.setAttribute('id', key)
    buttonElement.textContent = key
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

document.addEventListener('keyup', (event) => handleType(event.key.toUpperCase(), event.code))

const handleClick = (letter) => {
    if (letter === '⌫' && currentTile > 0 && isRoundOver !== true && isGameOver !== true && isFlipping !== true) {
        deleteLetter()
    } else if (letter === 'ENTER' && isRoundOver !== true && isGameOver !== true && isFlipping !== true) {
        submitGuess()
    } else if (currentTile < 5 && isRoundOver !== true && isFlipping !== true && letter !== '⌫' && letter !== 'ENTER') {
        addLetter(letter)
    }
}

const handleType = (letter, keyCode) => {
    if (keyCode === 'Backspace' && currentTile > 0 && isRoundOver !== true && isGameOver !== true && isFlipping !== true) {
        deleteLetter()
    } else if (keyCode === 'Enter' && isRoundOver !== true && isGameOver !== true && isFlipping !== true) {
        submitGuess()
    } else if (currentTile < 5 && isRoundOver !== true && isFlipping !== true && keys.includes(letter)) {
        addLetter(letter)
    }
}

const addLetter = (letter) => {
    guessRows[currentRow][currentTile] = letter

    const tile = document.getElementById('guessRow'+ currentRow + 'tile' + currentTile)
    tile.setAttribute('data', letter)
    tile.textContent = letter
    tile.classList.add('bounce')

    currentTile++
}

const deleteLetter = () => {
    currentTile--

    guessRows[currentRow][currentTile] = ''

    const tile = document.getElementById('guessRow' + currentRow + 'tile' + currentTile)
    tile.setAttribute('data', '')
    tile.textContent = ''
    tile.classList.remove('bounce')
    tile.classList.remove('shake')
}

const submitGuess = () => {
    const guess = guessRows[currentRow].join('')

    if (currentTile > 4) {
        if (checkDictionary(guess) === true) {
            flipTile()

            if (guess === wordles[round]) {
                isRoundOver = true
                setTimeout(() => round++, 4300)
                danceTile()

                if (round === 0) {
                    showMessage('Nice, now for the second one!')

                    setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                    setTimeout(() => {
                        resetTiles()
                        resetKeyboard()
                        currentRow = 0
                        currentTile = 0
                    }, 4250)
                } else if (round === 1) {
                    showMessage('Great, just one more to go!')

                    setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                    setTimeout(() => {
                        resetTiles()
                        resetKeyboard()
                        currentRow = 0
                        currentTile = 0
                    }, 4250)
                }
                else {
                    showMessage('Happy birthday b!')

                    setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                    isGameOver = true
                }
            } else {
                if (currentRow === 5) {
                    isRoundOver = true
                    setTimeout(() => round++, 4300)

                    if (round === 0) {
                        showMessage('The word was ' + wordles[round] + '. Now try the second one!')

                        setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                        setTimeout(() => {
                            resetTiles()
                            resetKeyboard()
                            currentRow = 0
                            currentTile = 0
                        }, 4250)
                    } else if (round === 1) {
                        showMessage('The word was ' + wordles[round] + '. Now try one last time!')

                        setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                        setTimeout(() => {
                            resetTiles()
                            resetKeyboard()
                            currentRow = 0
                            currentTile = 0
                        }, 4250)
                    }
                    else {
                        showMessage('The word was  ' + wordles[round] + '. Nice try b!')

                        setTimeout(() => wordleDisplay.append(wordles[round] + ' '), 4250)
                        isGameOver = true
                    }
                }
                else if (currentRow < 5) {
                    currentRow++
                    currentTile = 0
                }
            }
        } else {
            showMessage('Not in word list')
            shakeTile()
        }
    }
}

const checkDictionary = (guess) => {
    if (guess === 'SIMON') {
        return true
    } else {
        const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + guess.toLowerCase()

        const http = new XMLHttpRequest()
        http.open('GET', url, false)
        http.send()

        return http.status !== 404
    }
}

const flipTile = () => {
    isFlipping = true

    const rowTiles = document.querySelector('#guessRow'+ currentRow).childNodes
    let checkWordle = wordles[round]
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'gray-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter === wordles[round][index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (guess.color !== 'green-overlay' && checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
        }, 500 * index)

        setTimeout(() => {
            addColourToKey(guess[index].letter, guess[index].color)
        }, 2500)
    })

    setTimeout(() => {
        isFlipping = false
    }, 2500)
}

const addColourToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const danceTile = () => {
    const rowTiles = document.querySelector('#guessRow'+ currentRow).childNodes

    setTimeout(() => {
        rowTiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('dance')
            }, 200 * index)
        })
    }, 2500)
}

const showMessage = (message) => {
    if (message === 'Not in word list') {
        const messageElement = document.createElement('p')
        messageElement.textContent = message
        messageDisplay.append(messageElement)
        setTimeout(() => messageDisplay.removeChild(messageElement), 750)
    } else {
        const messageElement = document.createElement('p')
        messageElement.textContent = message
        setTimeout(() => messageDisplay.append(messageElement), 2500)
        setTimeout(() => messageDisplay.removeChild(messageElement), 4250)
    }
}

const shakeTile = () => {
    const rowTiles = document.querySelector('#guessRow'+ currentRow).childNodes
    rowTiles.forEach((tile) => {
        tile.classList.remove('shake')
        setTimeout(() => tile.classList.add('shake'),5)
    })
}

const resetTiles = () => {
    guessRows.forEach((row, rowIndex) => {
        row.forEach((tile,tileIndex) => {
            guessRows[rowIndex][tileIndex] = ''

            const tileElement = document.getElementById('guessRow' + rowIndex + 'tile' + tileIndex)
            tileElement.setAttribute('data', '')
            tileElement.textContent = ''
            tileElement.classList.remove('bounce')
            tileElement.classList.remove('green-overlay', 'yellow-overlay', 'gray-overlay')
            tileElement.classList.remove('shake')
            tileElement.classList.remove('flip')
            tileElement.classList.remove('dance')
        })
    })

    isRoundOver = false
}

const resetKeyboard = () => {
    keys.forEach(key => {
        document.getElementById(key).classList.remove('green-overlay', 'yellow-overlay', 'gray-overlay')
    })
}