import getUserInput from "./playerInput.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const board = document.getElementById("board");
const score = document.getElementById("score");
score.innerText = "Score: 0";

/* Initialize game constants and variables */
const GAME_TICK_SPEED = 14;
const BOARD_SIZE = 24;

// Score points
let playerScore = 0;

// Positions
let posX = BOARD_SIZE / 2,
	posY = BOARD_SIZE / 2;

let food_posX = 0,
	food_posY = 0;

// Snake parameters
let snakeSize = 3,
	snakeStructure = [];

/* Game functions */
function renderSnake() {
	const TILE_SIZE = canvas.width / BOARD_SIZE;

	ctx.strokeStyle = "black";
	ctx.fillStyle = "green";

	// Ate food
	if (posX === food_posX && posY === food_posY) {
		food_posX = null;
		food_posY = null;
		snakeSize++;
		setScore(++playerScore);
	}

	// Draw snake from structure array
	for (let i = 0; i < snakeStructure.length; i++) {
		const {posX: _x, posY: _y} = snakeStructure[i];
		if (posX === _x && posY === _y) {
			snakeSize = 3;
			setScore(0);
		}
		ctx.fillRect(_x * TILE_SIZE + 1, _y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
	}

	while (snakeStructure.length >= snakeSize) {
		snakeStructure.shift(); // Remove elements to until snake size is reached
	}

	if (snakeStructure.length < snakeSize) snakeStructure.push({posX, posY}); // Save current snake tail part position
}

function generateFood() {
	// Generate random numbers, "floor" by implicit conversion to an integer using bitwise not, effectively dropping the decimal point
	food_posX = ~~(Math.random() * BOARD_SIZE);
	food_posY = ~~(Math.random() * BOARD_SIZE);

	// Check if the random number is not generated on the snake, re-generate if it is
	for (let i = 0; i < snakeStructure.length; i++) {
		const {posX: _x, posY: _y} = snakeStructure[i];
		if (food_posX === _x && food_posY === _y) {
			generateFood();
			break;
		}
	}
}

function renderFood() {
	const TILE_SIZE = canvas.width / BOARD_SIZE; // Tiles will be squares

	// Prevent generation if food already exists
	if (!food_posX && !food_posY) {
		generateFood();
	}

	ctx.fillStyle = "red";
	ctx.fillRect(food_posX * TILE_SIZE + 1, food_posY * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
}

function setScore(scr) {
	playerScore = scr;
	score.innerText = "Score: " + playerScore;
}

let lastFrame = 0;

// Main game function
function gameTick(timeStamp) {
	requestAnimationFrame(gameTick);

	if (timeStamp - lastFrame < (1 / GAME_TICK_SPEED) * 1000) return;
	lastFrame = timeStamp;

	canvas.width = board.clientWidth;
	canvas.height = board.clientHeight;

	// Move snake
	const {dirX, dirY} = getUserInput();
	posX += dirX;
	posY += dirY;

	// Warp
	if (posY >= BOARD_SIZE) posY = 0;
	if (posY < 0) posY = BOARD_SIZE - 1;
	if (posX >= BOARD_SIZE) posX = 0;
	if (posX < 0) posX = BOARD_SIZE - 1;

	renderFood();

	renderSnake();
}

gameTick();
