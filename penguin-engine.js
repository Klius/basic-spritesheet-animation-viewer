/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

var img = new Image();
img.src = "imgs/default.png";

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
function Drawable() {
	this.init = function(x, y, width, height,angle=0) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.angle = angle;
	}
	this.animationSpeed = 0;
	this.sX = 0;
	this.sY = 0;
	this.fakesx = this.sX;
	this.frameCounter = 0;
	this.sWidth = 0;
	this.sHeight = 0;
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}

function Animation(){
	
	this.draw = this.draw = function() {
		this.context.clearRect(this.x,this.y,game.canvas.width,game.canvas.height);
		this.context.save();
		this.context.translate(this.x + this.width/2, this.y + this.height/2);
		this.context.rotate(this.angle);
		if(this.frameCounter % this.animationSpeed == 0){
			this.fakesx = this.fakesx + this.sWidth >= img.width ? this.sX : this.fakesx+this.sWidth;
			this.frameCounter = 0;
		}
		//context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
		this.context.drawImage(img, this.fakesx,this.sY, this.sWidth,this.sHeight, 
								this.x, this.y,-this.width/2,-this.height/2);
		this.context.restore();
		this.frameCounter++;
	};
}
// Set Animation to inherit properties from Drawable
Animation.prototype = new Drawable();

/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	this.pause = false;
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {
		// Get the canvas elements
		this.canvas = document.getElementById('canvas');
		if (this.canvas.getContext) {
			Animation.prototype.context = this.canvas.getContext('2d');
			Animation.prototype.canvasWidth = this.canvas.width;
			Animation.prototype.canvasHeight = this.canvas.height;
			this.animation = new Animation();
			this.animation.init(0,0,100,100);
			this.animation.sWidth = 100;
			this.animation.sHeight = 100;
			this.animation.animationSpeed = 3;
			return true;
		}
	};
}
 var game = new Game();
 if(game.init()){
	 animate();
 }
 
 
/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	// Animate game objects
	if(!game.pause){
		game.animation.draw();
	}
	requestAnimFrame( animate );
}
