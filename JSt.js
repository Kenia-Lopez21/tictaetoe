const board = document.getElementById('game-board');
const resultDisplay = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');
const timeList = document.getElementById('time-list');

let playerTurn = true; 
let gameActive = true;
let startTime;
let moves = Array(9).fill(null);

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initBoard() {
    board.innerHTML = '';
    moves.fill(null);
    gameActive = true;
    playerTurn = true;
    startTime = null;
    resultDisplay.textContent = '';
    renderBestTimes();
    
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i;
        square.addEventListener('click', handlePlayerMove);
        board.appendChild(square);
    }
}

function handlePlayerMove(event) {
    const index = event.target.dataset.index;

    if (moves[index] || !gameActive) return;

    moves[index] = 'X';
    event.target.textContent = 'X'; // Cambia esto
    checkResult();

    if (gameActive) {
        setTimeout(handleComputerMove, 500);
    }
}

function handleComputerMove() {
    let emptySquares = moves.map((move, index) => move === null ? index : null).filter(index => index !== null);
    if (emptySquares.length === 0) return;

    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    moves[randomIndex] = 'O';
    const squares = document.querySelectorAll('.square');
    squares[randomIndex].textContent = 'O';
    checkResult();
}

function checkResult() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
            gameActive = false;
            if (moves[a] === 'X') {
                const endTime = Date.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                promptPlayerName(timeTaken);
                resultDisplay.textContent = `¡Ganaste en ${timeTaken} segundos!`;
            } else {
                resultDisplay.textContent = '¡La computadora ganó!';
            }
            return;
        }
    }

    if (!moves.includes(null)) {
        resultDisplay.textContent = '¡Es un empate!';
        gameActive = false;
    }
}

function promptPlayerName(time) {
    const playerName = prompt('¡Has ganado! Ingresa tu nombre para registrar tu tiempo:');
    if (playerName) {
        saveBestTime(playerName, time);
    }
}

function saveBestTime(name, time) {
    const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
    bestTimes.push({ name, time: parseFloat(time), date: new Date().toLocaleString() });
    bestTimes.sort((a, b) => a.time - b.time);
    bestTimes.splice(10);
    localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
    renderBestTimes();
}

function renderBestTimes() {
    const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
    timeList.innerHTML = bestTimes.length > 0
        ? bestTimes.map(entry => `<li>${entry.name}: ${entry.time} segundos (en ${entry.date})</li>`).join('')
        : '<li>No hay tiempos registrados.</li>';
}

restartBtn.addEventListener('click', () => {
    initBoard();
    if (!startTime) {
        startTime = Date.now();
    }
});

// Inicializa
window.onload = initBoard;
