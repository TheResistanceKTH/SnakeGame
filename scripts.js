var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var sideLength = 20;
var fps= 10; // affects how fast the snake moves
var firstPlay = true;
var hasLost = false;
var movedThisFrame = false;

// scales to fit player's window
var scl = window.innerHeight < window.innerWidth ? Math.floor(window.innerHeight / sideLength) - 1 :
                                                   Math.floor(window.innerWidth / sideLength) - 1;

canvas.width = sideLength * scl;
canvas.height = sideLength * scl;

var snake;
var food;

class Snake {
    constructor() {
        this.x = 0;
        this.y = Math.floor(sideLength/2 * scl);
        this.xspeed = 1;
        this.yspeed = 0;

        this.size = 1;
        this.body = [];

        this.draw = function() {
            ctx.fillStyle = 'white';
            for (var i = 0; i < this.body.length; i++) {
                // draw the body
                ctx.fillRect(this.body[i][0], this.body[i][1], scl, scl);
            }
            ctx.fillRect(this.x, this.y, scl, scl);
        };

        this.updateTail = function() {
            if (this.size === this.body.length) {
                for (var i = 0; i < this.body.length - 1; i++) {
                    this.body[i] = this.body[i+1];
                }
                this.body[this.body.length - 1] = [this.x, this.y];
            } else {
                this.body[this.body.length] = [this.x, this.y];
            }
        };

        this.update = function() {
            this.updateTail();

            this.x += this.xspeed * scl;
            this.y += this.yspeed * scl;

            if ([this.x, this.y] == [food.x, food.y].toString()) {
                // we're at the food!
                this.size++;
                food.newLocation();
            }
        };

        this.hasDied = function() {
            for (var i = 0; i < this.body.length; i++) {
                if ([this.x, this.y] == this.body[i].toString()) {
                    return true;
                }
            }
            return this.x < 0 || this.x > canvas.width - scl || this.y < 0 || this.y > canvas.height - scl;
        };

        this.changeDir = function(x, y) {
            if (this.xspeed === -x || this.yspeed === -y) {
                // can't change direction backwards
                return;
            }
            this.xspeed = x;
            this.yspeed = y;
            movedThisFrame = true;
        };
    }
}

class Food {
    constructor() {
        this.x = -1;
        this.y = -1;

        this.draw = function() {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, scl, scl);
        };

        this.locationIsAtSnake = function() {
            for (var i = 0; i < snake.body.length; i++) {
                if ([this.x, this.y] == snake.body[i].toString()) {
                    return true;
                }
            }
            return false;
        };

        this.newLocation = function() {
            // loop to prevent it from spawning where the snake is
            do {
            this.x = Math.floor(Math.random() * sideLength) * scl;
            this.y = Math.floor(Math.random() * sideLength) * scl;
            } while(this.locationIsAtSnake());
        };
    }
}

function drawCanvas() {
    setTimeout(function() {
        raf = window.requestAnimationFrame(drawCanvas);
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
    ctx.fillText("You lose! Your score was: " + (snake.size - 1), 30, canvas.width/2);

    ctx.font = '30px Helvetica';
    ctx.fillText('Press enter to play again', 30, canvas.width/2 + 50);
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
            break;
        case 39: // right arrow
        case 68: // d
            snake.changeDir(1, 0);
            break;
        case 38: // up arrow
        case 87: // w
            snake.changeDir(0, -1);
            break;
        case 40: // down arrow
        case 83: // s
            snake.changeDir(0, 1);
            break;
        case 13: // enter
            if (firstPlay || hasLost) {
                firstPlay = false;
                hasLost = false;
                setUp();
            }
            break;
    }
};

drawCanvas();
