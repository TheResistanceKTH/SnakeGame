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