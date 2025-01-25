const board = document.getElementById('board');
let currentPlayer = 'X';
let gameOver = false;
let playerXWins = 0;
let playerOWins = 0;
let gameMode = '';

const cells = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = i;
    cell.dataset.col = j;
    cell.addEventListener('click', cellClicked);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function cellClicked() {
  if (gameOver || this.textContent !== '') return;
  this.textContent = currentPlayer;
  if (checkWin()) {
    document.getElementById('result').textContent = `${currentPlayer} wygrywa!`;
    gameOver = true;
    updateScore();
    highlightWinner();
    return;
  }
  if (checkDraw()) {
    document.getElementById('result').textContent = "Remis!";
    gameOver = true;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (currentPlayer === 'O' && gameMode === 'komputer') {
    makeComputerMove();
  }
}

function checkWin() {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent) {
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

function minimax(board, depth, isMaximizing) {
  if (checkWin()) {
    return isMaximizing ? -1 : 1;
  } else if (checkDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        cells[i].textContent = '';
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        cells[i].textContent = '';
      }
    }
    return bestScore;
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'O';
      let score = minimax(cells, 0, false);
      cells[i].textContent = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function makeComputerMove() {
  const bestMove = getBestMove();
  cells[bestMove].textContent = currentPlayer;
  if (checkWin()) {
    document.getElementById('result').textContent = `${currentPlayer} wygrywa!`;
    gameOver = true;
    updateScore();
    highlightWinner();
    return;
  }
  if (checkDraw()) {
    document.getElementById('result').textContent = "Remis!";
    gameOver = true;
    return;
  }
  currentPlayer = 'X';
}

function reset() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('highlight');
  });
  document.getElementById('result').textContent = '';
  currentPlayer = 'X';
  gameOver = false;
}

function highlightWinner() {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent) {
      cells[a].classList.add('highlight');
      cells[b].classList.add('highlight');
      cells[c].classList.add('highlight');
      return;
    }
  }
}

function updateScore() {
  if (currentPlayer === 'X') {
    playerXWins++;
    document.getElementById('playerXWins').textContent = playerXWins;
  } else {
    playerOWins++;
    document.getElementById('playerOWins').textContent = playerOWins;
  }
}

function startGame(mode) {
  gameMode = mode;
  document.querySelector('.menu').style.display = 'none';
  document.getElementById('board').style.display = 'inline-grid';
  document.getElementById('resetBtn').style.display = 'inline-block';
  document.getElementById('returnToMenuBtn').style.display = 'inline-block';
  reset();
}

function resetScores() {
  playerXWins = 0;
  playerOWins = 0;
  document.getElementById('playerXWins').textContent = playerXWins;
  document.getElementById('playerOWins').textContent = playerOWins;
}

function returnToMenu() {
  document.querySelector('.menu').style.display = 'block';
  document.getElementById('board').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
  document.getElementById('returnToMenuBtn').style.display = 'none';
  reset();
}