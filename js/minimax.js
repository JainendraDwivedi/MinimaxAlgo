//setups------------------------------------------------------------------------>

let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

let cellW; // = (width / 3);
let cellH; // = (height / 3);

let ai = "X", player = "O", currentTurn = player;

function setup() {
  createCanvas(400, 400);
  cellW = width / 3;
  cellH = height / 3;
  bestMove();
}

function equal(a, b, c) {
    return a == b && b == c && a != "";
}

//code----------------------------------------------------------------------------------------->

function evaluate() {
    let winner = null;
  
    // rowwise
    for (let row = 0; row < 3; row++) {
      if (equal(board[row][0], board[row][1], board[row][2])) {
        winner = board[row][0];
      }
    }
  
    // columnwise
    for (let col = 0; col < 3; col++) {
      if (equal(board[0][col], board[1][col], board[2][col])) {
        winner = board[0][col];
      }
    }
  
    // diagonal
    if (equal(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    //anti diagonal
    if (equal(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }
  
    let f = false;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] == "") {
          f=true;
        }
      }
    }
  
    if (winner === null && f === false) {
      return "tie";
    } else {
      return winner;
    }
  }

function bestMove() {
  // AI makes its turn
  let best = -1000000;
  let move;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // if box available
      if (board[row][col] === "") {
        board[row][col] = ai;
        let score = minimax(board, 0, false);
        board[row][col] = ""; // undo your move

        if (score > best) {
          best = score;
          move = { row, col };
        }
      }
    }
  }
  board[move.row][move.col] = ai;
  currentTurn = player;
}

function minimax(board, depth, isMaximizer) {
  let result = evaluate();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizer) {
    let best = -1000000;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // if box available
        if (board[row][col] === "") {
          board[row][col] = ai;
          let score = minimax(board, depth + 1, false);
          board[row][col] = ""; // undo your move
          best = max(score, best);
        }
      }
    }
    return best;
  } else {
    let best = 1000000;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // if box available
        if (board[row][col] == "") {
          board[row][col] = player;
          let score = minimax(board, depth + 1, true);
          board[row][col] = ""; // undo your move
          best = min(score, best);
        }
      }
    }
    return best;
  }
}


//drawing ---------------------------------------------------------------------------->

function mousePressed() {
  if (currentTurn == player) {
    const row = floor(mouseX / cellW);
    const col = floor(mouseY / cellH);
    // player make turn

    // If valid turn
    if (board[row][col] == "") {
      board[row][col] = player;
      currentTurn = ai;
      bestMove();
    }
  }
}

function draw() {
  background(255);
  strokeWeight(4);

  line(cellW, 0, cellW, height);
  line(cellW * 2, 0, cellW * 2, height);
  line(0, cellH, width, cellH);
  line(0, cellH * 2, width, cellH * 2);

  // drawing of x-o in the grid
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      let x = cellW * row + cellW / 2;
      let y = cellH * col + cellH / 2;
      let box = board[row][col];
      textSize(32);
      let r = cellW / 4;
      if (box == player) {
        // circle
        noFill();
        ellipse(x, y, r * 2);
      } else if (box == ai) {
        // two intersected lines
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = evaluate();
  if (result != null) {
    noLoop();
    // game state
    let resultP = createP("");
    resultP.style("font-size", "42pt");
    resultP.style("text-align", "center");
    resultP.style("margin-top", "10px");
    if (result == "tie") {
      resultP.style("color", "limegreen");
      resultP.html("Khichdi!");
    } else {
      result == "X"
        ? resultP.style("color", "red")
        : resultP.style("color", "green");
      resultP.html(`${result} wins!`);
    }
  }
}