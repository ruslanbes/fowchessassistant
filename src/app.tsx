import {pieces} from './pieces';

// cleanup, optimize, typescript, set piece

type Square = {
  fogged: boolean;
  halfMove: number;
  piece: string;
}

type Board = {
  [key: string]: Square;
}

type Game = {
    gameId: string;
    started: boolean;
    finished: boolean;
    player: string;
    opponent: string;
    playerColor: string;
    halfMoves: number;
    board: Board;
}


const letters = "defghijk";
const opacity = [];
for (let i = 1.0; i >= 0.1; i-= 0.05) {
  opacity.push(i);
}

const game: Game = {
  gameId: "1",
  started: false,
  finished: false,
  player: "",
  opponent: "",
  playerColor: "",
  halfMoves: 0,
  board: {}
}

for (const i of letters) {
  for (let j = 4; j < 12; j++) {
    game.board[i+j] = {fogged: false, halfMove: 0, piece: ""};
  }
}

function isGameStarted() {
  return document.querySelector(".moves-table-row") && !isGameFinished();
}

function logGameStarted() {
  console.log("Game #", game.gameId,"started:", game.player, "vs", game.opponent);
}

function getGameId() {
  const parts = window.location.pathname.split("/");
  let next = false;
  for (const p of parts) {
    if (next) {
      return p;
    }
    if (p == "game") {
      next = true;
    }
  }
}

export function checkGameStart(): void {
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
  game.started = true;
  game.finished = false;
  game.player = document.querySelector("#playerBox0 .playerbox-white-black-truncate-200").innerText;
  game.opponent = document.querySelector("#playerBox2 .playerbox-white-black-truncate-200").innerText;
  game.gameId = getGameId();

  if (opponentMoved()) {
    game.playerColor = "black";
  } else {
    game.playerColor = "white";
  }

  if (document.querySelector(".status-bar-pointer").innerText.search(game.player) == -1 && document.querySelector(".status-bar-pointer").innerText.search(game.opponent) == -1) {
    console.log("Spectator mode. Color set to white");
    game.playerColor = "white";
  }

  console.log("Player color", game.playerColor);

  game.halfMoves = 0;

  setStartingBoard();
  drawBoard();
}

function isGameFinished() {
  return document.querySelector(".two-player-header") || window.location.pathname.split("/").pop() != getGameId();
}

function logGameFinished() {
  console.log("Game #", game.gameId, "finished:", game.player, "vs", game.opponent);
}

function finishGame() {
  game.started = false;
  game.finished = true;
}

function isMoved() {
  const movesPointer = document.querySelectorAll(".moves-pointer");
  if (movesPointer.length > game.halfMoves) {
    game.halfMoves = movesPointer.length;
    return true;
  }
  return false;
}

function opponentMoved() {
  return getLastMove().title == "";
}

function getLastMove() {
  const movesPointer = document.querySelectorAll(".moves-pointer");
  const lastMove = movesPointer.item(movesPointer.length - 1);
  return lastMove;
}

// .moves-poiner span span innertext = ?
// or just check title != "" title gives info in chess corrds!!!

function observeMoves() {
  VM.observe(document.body, () => {

    if (isMoved()) {
      console.log("Moved. Half moves:", game.halfMoves);
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
    for (const i of letters) {
      for (let j = 4; j < 12; j++) {
        game.board[i+j] = {fogged: isFogged(i+j), halfMove: 1, piece: ""};
      }
    }

      for (const i of letters) {
        game.board[i+10].piece = pieces.BlackPawn;
      }
      game.board["e11"].piece = pieces.BlackKnight;
      game.board["j11"].piece = pieces.BlackKnight;
      game.board["f11"].piece = pieces.BlackBishop;
      game.board["i11"].piece = pieces.BlackBishop;
      game.board["d11"].piece = pieces.BlackRook;
      game.board["k11"].piece = pieces.BlackRook;
      game.board["g11"].piece = pieces.BlackQueen;
      game.board["h11"].piece = pieces.BlackKing;

      for (const i of letters) {
        game.board[i+5].piece = pieces.WhitePawn;
        game.board[i+10].piece = pieces.BlackPawn;
      }
      game.board["e4"].piece = pieces.WhiteKnight;
      game.board["j4"].piece = pieces.WhiteKnight;
      game.board["f4"].piece = pieces.WhiteBishop;
      game.board["i4"].piece = pieces.WhiteBishop;
      game.board["d4"].piece = pieces.WhiteRook;
      game.board["k4"].piece = pieces.WhiteRook;
      game.board["g4"].piece = pieces.WhiteQueen;
      game.board["h4"].piece = pieces.WhiteKing;

}

function redrawBoard() {
  recalculateBoard();
  drawBoard();
}

function isPlayer(player) {
  if (player == "0" && game.playerColor == "white") {
    return true;
  }
  if (player == "2" && game.playerColor == "black") {
    return true;
  }
  return false;
}

function loadPieces(){
  for (const i of letters) {
    for (let j = 4; j < 12; j++) {
      if (!isFogged(i+j)){
        game.board[i+j].fogged = false;
        game.board[i+j].halfMove = game.halfMoves;
        game.board[i+j].piece = document.querySelector("#" + i + j).innerHTML;
      } else {
        game.board[i+j].fogged = true;
      }
    }
  }
}

function up(i, j) {
  const j1 = j+1
  return i + j1;
}

function down(i, j) {
  const j1 = j-1
  return i + j1;
}

function upLeft(i, j) {
  if (letters.indexOf(i) == 0) {
    return "";
  }
  const i1 = letters[letters.indexOf(i)-1];
  const j1 = j+1
  return i1 + j1;
}

function upRight(i, j) {
  if (letters.indexOf(i) == 7) {
    return "";
  }
  const i1 = letters[letters.indexOf(i)+1];
  const j1 = j+1
  return i1 + j1;
}

function downLeft(i, j) {
  if (letters.indexOf(i) == 0) {
    return "";
  }
  const i1 = letters[letters.indexOf(i)-1];
  const j1 = j-1
  return i1 + j1;
}

function downRight(i, j) {
  if (letters.indexOf(i) == 7) {
    return "";
  }
  const i1 = letters[letters.indexOf(i)+1];
  const j1 = j-1
  return i1 + j1;
}

function redrawPawnAttackingSquares() {
  for (const i of letters) {
    for (let j = 4; j < 12; j++) {
      const piece = document.querySelector("#" + i + j + " img");
      if (!piece) {
        continue;
      }
      const piecePlayer = piece.dataset.player;
      const piecePiece = piece.dataset.piece;
      if (piecePiece == "P" && isPlayer(piecePlayer)) {
        //console.log("Your pawn on", i, j);
        const squares = [];
        if (game.playerColor == "white") {
          squares.push(upLeft(i, j));
          squares.push(upRight(i, j));
        } else {
          squares.push(downLeft(i, j));
          squares.push(downRight(i, j));
        }

        for (const square of squares) {
          if (square && isFogged(square)) {
            document.querySelector("#" + square).classList = document.querySelector("#" + i+j).classList;
            document.querySelector("#" + square).innerHTML = "";
          }
        }

        // update the piece in front. Doesn't work if you just moved the pawn. Still pretty accurate though
        // seems to generate visibility bug on capture - wrong color??
        // let square = game.playerColor == "white" ? up(i, j) : down(i, j);
        // if (isFogged(square) && game.board[square].fogged) { // fogged now and was fogged on previous move
        //   game.board[square].halfMove = game.halfMoves;
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
  const dataPlayer = 'data-player="';
  const pos = pieceHTML.search(dataPlayer);
  const color = pieceHTML[pos + dataPlayer.length];
  return color;
}

function calculateOpacity(ij) {
  const halfMoveDiff = game.halfMoves - game.board[ij].halfMove;
  let index = Math.floor(halfMoveDiff/2);
  if (index >= opacity.length) {
    index = opacity.length-1;
  }
  //console.log("half move diff:", halfMoveDiff, "opacity:", opacity[index]);
  return opacity[index];
}

function drawOpacity(ij) {
  const img = document.querySelector("#" + ij + " img");
  const square = document.querySelector("#" + ij);
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
  for (const i of letters) {
    for (let j = 4; j < 12; j++) {
      if (isFogged(i+j)) {
        if (game.board[i+j].piece != "" && !isPlayer(pieceColor(game.board[i+j].piece))) {
          document.querySelector("#" + i + j).innerHTML = game.board[i+j].piece;
        }
      }
      drawOpacity(i + j);
    }
  }
}

function drawBoard() {
  drawPieces();
}
