function Board(game) {
    this.shapes = [];
    this.tiles = [];
    this.height = 9;
    this.width = 9;
    this.game = game;
    this.boardGroup = null;
    this.shapeGroup = null;
    this.swaps = [];

    // position of board in the game
    this.x = 0;
    this.y = 0;
    this.gridSize = 0;
}

Board.prototype.generateSimple = function () {
    this.shapes = new Array(this.height * this.width);
    var arr = this.shapes;
    var height = this.height;
    var width = this.width;
    var gameWidth = this.game.width;
    var gameHeight = this.game.height;
    var gridSize = Math.min(gameWidth, gameHeight) / 10;
    this.boardGroup = this.game.add.group();
    this.shapeGroup = this.game.add.group();
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var r1, r2;
            if (i >= 2) {
                r1 = this.getShape(j, i - 1).type;
                if (this.getShape(j, i - 2).type !== r1) {
                    r1 = -1;
                }
            }
            if (j >= 2) {
                r2 = this.getShape(j - 2, i).type;
                if (this.getShape(j - 1, i).type !== r2) {
                    r2 = -1;
                }
            }
            var r;
            do {
                r = this.game.rnd.between(1, 4);
            } while (r1 == r || r2 == r) ;
            var board = this.boardGroup.create(i * gridSize, (j + 1) * gridSize, 'shapes', 'board');
            board.width = board.height = gridSize;
            var sprite = this.shapeGroup.create(i * gridSize, (j + 1) * gridSize, 'shapes',
              ['triangle', 'square', 'circle', 'hexagon'][r - 1]);
            var sh = new Shape(r, i, j);
            arr[i * width + j] = sh;
            sh.sprite = sprite;
            this.tiles.push({sprite: board});
            sprite.width = gridSize;
            sprite.height = gridSize;
        }
    }
    this.boardGroup.alpha = 0.8;
};

Board.prototype.getShape = function (x, y) {
    // bound check
    if (x >= this.width || x < 0) return null;
    if (y >= this.height || y < 0) return null;
    return this.shapes[x + y * this.width];
};

Board.prototype.addSwap = function(from, to) {
    var sh1 = this.getShape(from.x, from.y);
    var sh2 = this.getShape(to.x, to.y);
    this.swaps.push(new Swap(sh1, sh2, 10));
    this.shapes[from.x + from.y * this.width] = sh2;
    this.shapes[to.x + to.y * this.width] = sh1;
    sh1.swapping = sh2.swapping = true;
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    sh1.dir = {x: dx, y: dy};
    sh2.dir = {x: -dx, y: -dy};
};

Board.prototype.update = function () {
    this.updateSwaps();
    this.findVeritcalMatch();
    this.findHorizontalMatch();
};

Board.prototype.updateSwaps = function () {
    for (var i = 0; i < this.swaps.length; i++) {
        var from = this.swaps[i].from;
        var to = this.swaps[i].to;
        this.swaps[i].tick--;
        from.pos = to.pos = this.swaps[i].interpolatedPos() * 10;
        if (this.swaps[i].tick == 0) {
            this.swaps[i] = this.swaps[this.swaps.length - 1];
            this.swaps.length--;
            from.swapping = false;
            to.swapping = false;
        }
    }
};

Board.prototype.findVeritcalMatch = function () {
    var w = this.width;
    var i;
    for (var x = 0; x < this.height; x++) {
        i = x;
        for (var y = 0; y < w - 2; y++) {
            var sh = this.shapes[i].type;
            if (sh > 0 && !this.shapes[i].swapping) {
                if (this.shapes[i + w].type === sh && !this.shapes[i + w].swapping
                 && this.shapes[i + 2*w].type === sh && !this.shapes[i + 2*w].swapping) {
                    do {
                        // TODO make a match object
                        this.shapes[i].type = 0;
                        this.shapes[i].sprite.kill();
                        y++;
                        i += w;
                    } while (y < w && this.shapes[i].type === sh) ;
                }
            }
            i += w;
        }
    }
};

Board.prototype.findHorizontalMatch = function () {
  var w = this.width;
  var h = this.height;
  var i;
  for (var y = 0; y < h; y++) {
      i = y * w;
      for (var x = 0; x < w - 2; x++) {
          var sh = this.shapes[i].type;
          if (sh > 0 && !this.shapes[i].swapping) {
              if (this.shapes[i + 1].type === sh && !this.shapes[i + 1].swapping
               && this.shapes[i + 2].type === sh && !this.shapes[i + 2].swapping) {
                  do {
                      // TODO make a match object
                      this.shapes[i].type = 0;
                      this.shapes[i].sprite.kill();
                      x++;
                      i += 1;
                  } while (x < h && this.shapes[i].type === sh) ;
              }
          }
          i += 1;
      }
  }
};
