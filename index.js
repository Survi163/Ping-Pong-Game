const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
let player1Score = 0, player2Score = 0;
const winningScore = 5;
let gameOver = false;
let paddleSpeed = 6;

let player1 = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
let player2 = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4 };

let moveUp = false;
let moveDown = false;

// Controls for both paddles
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") moveUp = true;
    if (e.key === "ArrowDown" || e.key === "s") moveDown = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") moveUp = false;
    if (e.key === "ArrowDown" || e.key === "s") moveDown = false;
});

// Update game objects
function update() {
    if (gameOver) return;

    // Move both paddles together
    if (moveUp) {
        player1.y -= paddleSpeed;
        player2.y -= paddleSpeed;
    }
    if (moveDown) {
        player1.y += paddleSpeed;
        player2.y += paddleSpeed;
    }

    // Prevent paddles from going outside the canvas
    player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (ball.x <= player1.x + paddleWidth && ball.y >= player1.y && ball.y <= player1.y + paddleHeight) {
        ball.dx *= -1;
    }
    if (ball.x + ballSize >= player2.x && ball.y >= player2.y && ball.y <= player2.y + paddleHeight) {
        ball.dx *= -1;
    }

    // Score system
    if (ball.x < 0) {
        player2Score++;
        updateScore();
        resetBall();
    } else if (ball.x > canvas.width) {
        player1Score++;
        updateScore();
        resetBall();
    }
}

// Draw game objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "green";
    ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
    ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = "red";
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
}

// Update score display
function updateScore() {
    document.getElementById("player1Score").textContent = player1Score;
    document.getElementById("player2Score").textContent = player2Score;

    if (player1Score === winningScore || player2Score === winningScore) {
        endGame();
    }
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// End game logic
function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").style.display = "block";
    document.getElementById("winnerText").textContent = player1Score === winningScore ? "Player 1 Wins! 🎉" : "Player 2 Wins! 🏆";
}

// Reset game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    document.getElementById("gameOverScreen").style.display = "none";
    updateScore();
    resetBall();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
