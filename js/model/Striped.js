function StripedShape(type, x, y, dir, board) {
    Shape.call(this, type, x, y, board);
    this.stripeDirection = dir;
}

StripedShape.prototype = new Shape();
StripedShape.prototype.constructor = StripedShape;

function StripeEffect(board, x, y, direction) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.direction = direction || StripeEffect.HORIZONTAL;
    this.totalTicks = 2;
    this.tick = this.totalTicks;
    this.progress = 0;
    this.sprites = [];
}

StripeEffect.HORIZONTAL = 1;
StripeEffect.VERTICAL = 2;

StripeEffect.prototype.update = function () {
    this.tick--;
    var work = true;
    if (this.tick <= 0) {
        this.tick += this.totalTicks;
        work = false;
        this.progress++;
        if (this.direction === StripeEffect.VERTICAL) {
            if (this.y - this.progress >= 0) {
                this.board.clearShape(this.x, this.y - this.progress, true);
                work = true;
            }
            if (this.y + this.progress < this.board.height) {
                this.board.clearShape(this.x, this.y + this.progress, true);
                work = true;
            }
        }
        else {
            if (this.x - this.progress >= 0) {
                this.board.clearShape(this.x - this.progress, this.y, true);
                work = true;
            }
            if (this.x + this.progress < this.board.width) {
                this.board.clearShape(this.x + this.progress, this.y, true);
                work = true;
            }
        }
    }
    if (this.direction === StripeEffect.VERTICAL) {
        var ush = this.board.getShape(this.x, this.y - this.progress - 1, true);
        if (ush) {
            ush.speed = 0;
        }
    }
    return work;
};

// returns array of [x, y, width, height, frameName]'s
StripeEffect.prototype.getSpritePositions = function () {
    var t = this.progress + 1 - this.tick / this.totalTicks;
    var sw = 0.4, sh = 0.4, frm = 'triangle';
    var arr = [];
    if (this.direction === StripeEffect.VERTICAL) {
        if (this.y - t > -1) {
            arr.push([this.x, this.y - t, sw, sh, frm]);
        }
        if (this.y + t < this.board.height) {
            arr.push([this.x, this.y + t, sw, sh, frm]);
        }
    }
    else {
        if (this.x - t > -1) {
            arr.push([this.x - t, this.y, sw, sh, frm]);
        }
        if (this.x + t < this.board.width) {
            arr.push([this.x + t, this.y, sw, sh, frm]);
        }
    }
    return arr;
};
