"use strict";

var grid;
var intervalTimer;
var board = document.getElementById('board');
var scoreDisplay = document.getElementById('score');
var startDisplay = document.getElementById('confirm-start');
var gamePlaying = true;
var currentTailPosition;
var score;

var snake = {
  position: [20,20],
  direction: 'r',
  coordinates: [[20,20]]
};

var included = function included(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i][0] === arr2[0] && arr1[i][1] === arr2[1]) return true;
  }
  return false;
};

var getFood = function getFood() {
  let first;
  let second;
  do {
    first = Math.floor(Math.random() * 40);
    second = Math.floor(Math.random() * 40);
  } while (included(snake.coordinates, [first, second]));
  return [first, second];
};

var food = {
  position: getFood()
};


var drawGrid = function() {
  let grid = new Array(40);
  for (let i = 0; i < 40; i++) {
    grid[i] = new Array(40);
  }
  return grid;
};

var directionHandler = function directionHandler(e) {
  let key = window.event ? e.keyCode : e.which;
  switch(key) {
    case 37:
      snake.direction = 'l';
      break;
    case 38:
      snake.direction = 'u';
      break;
    case 39:
      snake.direction = 'r';
      break;
    case 40:
      snake.direction = 'd';
      break;
  }
};

var updateCords = function updateCords(direction, cords) {
  switch (direction) {
    case 'l':
      return [cords[0], (cords[1])-1];
    case 'u':
      return [cords[0]-1, (cords[1])];
    case 'r':
      return [cords[0], (cords[1])+1];
    case 'd':
      return [cords[0]+1, (cords[1])];
    }
};

var clearGrid = function clearGrid() {
  for (let i = 0; i < snake.coordinates.length; i++) {
    let cords = snake.coordinates[i];
    let el = document.querySelector('._' + String(cords[0]) + '-' + String(cords[1]));
    el.classList.remove('snake');
  }
};

var addSnake = function addSnake() {
  for (let i = 0; i < snake.coordinates.length; i++) {
    let cords = snake.coordinates[i];
    let el = document.querySelector('._' + String(cords[0]) + '-' + String(cords[1]));
    el.classList.add('snake');
  }
};

var gameOver = function gameOver() {
  clearInterval(intervalTimer);
  gamePlaying = false;
  let playAgain = confirm("Play Again?");
  if (playAgain) reloadPage();
};

var eatenSelf = function eatenSelf(a) {
  var counts = [];
  for(var i = 0; i <= a.length; i++) {
    if(counts[a[i]] === undefined) {
      counts[a[i]] = 1;
    } else {
        return true;
      }
    }
  return false;
};

var checkGameOver = function checkGameOver() {
  for (let i = 0; i < snake.coordinates.length; i++) {
    let cords = snake.coordinates[i];
    if (cords[0] < 0 || cords[1] < 0 || cords[0] > 39 || cords[1] > 39 || eatenSelf(snake.coordinates)) {
      gameOver();
    }
  }
};

var addFood = function addFood() {
  let foodPosition = food.position;
  let el = document.querySelector('._' + String(foodPosition[0]) + '-' + String(foodPosition[1]));
  el.classList.add('food');
};

var compare = function compare(arr1, arr2) {
  if (arr1[0] == arr2[0] && arr1[1] == arr2[1]) {
    return true;
  }
  return false;
};

var updateScore = function updateScore() {
  scoreDisplay.innerHTML = '';
  if (snake.coordinates.length < 6) {
    score += 1;
  } else if (snake.coordinates.length < 11) {
    score += 5;
  } else if (snake.coordinates.length < 21) {
    score += 10;
  } else {
    score += 15;
  }
  scoreDisplay.innerHTML = score;
};

var foodEaten = function foodEaten() {
  let position = snake.coordinates[0];
  let foodPosition = food.position;
  if (compare(position, foodPosition)) {
    updateScore();
    let el = document.querySelector('.food');
    el.classList.remove('food');
    food.position = getFood();
    addFood();
    snake.coordinates.push(currentTailPosition);
  }
};

var updateSnakeCords = function updateSnakeCords() {
  let snakeHead = snake.coordinates[0];
  snake.coordinates[0] = updateCords(snake.direction, snake.coordinates[0]);
  if (snake.coordinates.length > 1) {
    for (let i = 1; i < snake.coordinates.length; i++) {
      let temp = snake.coordinates[i];
      snake.coordinates[i] = snakeHead;
      snakeHead = temp;
    }
  }
};

var move = function move() {
  clearGrid();
  currentTailPosition = snake.coordinates[(snake.coordinates.length)-1];
  updateSnakeCords();
  checkGameOver();
  if (gamePlaying) {
    addFood();
    addSnake();
    foodEaten();
    console.log(snake.coordinates.join('-'));
  }
};

var gameTurn = function gameTurn() {
  intervalTimer = setInterval(move, 70);
};

var render = function render(grid) {
  score = 0;
  scoreDisplay.innerHTML = score;
  for (let i = 0; i < grid.length; i++) {
    let el = document.createElement('div');
    el.classList.add('row');
    for (let j = 0; j < grid[i].length; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.classList.add('col-1');
      square.classList.add('_' + String(i) + '-' + String(j));
      el.appendChild(square);
    }
    board.appendChild(el);
  }
};

var gameLoop = function gameLoop() {
  gameTurn();
};

var startGame = function startGame() {
  document.removeEventListener('keydown', startGame);
  startDisplay.style.display = 'none';
  gameLoop();
};

var gameSetup = function gameSetup() {
  board.innerHTML = '';
  grid = drawGrid();
  render(grid);
  document.addEventListener('keydown', startGame);
};

var reloadPage = function reloadPage() {
  location.reload(false);
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', directionHandler);
  gameSetup();
});