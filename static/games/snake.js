document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("Snaking");
  const boardWidth = board.clientWidth;
  const boardHeight = boardWidth;
  const cellSize = boardWidth / 20;
  const initialSnakeLength = 3;
  const initialSnakeSpeed = 400; // in milliseconds
  const scoreStep = 100;

  let snakeSpeed = initialSnakeSpeed; // in milliseconds
  let gameTime = 0; //in milliseconds
  let score = 0; //in milliseconds
  let snake = [];
  let food = {};
  let direction = "right";
  let bufferedDirections = [];
  let intervalId = null;
  let isGameOver = false;
  let isGamePaused = false;

  function createSnake() {
    for (let i = initialSnakeLength - 1; i >= 0; i--) {
      snake.push({ x: i, y: 0, direction: direction });
    }
  }

  function createFood() {
    const foodX = Math.floor(Math.random() * (boardWidth / cellSize));
    const foodY = Math.floor(Math.random() * (boardHeight / cellSize));
    food = { x: foodX, y: foodY };
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === food.x && snake[i].y === food.y) {
        createFood();
      }
    }
  }

  function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
      const snakePart = document.createElement("div");
      snakePart.style.left = snake[i].x * cellSize + "px";
      snakePart.style.top = snake[i].y * cellSize + "px";

      snake[i].direction = direction;

      if (i === 0) {
        snakePart.classList.add("snake-head");
        snakePart.classList.add(direction);

        switch (direction) {
          case "up":
            snakePart.innerHTML =
              '<i class="eye fa-solid fa-circle-half-stroke"></i>';
            if (snake[i].x === food.x && snake[i].y - 1 === food.y) {
              snakePart.classList.add("eat");
            }
            break;
          case "down":
            snakePart.innerHTML =
              '<i class="eye fa-solid fa-circle-half-stroke fa-rotate-180"></i>';
            if (snake[i].x === food.x && snake[i].y + 1 === food.y) {
              snakePart.classList.add("eat");
            }
            break;
          case "left":
            snakePart.innerHTML =
              '<i class="eye fa-solid fa-circle-half-stroke fa-rotate-270"></i>';
            if (snake[i].x - 1 === food.x && snake[i].y === food.y) {
              snakePart.classList.add("eat");
            }
            break;
          case "right":
            snakePart.innerHTML =
              '<i class="eye fa-solid fa-circle-half-stroke fa-rotate-90"></i>';
            if (snake[i].x + 1 === food.x && snake[i].y === food.y) {
              snakePart.classList.add("eat");
            }
            break;
        }
      } else {
        snakePart.classList.add("snake-body");

        const currentElementDirecrtion = getElementDirection(
          snake[i],
          snake[i - 1]
        );

        switch (currentElementDirecrtion) {
          case "up":
            snakePart.innerHTML =
              '<i class="stripe fa-solid fa-ruler-horizontal fa-rotate-90"></i>';
            break;
          case "down":
            snakePart.innerHTML =
              '<i class="stripe fa-solid fa-ruler-horizontal fa-rotate-270"></i>';
            break;
          case "left":
            snakePart.innerHTML =
              '<i class="stripe fa-solid fa-ruler-horizontal"></i>';
            break;
          case "right":
            snakePart.innerHTML =
              '<i class="stripe fa-solid fa-ruler-horizontal fa-rotate-180"></i>';
            break;
        }
      }
      board.appendChild(snakePart);
    }
  }

  function getElementDirection(gamePart, prevPart) {
    if (gamePart.x > prevPart.x && gamePart.y === prevPart.y) {
      return "left";
    } else if (gamePart.x < prevPart.x && gamePart.y === prevPart.y) {
      return "right";
    } else if (gamePart.x === prevPart.x && gamePart.y > prevPart.y) {
      return "down";
    } else {
      return "up";
    }
  }

  function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.classList.add("food");
    foodElement.style.left = food.x * cellSize + "px";
    foodElement.style.top = food.y * cellSize + "px";
    board.appendChild(foodElement);
  }

  function clearBoard() {
    while (board.firstChild) {
      board.firstChild.remove();
    }
  }

  function moveSnake() {
    if (isGameOver) {
      clearInterval(intervalId);
      snakeSpeed = initialSnakeSpeed;
      alert("Game Over");
      return;
    }

    if (isGamePaused) {
      return;
    }

    const head = { x: snake[0].x, y: snake[0].y };

    const nextDirection = bufferedDirections.shift(); // Get next buffered direction

    if (nextDirection) {
      direction = nextDirection; // Update direction if a buffered direction is available
    }

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (checkCollision(head)) {
      isGameOver = true;
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      createFood();
      increaseScore();
    } else {
      snake.pop();
    }

    if (gameTime != 0 && gameTime % 60000 === 0) {
      snakeSpeed *= 0.75;
      clearInterval(intervalId);
      intervalId = setInterval(moveSnake, snakeSpeed);
    }

    gameTime += snakeSpeed;

    if (gameTime % 1000 === 0) {
      console.log(
        `Time: ${Math.floor(gameTime / 1000)} seconds; Speed: ${snakeSpeed}; Score: ${score}.`
      );
    }

    clearBoard();
    drawSnake();
    drawFood();
  }

  function increaseScore() {
    score += scoreStep;
  }

  function handleKeyPress(event) {
    const key = event.key;

    // Buffer the desired direction based on the key press
    switch (key) {
      case "ArrowUp":
        bufferedDirections.push("up");
        break;
      case "ArrowDown":
        bufferedDirections.push("down");
        break;
      case "ArrowLeft":
        bufferedDirections.push("left");
        break;
      case "ArrowRight":
        bufferedDirections.push("right");
        break;
    }
  }

  function checkCollision(head) {
    // Check if snake hits the walls
    if (
      head.x < 0 ||
      head.x >= boardWidth / cellSize ||
      head.y < 0 ||
      head.y >= boardHeight / cellSize
    ) {
      return true;
    }

    // Check if snake hits itself
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  }

  function startGame() {
    if (isGameOver) {
      isGameOver = false;
      snake = [];
      direction = "right";
      bufferedDirections = [];
      clearBoard();
      generateBoard();
      resetGameTime();

      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    if (!intervalId) {
      intervalId = setInterval(moveSnake, initialSnakeSpeed);
    } else if (isGamePaused) {
      isGamePaused = false;
      intervalId = setInterval(moveSnake, snakeSpeed);
    }
  }

  function generateBoard() {
    createSnake();
    createFood();
    drawSnake();
    drawFood();
  }

  function pauseGame() {
    clearInterval(intervalId);
    intervalId = null;
    isGamePaused = true;
  }

  function resetGameTime() {
    gameTime = 0;
  }

  function restartGame() {
    clearInterval(intervalId);
    intervalId = null;
    isGameOver = false;
    snake = [];
    direction = "right";
    bufferedDirections = [];
    clearBoard();
    generateBoard();
    resetGameTime();
    snakeSpeed = initialSnakeSpeed;
  }

  generateBoard();

  document.addEventListener("keydown", handleKeyPress);

  const startButton = document.getElementById("play");
  startButton.addEventListener("click", startGame);

  const pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", pauseGame);

  const restartButton = document.getElementById("restart");
  restartButton.addEventListener("click", restartGame);
});
