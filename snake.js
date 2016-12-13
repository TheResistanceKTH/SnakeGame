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
        };
    }
}