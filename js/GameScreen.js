function GameScreen(){
	this.debug = null; // To show debug message
	this.ball = null; // Ball to test animation
	this.background = null;
}

GameScreen.prototype.preload = function(){
	console.log("I don't know how to use Phaser game engine");
	game.load.image('ball', 'assets/ball.png');
	game.load.image('background', 'assets/background.png');
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.time.advancedTiming = true;
}

GameScreen.prototype.create = function(){
	console.log("So don't expect me to make a game");
	this.background = game.add.sprite(0, 0, 'background');
	this.addDebugText();
	this.ball = game.add.sprite(Math.random()*(game.width-100), Math.random()*(game.height-100), 'ball');
	var angle = 2*Math.PI*Math.random();
	var speed = 5;
	this.ball.velocity = {x: Math.cos(angle)*speed, y: Math.sin(angle)*speed};
}

GameScreen.prototype.addDebugText = function(){
	var style = { font: "32px", fill: "green" };
	this.debug = this.game.add.text(0, 0, "0", style);
}

GameScreen.prototype.update = function(){
	this.debug.text = game.time.fps;
	this.background.width = game.width;
	this.background.height = game.height;
	var ball = this.ball;
	ball.x += ball.velocity.x;
	ball.y += ball.velocity.y;
	if(ball.velocity.x > 0 && ball.x > game.width-100){
		ball.velocity.x *= -1;
	}
	if(ball.x > game.width-100){
		ball.x = game.width-100;
	}
	if(ball.velocity.x < 0 && ball.x < 0){
		ball.velocity.x *= -1;
	}
	if(ball.x < 0){
		ball.x = 0;
	}
	if(ball.velocity.y > 0 && ball.y > game.height-100){
		ball.velocity.y *= -1;
	}
	if(ball.y > game.height-100){
		ball.y = game.height-100;
	}
	if(ball.velocity.y < 0 && ball.y < 0){
		ball.velocity.y *= -1;
	}
	if(ball.y < 0){
		ball.y = 0;
	}
}
