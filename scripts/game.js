var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var sideLength = 20;
var fps= 10; // affects how fast the snake moves
var firstPlay = true;
var hasLost = false;
var movedThisFrame = true;
var hasSubmitted = false;
var snake;
var food;

// scales to fit player's window
var scl = window.innerHeight < window.innerWidth ? Math.floor(window.innerHeight / sideLength) - 1 :
                                                   Math.floor(window.innerWidth / sideLength) - 1;

canvas.width = sideLength * scl;
canvas.height = sideLength * scl;

function mainLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(mainLoop);
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (firstPlay) {
            drawStartScreen();
        } else if (hasLost) {
            drawLostScreen();
        } else {
            runGame();
        }
        movedThisFrame = false;
    }, 1000 / fps);
}

function drawStartScreen() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    ctx.font = '60px Helvetica';
    ctx.strokeText('Snake!', 30, 100);

    ctx.font = '40px Helvetica';
    ctx.fillText('Press enter to play', 30, canvas.width/2);

    ctx.font = '30px Helvetica';
    ctx.fillText('Use \'WASD\' or arrows for movement', 30, canvas.width/2 + 50);
}

function drawLostScreen() {
    ctx.fillStyle = 'white';

    ctx.font = '40px Helvetica';
    ctx.fillText("You lose! Your score was: " + (snake.size - 1), 30, 150);

    ctx.font = '30px Helvetica';
    ctx.fillText('Press H to submit your high score', 30, 200);
    ctx.fillText('or enter to play again', 30, 240);
    ctx.fillText("HighScores Top 5:", 30, 350);

    ctx.font = '25px Helvetica';
    var top5 = scores.length > 5 ? 5 : scores.length;
    for (var i = 0; i < top5; i++) {
        var score = scores[i];
        var scoreString = (i + 1) + '.  ' + score.score + " - " + score.name;
        ctx.fillText(scoreString, 30, 385 + 30*i)
    }
}

function runGame() {
    snake.update();
    snake.draw();
    food.draw();

    if (snake.hasDied()) {
        hasLost = true;
    }
}

function setUp() {
    snake = new Snake();
    food = new Food();
    food.newLocation();
}


document.onkeydown = function(e) {
    if (movedThisFrame) {
        return;
    }
    switch (e.keyCode) {
        case 37: // left arrow
        case 65: // a
            snake.changeDir(-1, 0);
            movedThisFrame = true;
            break;
        case 39: // right arrow
        case 68: // d
            snake.changeDir(1, 0);
            movedThisFrame = true;
            break;
        case 38: // up arrow
        case 87: // w
            snake.changeDir(0, -1);
            movedThisFrame = true;
            break;
        case 40: // down arrow
        case 83: // s
            snake.changeDir(0, 1);
            movedThisFrame = true;
            break;
        case 13: // enter
            if (firstPlay || hasLost) {
                firstPlay = false;
                hasLost = false;
                hasSubmitted = false;
                getHighScores();
                setUp();
            }
            break;
        case 72: //h
            if (hasLost && !hasSubmitted) {
                submitHighScore();
            }
            break;
    }
};

mainLoop();
