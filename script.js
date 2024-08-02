document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth < 400 ? window.innerWidth : 400;
    canvas.height = window.innerHeight < 300 ? window.innerHeight : 300;

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;
    let touchStartX = 0;
    let touchEndX = 0;

    let score = 0;

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    canvas.addEventListener('touchstart', touchStartHandler, false);
    canvas.addEventListener('touchmove', touchMoveHandler, false);
    canvas.addEventListener('touchend', touchEndHandler, false);

    function keyDownHandler(e) {
        if(e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if(e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if(e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function touchStartHandler(e) {
        touchStartX = e.touches[0].clientX;
    }

    function touchMoveHandler(e) {
        touchEndX = e.touches[0].clientX;
        let touchMoveDistance = touchEndX - touchStartX;

        if (touchMoveDistance > 0 && paddleX < canvas.width - paddleWidth) {
            paddleX += Math.min(7, touchMoveDistance);
        } else if (touchMoveDistance < 0 && paddleX > 0) {
            paddleX += Math.max(-7, touchMoveDistance);
        }

        touchStartX = touchEndX;
    }

    function touchEndHandler(e) {
        touchStartX = 0;
        touchEndX = 0;
    }

    function drawBall() {
        context.beginPath();
        context.arc(x, y, ballRadius, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function drawPaddle() {
        context.beginPath();
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function drawScore() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Score: " + score, 8, 20);
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawScore();

        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height - ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                score++;
            } else {
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
        }

        if(rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }

    const interval = setInterval(draw, 10);
}

function displayGreeting() {
    const name = document.getElementById('recruiterName').value;
    let message = '';

    if (name.length === 0) {
        message = "A name without any letters, that's new.";
    } else if (name.length === 1) {
        message = "Really, one letter name? Are you kidding me?";
    
    } else {
        message = `Hello, ${name}! Have a wonderful day.`;

        // Fireworks effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Play cheering sound
        const cheerAudio = document.getElementById('cheerAudio');
        cheerAudio.play();
    }

    document.getElementById('greetingMessage').innerText = message;
}
