function WrappedShape(type, x, y, board) {
    Shape.call(this, type, x, y, board);
}

WrappedShape.prototype = new Shape();
WrappedShape.prototype.constructor = WrappedShape;

function WrappedEffect(board, x, y, color) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.totalTicks = 10;
    this.tick = this.totalTicks;
    this.type = color;
}

WrappedEffect.prototype.explode = function () {
    var i, j;
    for (i = Math.max(this.x-1, 0); i <= this.x+1 && i < this.board.width; i++) {
        for (j = Math.min(this.y+1, this.board.height-1); j >= this.y-1 && j >= 0 ; j--) {
            this.board.clearShape(i, j);
        }
        var sh;
        while (j >= 0) {
            sh = this.board.getShape(i, j);
            if (sh.canFall() && (sh.dir.y === 0 || sh.dir.y === 1)) {
                // explosion pull force
                sh.pos += 0.4;
                sh.speed -= 0.4;
                sh.dir.y = +1;
            }
            j--;
        }
    }
};

WrappedEffect.prototype.update = function () {
    'use strict';
    if (this.tick === this.totalTicks) {
        this.explode();
    }
    this.tick--;
    if (this.stillChanging) {
        this.board.itemChanged = true;
    }
    return this.tick > 0;
};

// returns array of [x, y, width, height, frameName]'s
WrappedEffect.prototype.getSpritePositions = function () {
    var t = 1 - this.tick / this.totalTicks;
    var sw = 0.6, sh = 0.6, frm = Shape.typeNames[this.type-1];
    return [
        [this.x-t, this.y-t, sw, sh, frm],
        [this.x-t, this.y+t, sw, sh, frm],
        [this.x+t, this.y-t, sw, sh, frm],
        [this.x+t, this.y+t, sw, sh, frm]
    ];
};
