import {pieces} from './pieces';

// cleanup, optimize, typescript, set piece

let Game = new Object();
let letters = "defghijk";
let opacity = [];
for (let i = 1.0; i >= 0.1; i-= 0.05) {
  opacity.push(i);
}


function initGame() {
  Game.gameId = "1";
  Game.started = false;
  Game.finished = false;
  Game.player = "";
  Game.opponent = "";
  Game.playerColor = "unknown";
  Game.halfMoves = 0;

  Game.board = {};
  for (let i of letters) {
    for (let j = 4; j < 12; j++) {
      Game.board[i+j] = {fogged: "false", halfMove: 0, piece: ""};
    }
  }
}

initGame();

function isGameStarted() {
  return document.querySelector(".moves-table-row") && !isGameFinished();
}

function logGameStarted() {
  console.log("Game #", Game.gameId,"started:", Game.player, "vs", Game.opponent);
}

function getGameId() {
  let parts = window.location.pathname.split("/");
  let next = false;
  for (let p of parts) {
    if (next) {
      return p;
    }
    if (p == "game") {
      next = true;
    }
  }
}

export function checkGameStart() {
  VM.observe(document.body, () => {
    if (isGameStarted()) {
      startGame();
      logGameStarted();
      observeMoves();
      return true; // disconnect observer
    }
  });
}

function startGame() {
  Game.started = true;
  Game.finished = false;
  Game.player = document.querySelector("#playerBox0 .playerbox-white-black-truncate-200").innerText;
  Game.opponent = document.querySelector("#playerBox2 .playerbox-white-black-truncate-200").innerText;
  Game.gameId = getGameId();

  if (opponentMoved()) {
    Game.playerColor = "black";
  } else {
    Game.playerColor = "white";
  }

  if (document.querySelector(".status-bar-pointer").innerText.search(Game.player) == -1 && document.querySelector(".status-bar-pointer").innerText.search(Game.opponent) == -1) {
    console.log("Spectator mode. Color set to white");
    Game.playerColor = "white";
  }

  console.log("Player color", Game.playerColor);

  Game.halfMoves = 0;

  setStartingBoard();
  drawBoard();
}

function isGameFinished() {
  return document.querySelector(".two-player-header") || window.location.pathname.split("/").pop() != getGameId();
}

function logGameFinished() {
  console.log("Game #", Game.gameId, "finished:", Game.player, "vs", Game.opponent);
}

function finishGame() {
  Game.started = false;
  Game.finished = true;
}

function isMoved() {
  let movesPointer = document.querySelectorAll(".moves-pointer");
  if (movesPointer.length > Game.halfMoves) {
    Game.halfMoves = movesPointer.length;
    return true;
  }
  return false;
}

function opponentMoved() {
  return getLastMove().title == "";
}

function getLastMove() {
  let movesPointer = document.querySelectorAll(".moves-pointer");
  let lastMove = movesPointer.item(movesPointer.length - 1);
  return lastMove;
}

// .moves-poiner span span innertext = ?
// or just check title != "" title gives info in chess corrds!!!

function observeMoves() {
  VM.observe(document.body, () => {

    if (isMoved()) {
      console.log("Moved. Half moves:", Game.halfMoves);
      setTimeout(redrawBoard, 1);
    }

    if (isGameFinished() || !isGameStarted()) {
      finishGame();
      logGameFinished();
      checkGameStart();
      return true; // disconnect observer
    }
  });
}

function isFogged(square) {
  return document.querySelector("#" + square).classList.contains("board-fogged-square");
}

function setStartingBoard() {
    for (let i of letters) {
      for (let j = 4; j < 12; j++) {
        Game.board[i+j] = {fogged: isFogged(i+j), halfMove: 1, piece: ""};
      }
    }

      for (let i of letters) {
        Game.board[i+10].piece = pieces.BlackPawn;
      }
      Game.board["e11"].piece = pieces.BlackKnight;
      Game.board["j11"].piece = pieces.BlackKnight;
      Game.board["f11"].piece = pieces.BlackBishop;
      Game.board["i11"].piece = pieces.BlackBishop;
      Game.board["d11"].piece = pieces.BlackRook;
      Game.board["k11"].piece = pieces.BlackRook;
      Game.board["g11"].piece = pieces.BlackQueen;
      Game.board["h11"].piece = pieces.BlackKing;

      for (let i of letters) {
        Game.board[i+5].piece = pieces.WhitePawn;
        Game.board[i+10].piece = pieces.BlackPawn;
      }
      Game.board["e4"].piece = pieces.WhiteKnight;
      Game.board["j4"].piece = pieces.WhiteKnight;
      Game.board["f4"].piece = pieces.WhiteBishop;
      Game.board["i4"].piece = pieces.WhiteBishop;
      Game.board["d4"].piece = pieces.WhiteRook;
      Game.board["k4"].piece = pieces.WhiteRook;
      Game.board["g4"].piece = pieces.WhiteQueen;
      Game.board["h4"].piece = pieces.WhiteKing;

}

function redrawBoard() {
  recalculateBoard();
  drawBoard();
}

function isPlayer(player) {
  if (player == "0" && Game.playerColor == "white") {
    return true;
  }
  if (player == "2" && Game.playerColor == "black") {
    return true;
  }
  return false;
}

function loadPieces(){
  for (let i of letters) {
    for (let j = 4; j < 12; j++) {
      if (!isFogged(i+j)){
        Game.board[i+j].fogged = false;
        Game.board[i+j].halfMove = Game.halfMoves;
        Game.board[i+j].piece = document.querySelector("#" + i + j).innerHTML;
      } else {
        Game.board[i+j].fogged = true;
      }
    }
  }
}

function up(i, j) {
  let j1 = j+1
  return i + j1;
}

function down(i, j) {
  let j1 = j-1
  return i + j1;
}

function upLeft(i, j) {
  if (letters.indexOf(i) == 0) {
    return "";
  }
  let i1 = letters[letters.indexOf(i)-1];
  let j1 = j+1
  return i1 + j1;
}

function upRight(i, j) {
  if (letters.indexOf(i) == 7) {
    return "";
  }
  let i1 = letters[letters.indexOf(i)+1];
  let j1 = j+1
  return i1 + j1;
}

function downLeft(i, j) {
  if (letters.indexOf(i) == 0) {
    return "";
  }
  let i1 = letters[letters.indexOf(i)-1];
  let j1 = j-1
  return i1 + j1;
}

function downRight(i, j) {
  if (letters.indexOf(i) == 7) {
    return "";
  }
  let i1 = letters[letters.indexOf(i)+1];
  let j1 = j-1
  return i1 + j1;
}

function redrawPawnAttackingSquares() {
  for (let i of letters) {
    for (let j = 4; j < 12; j++) {
      let piece = document.querySelector("#" + i + j + " img");
      if (!piece) {
        continue;
      }
      let piecePlayer = piece.dataset.player;
      let piecePiece = piece.dataset.piece;
      if (piecePiece == "P" && isPlayer(piecePlayer)) {
        //console.log("Your pawn on", i, j);
        let squares = [];
        if (Game.playerColor == "white") {
          squares.push(upLeft(i, j));
          squares.push(upRight(i, j));
        } else {
          squares.push(downLeft(i, j));
          squares.push(downRight(i, j));
        }

        for (let square of squares) {
          if (square && isFogged(square)) {
            document.querySelector("#" + square).classList = document.querySelector("#" + i+j).classList;
            document.querySelector("#" + square).innerHTML = "";
          }
        }

        // update the piece in front. Doesn't work if you just moved the pawn. Still pretty accurate though
        // seems to generate visibility bug on capture - wrong color??
        // let square = Game.playerColor == "white" ? up(i, j) : down(i, j);
        // if (isFogged(square) && Game.board[square].fogged) { // fogged now and was fogged on previous move
        //   Game.board[square].halfMove = Game.halfMoves;
        // }
      }
    }
  }
}


function recalculateBoard(){
  redrawPawnAttackingSquares();
  loadPieces();
}

function pieceColor(pieceHTML) {
  let dataPlayer = 'data-player="';
  let pos = pieceHTML.search(dataPlayer);
  let color = pieceHTML[pos + dataPlayer.length];
  return color;
}

function calculateOpacity(ij) {
  let halfMoveDiff = Game.halfMoves - Game.board[ij].halfMove;
  let index = Math.floor(halfMoveDiff/2);
  if (index >= opacity.length) {
    index = opacity.length-1;
  }
  //console.log("half move diff:", halfMoveDiff, "opacity:", opacity[index]);
  return opacity[index];
}

function drawOpacity(ij) {
  let img = document.querySelector("#" + ij + " img");
  let square = document.querySelector("#" + ij);
  if (isFogged(ij)) {
    square.style.opacity = (1-0.6*(1-calculateOpacity(ij)));
  } else {
    square.style.opacity = 1;
  }
  if (img) {
    if (isFogged(ij)) {
      img.style.opacity = calculateOpacity(ij);
    } else {
      img.style.opacity = 1;
    }
  }
}

function drawPieces(){
  for (let i of letters) {
    for (let j = 4; j < 12; j++) {
      if (isFogged(i+j)) {
        if (Game.board[i+j].piece != "" && !isPlayer(pieceColor(Game.board[i+j].piece))) {
          document.querySelector("#" + i + j).innerHTML = Game.board[i+j].piece;
        }
      }
      drawOpacity(i + j);
    }
  }
}

function drawBoard() {
  drawPieces();
}
