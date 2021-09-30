document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let bombAmount = 20
    let flags = 0
    let currentTime = 999
    let squares = []
    let isGameOver = false
    let timerID
    const smiley = document.querySelector('.face')
    smiley.addEventListener('click', resetGame)
    const bombCounter = document.querySelector('.bomb-count')
    bombCounter.innerHTML = bombAmount
    const timer = document.querySelector('.timer')


    // random board
    function randomBoard() {
        // get shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = bombArray.concat(emptyArray)
        const shuffledArray = gameArray.sort(() => Math.random() -.5)
        return shuffledArray
    }

    // add numbers to squares
    function addNumbers() {
        for(let i = 0; i < width*width; i++) {
            let total = 0
            const isLeftEdge = i % width === 0
            const isRightEdge = i % width === 9
            
            if (squares[i].classList.contains('valid')) {
                // left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                // up-left
                if (i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                // up
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++
                // up-right
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                // right
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                // right-down
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                // down
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++
                // left-down
                if (i < 90 && !isLeftEdge && squares[i -1 + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
                // console.log(squares[i])
            }
        }
    }

    // create initial Board
    function createBoard() {
        const shuffledArray = randomBoard()
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', (e) => {
                click(square)
            })

            // cntrl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }
        addNumbers()
    }
    createBoard()

    // reset board with smiley
    function resetGame() {
        const shuffledArray = randomBoard()
        for (let i = 0; i < width*width; i++) {
            squares[i].classList.value = shuffledArray[i]
            squares[i].innerHTML = ''
        }
        addNumbers()
        flags = 0
        currentTime = 999
        isGameOver = false
        timerID = undefined  
        smiley.innerHTML = '🙂'
        timer.innerHTML = currentTime
        updateBombCounter()
        console.log(squares)
    }

    function updateBombCounter() {
        bombCounter.innerHTML = bombAmount - flags
    }

    // add flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🏴‍☠️'
                flags++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
            updateBombCounter()
        }
    }

    // timer
    function updateTimer() {
        currentTime--
        timer.innerHTML = currentTime
    }
    
    // click on square actions
    function click(square) {
        if (timerID === undefined) {
            timerID = setInterval(updateTimer, 1000)
        }
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0 ) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
        
    }
    
    // check neighboring square once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = currentId % width === 0
        const isRightEdge = currentId % width === 9

        setTimeout(() => {
            // left
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id
                //const newId = parseInt(currentId) - 1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // up-left
              if (currentId > 9 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 -width].id
                //const newId = parseInt(currentId) -1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // up
              if (currentId > 9) {
                const newId = squares[parseInt(currentId -width)].id
                //const newId = parseInt(currentId) -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // up-right
              if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 -width].id
                //const newId = parseInt(currentId) +1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // right
              if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id
                //const newId = parseInt(currentId) +1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // down-right
              if (currentId < 89 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 +width].id
                //const newId = parseInt(currentId) +1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // down
              if (currentId < 90) {
                const newId = squares[parseInt(currentId) +width].id
                //const newId = parseInt(currentId) +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
              // down-left
              if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 +width].id
                //const newId = parseInt(currentId) -1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
              }
            }, 10)
    }

    // Game Over
    function gameOver(square) {
        console.log('Game Over')
        isGameOver = true
        // Show all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
        smiley.innerHTML = '😵'
        clearInterval(timerID)
    }

    // check for win
    function checkForWin() {
        let matches = 0
        for(let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            }
            if (matches == bombAmount) {
                console.log('you won')
                smiley.innerHTML = '😎'
                isGameOver = true
                clearInterval(timerID)
            }
        }
    }

})