var diceArr = [];
var playerScores = [0];
var turnScore = 0;
var canRoll = true;
var canScore = false;
var player = 0;
var numPlayers = 1;

function initializeDice() {
  canScore = false;
  for (i = 1; i < 7; i++) {
    diceArr[i - 1] = {};
    diceArr[i - 1].id = "die" + i;
    diceArr[i - 1].value = i;
    diceArr[i - 1].clicked = 0;
    diceArr[i - 1].locked = 0;
  }
}

/*Rolling dice values*/
function rollDice() {
  canScore = true;
  if (canRoll == false) {
    document.getElementById("message").innerHTML =
      "You must score at least 1 die before re-rolling the remaining dice.";
  } else {
    document.getElementById("message").innerHTML = "";
    for (var i = 0; i < 6; i++) {
      if (diceArr[i].clicked == 0 && diceArr[i].locked != 1) {
        diceArr[i].value = Math.floor(Math.random() * 6 + 1);
      }
    }
    updateDiceImg();
    canRoll = false;
  }
}

// checks if remaining dice is a farkle
function checkForFarkle() {
  var numberCounts = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < 6; i++) {
    if (diceArr[i].locked != 1) {
      numberCounts[diceArr[i].value - 1]++;
    }
  }
  if (
    numberCounts[0] == 0 &&
    numberCounts[4] == 0 &&
    numberCounts[1] < 3 &&
    numberCounts[2] < 3 &&
    numberCounts[3] < 3 &&
    numberCounts[5] < 3
  ) {
    document.getElementById("farkle").innerHTML = "Farkle!";
    nextTurn();
  } else {
    document.getElementById("farkle").innerHTML = "";
  }
}

function nextTurn() {
  player = (player + 1) % numPlayers;
  document.getElementById("turn").innerHTML =
    "Player " + (player + 1) + "'s turn";
  turnScore = 0;
  updateScore();
  initializeDice();
  document.getElementById("message").innerHTML =
    "Roll the dice to start your turn.";
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg() {
  var diceImage;
  for (var i = 0; i < 6; i++) {
    diceImage = "images/" + diceArr[i].value + ".png";
    document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
    document.getElementById(diceArr[i].id).classList.remove("transparent");
  }
}

function diceClick(img) {
  var i = img.getAttribute("data-number");

  if (diceArr[i].locked !== 1) {
    img.classList.toggle("transparent");
    if (diceArr[i].clicked == 0) {
      diceArr[i].clicked = 1;
    } else {
      diceArr[i].clicked = 0;
    }
  }
}

// for purposes of this project I assumed dice must be scored before rerolling
// this function calculates the score of the selected dice and locks them
function scoreSelected() {
  var numberCounts = [0, 0, 0, 0, 0, 0];
  var valid = false;
  for (var i = 0; i < 6; i++) {
    if (diceArr[i].clicked == 1) {
      valid = true;
      numberCounts[diceArr[i].value - 1]++;
    }
  }
  if (!valid) {
    document.getElementById("message").innerHTML =
      "No dice are selected to score. Please select dice and try again.";
  } else {
    for (var i = 1; i < 6; i++) {
      if (i != 4) {
        if (numberCounts[i] % 3 != 0) {
          valid = false;
          document.getElementById("message").innerHTML =
            "Invalid selection of dice to score. Please refer to rules.";
        }
      }
    }
    if (valid) {
      turnScore += 100 * (numberCounts[0] % 3);
      turnScore += 50 * (numberCounts[4] % 3);
      numberCounts[0] -= numberCounts[0] % 3;
      numberCounts[4] -= numberCounts[4] % 3;
      turnScore += 1000 * (numberCounts[0] / 3);
      turnScore += 200 * (numberCounts[1] / 3);
      turnScore += 300 * (numberCounts[2] / 3);
      turnScore += 400 * (numberCounts[3] / 3);
      turnScore += 500 * (numberCounts[4] / 3);
      turnScore += 600 * (numberCounts[5] / 3);
      for (var i = 0; i < 6; i++) {
        if (diceArr[i].clicked == 1) {
          diceArr[i].locked = 1;
          diceArr[i].clicked = 0;
        }
      }
      canRoll = true;
      updateScore();
    }
  }
}

function updateScore() {
  document.getElementById("score").innerHTML = " " + turnScore + " ";
}

function updateScoreBoard() {
  var scoreboard = "";
  for (i = 0; i < numPlayers; i++) {
    var playNum = i + 1;
    scoreboard += "player " + playNum + ": " + playerScores[i] + "<br>";
  }
  document.getElementById("scoreboard").innerHtml = scoreboard;
}

function bankScore() {
  playerScores[player] += turnScore;
  if (playerScores[player] >= 10000) {
    finalTurn = true;
    finalPlayer = player;
  }
  nextTurn();
  updateScoreBoard();
}

function addPlayer() {
  numPlayers++;
  resetGame();
}

function removePlayer() {
  if (numPlayers > 1) numPlayers--;
  resetGame();
}

function resetGame() {
  for (i = 0; i < numPlayers; i++) {
    playerScores[i] = 0;
  }
  turnScore = 0;
  canRoll = true;
  player = 0;
  initializeDice();
  updateScoreBoard();
  document.getElementById("turn").innerHTML = "Player 1's turn";
  document.getElementById("message").innerHTML =
    "Roll the dice to start the game.";
}
