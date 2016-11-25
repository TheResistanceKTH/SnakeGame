/**
 * Created by TheSpine on 25/11/16.
 */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var rows = 20;
var cols = 20;
var scl = Math.floor(window.innerHeight / 20) - 1;
var fps= 10;
var hasLost = false;

canvas.width = cols * scl;
canvas.height = rows * scl;

class Snake {
    constructor() {
        this.x = Math.floor(canvas.width / 2);
        this.y = Math.floor(canvas.height / 2);
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
                    this.body[i] = this.body[i + 1];
                }
                this.body[this.body.length -1] = [this.x, this.y];
            } else {
                this.body[this.body.length] = [this.x, this.y];
            }
        };

        this.update = function() {
            this.updateTail();

            this.x += this.xspeed * scl;
            this.y += this.yspeed * scl;

            if (this.x === food.x && this.y === food.y) {
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
            if (this.x < 0 || this.x > canvas.width - scl || this.y < 0 || this.y > canvas.height - scl) {
                // if you are against a wall and try to move into it, you die
                return true;
            }
            return false;
        }

        this.changeDir = function(x, y) {
            if (this.xspeed === -x || this.yspeed === -y) {
                // can't change direction backwards
                return;
            }
            this.xspeed = x;
            this.yspeed = y;
        }
    }
}

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * cols) * scl;
        this.y = Math.floor(Math.random() * rows) * scl;

        this.draw = function() {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, scl, scl);
        };

        this.newLocation = function() {
            this.x = Math.floor(Math.random() * cols) * scl;
            this.y = Math.floor(Math.random() * rows) * scl;
        };
    }
}

var snake = new Snake();
var food = new Food();

function drawCanvas() {
    setTimeout(function() {
        raf = window.requestAnimationFrame(drawCanvas);
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!hasLost) {
            snake.update();
            snake.draw();

            if (snake.hasDied()) {
                hasLost = true;
            }

            food.draw();
        } else {
            fps = 1;
            ctx.font = '40px Helvetica';
            ctx.fillStyle = 'white';
            ctx.fillText("You lose! Your score was: " + snake.size, 30, canvas.width/2);

            ctx.font = '30px Helvetica';
            ctx.fillText('Reload the page to play again', 30, canvas.width/2 + 50);

        }
    }, 1000 / fps);
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
        case 65: // a
            snake.changeDir(-1, 0);
            break;
        case 39:
        case 68: // d
            snake.changeDir(1, 0);
            break;
        case 38:
        case 87: // w
            snake.changeDir(0, -1);
            break;
        case 40:
        case 83: // s
            snake.changeDir(0, 1);
            break;
    }
};

drawCanvas();