function Swap(from, to, ticks) {
    this.from = from;
    this.to = to;
    this.tick = ticks;
    this.totalTicks = ticks;
}

Swap.prototype.interpolatedPos = function () {
    var x = this.tick / this.totalTicks;
    return x * (3 * x - 2 * x * x);
};
