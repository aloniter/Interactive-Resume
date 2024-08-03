// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to start the game
function startGame() {
    const canvas = document.getElementById('gameCanvas'); // Get the canvas element
    const context = canvas.getContext('2d'); // Get the drawing context for the canvas
    canvas.width = window.innerWidth < 400 ? window.innerWidth : 400; // Set canvas width
    canvas.height = window.innerHeight < 300 ? window.innerHeight : 300; // Set canvas height

    let x = canvas.width / 2; // Initial x position of the ball
    let y = canvas.height - 30; // Initial y position of the ball
    let dx = 2; // Change in x position per frame
    let dy = -2; // Change in y position per frame
    const ballRadius = 10; // Radius of the ball

    const paddleHeight = 10; // Height of the paddle
    const paddleWidth = 75; // Width of the paddle
    let paddleX = (canvas.width - paddleWidth) / 2; // Initial x position of the paddle

    let rightPressed = false; // Flag for right arrow key press
    let leftPressed = false; // Flag for left arrow key press
    let touchStartX = 0; // Initial x position of touch start
    let touchEndX = 0; // Initial x position of touch end

    let score = 0; // Initial score

    // Event listeners for keyboard input
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    // Event listeners for touch input
    canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    canvas.addEventListener('touchend', touchEndHandler, false);

    // Handler for key down events
    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true; // Set rightPressed to true when right arrow is pressed
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true; // Set leftPressed to true when left arrow is pressed
        }
    }

    // Handler for key up events
    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false; // Set rightPressed to false when right arrow is released
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false; // Set leftPressed to false when left arrow is released
        }
    }

    // Handler for touch start events
    function touchStartHandler(e) {
        e.preventDefault(); // Prevent default touch behavior
        touchStartX = e.touches[0].clientX; // Get initial touch start x position
    }

    // Handler for touch move events
    function touchMoveHandler(e) {
        e.preventDefault(); // Prevent default touch behavior
        touchEndX = e.touches[0].clientX; // Get touch end x position
        let touchMoveDistance = touchEndX - touchStartX; // Calculate distance moved by touch

        // Move paddle based on touch move distance
        if (touchMoveDistance > 0 && paddleX < canvas.width - paddleWidth) {
            paddleX += Math.min(7, touchMoveDistance);
        } else if (touchMoveDistance < 0 && paddleX > 0) {
            paddleX += Math.max(-7, touchMoveDistance);
        }

        touchStartX = touchEndX; // Update touch start x position
    }

    // Handler for touch end events
    function touchEndHandler(e) {
        e.preventDefault(); // Prevent default touch behavior
        touchStartX = 0; // Reset touch start x position
        touchEndX = 0; // Reset touch end x position
    }

    // Function to draw the ball
    function drawBall() {
        context.beginPath(); // Start drawing path
        context.arc(x, y, ballRadius, 0, Math.PI * 2); // Draw a circle (ball)
        context.fillStyle = "#0095DD"; // Set fill color
        context.fill(); // Fill the ball with color
        context.closePath(); // Close drawing path
    }

    // Function to draw the paddle
    function drawPaddle() {
        context.beginPath(); // Start drawing path
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); // Draw a rectangle (paddle)
        context.fillStyle = "#0095DD"; // Set fill color
        context.fill(); // Fill the paddle with color
        context.closePath(); // Close drawing path
    }

    // Function to draw the score
    function drawScore() {
        context.font = "16px Arial"; // Set font
        context.fillStyle = "#0095DD"; // Set fill color
        context.fillText("Score: " + score, 8, 20); // Draw the score text
    }

    // Function to draw all game elements and update their positions
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawBall(); // Draw the ball
        drawPaddle(); // Draw the paddle
        drawScore(); // Draw the score

        // Check for collisions with the walls and paddle
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx; // Reverse x direction if ball hits left or right wall
        }
        if (y + dy < ballRadius) {
            dy = -dy; // Reverse y direction if ball hits top wall
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy; // Reverse y direction if ball hits paddle
                score++; // Increment score
            } else {
                document.location.reload(); // Reload the page to reset the game if ball misses paddle
                clearInterval(interval); // Clear the interval to stop the game
            }
        }

        // Move paddle based on keyboard input
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx; // Update ball's x position
        y += dy; // Update ball's y position
    }

    const interval = setInterval(draw, 10); // Redraw the game elements every 10 milliseconds
}

// Function to display a greeting message
function displayGreeting() {
    const name = document.getElementById('recruiterName').value; // Get the input name
    let message = ''; // Initialize message variable

    if (name.length === 0) {
        message = "A name without any letters, that's new."; // Message for empty input
    } else if (name.length === 1) {
        message = "Really, one letter name? Are you kidding me?"; // Message for one-letter input
    } else {
        message = `Hello, ${name}! Have a wonderful day.`; // Greeting message

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

    document.getElementById('greetingMessage').innerText = message; // Display the message
}
