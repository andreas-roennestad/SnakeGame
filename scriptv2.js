var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "45px Comic Sans MS";
ctx.fillStyle = "red";
ctx.textAlign = "center";
ctx.strokeStyle = "black"
var grid = 20;
var keyMap = {68: 'right', 65: 'left', 87: 'up', 83: 'down'};
var gameOver = false;
var snake = new Snake();
var food = new generateFood(snake);
var score = 0;
var highscore = 0;
snake.setup();

var state = {
    pressedKeys:{left: false, right: false, up: false, down: false}
}






function keydown(event) {
    var key = keyMap[event.keyCode];
    state.pressedKeys[key] = true;
}

function keyup(event) {
    var key = keyMap[event.keyCode];
        state.pressedKeys[key] = false;
}



function Joint(x, y){
    this.width = 20;
    this.height = 20;
    this.state = {x: x, y: y,
        dirEnum: {right: 1, left: 2, up: 3, down: 4}
    };

    this.speed = grid;
    

    this.changeDirHead = function(){
        if(state.pressedKeys.left && this.dir!=this.state.dirEnum.right){
           this.dir = this.state.dirEnum.left;
        }
        if(state.pressedKeys.right && this.dir!=this.state.dirEnum.left){
            this.dir = this.state.dirEnum.right;
        }
        if(state.pressedKeys.up && this.dir!=this.state.dirEnum.down){
            this.dir = this.state.dirEnum.up;
        }
        if(state.pressedKeys.down && this.dir!=this.state.dirEnum.up){
            this.dir = this.state.dirEnum.down;
        }
    }
    this.draw = function(){
        ctx.beginPath();    
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(this.state.x,this.state.y, this.width, this.height);
        ctx.fillStyle = "green"
        ctx.fill();
        ctx.stroke();
        
    }
    this.getx = function(){
        return this.state.x;
    }
    this.gety = function(){
        return this.state.y;
    }
}


function Snake(){
    this.snake = [];

    this.getHead = function(){
        return this.snake[0];
    }
    this.draw = function(){
        for(var i = 0; i<this.snake.length; i++){
                this.snake[i].draw();
            }
    }

    this.setup = function(){
        this.snake.push(new Joint(300,300));
        this.snake[0].dir = this.snake[0].state.dirEnum.right;
    }

    this.updateDirHead = function() {
        this.snake[0].changeDirHead(); 
      }


    this.move = function(){
        if(this.snake[0].getx() === food.getx() && this.snake[0].gety()===food.gety()){
            this.newHead();
            food = new generateFood(snake);
            score++;
        }
        else{
            this.newHead();
            this.snake.pop();
        }
    }

    this.newHead = function(x, y){ //creates new head in direction where old head is headed (pun intended)
        var oldHead = this.snake[0];
        var d = oldHead.dir;
        if(oldHead.dir===oldHead.state.dirEnum.right){
            this.snake.splice(0, 0,new Joint(oldHead.getx()+grid,oldHead.gety()));
        }
        else if(oldHead.dir===oldHead.state.dirEnum.left){
            this.snake.splice(0, 0,new Joint(oldHead.getx()-grid,oldHead.gety()));
        }
        else if(oldHead.dir===oldHead.state.dirEnum.up){
            this.snake.splice(0, 0,new Joint(oldHead.getx(),oldHead.gety()-grid));
        }
        else if(oldHead.dir===oldHead.state.dirEnum.down){
            this.snake.splice(0, 0,new Joint(oldHead.getx(),oldHead.gety()+grid));
        }
        this.snake[0].dir = d;

    }
    this.collition = function(){
        if(this.snake[0].getx()===600 || this.snake[0].getx()===-20 || this.snake[0].gety()===600 || this.snake[0].gety()===-20){
            gameOver = true;
        }
        for(var i = 1; i < this.snake.length; i++){
            if(this.snake[0].getx()===this.snake[i].getx() && this.snake[0].gety()===this.snake[i].gety()) gameOver = true;
        }
    }

    this.getRandGridLocation = function(){ //to make sure the random placed "food" gets put in the grid correctly

    var randomX;
    var randomY;

    var isOnBody = false;

    while(!(randomX%2===0 && randomY%2===0) || (randomX*60===600 || randomY*60===600) || isOnBody){ //so as not to be outside grid
        isOnBody = false;
        randomX = Math.round(Math.random()*10);
        randomY = Math.round(Math.random()*10);
        for(var i = 0; i < this.snake.length; i++){
            if(this.snake[i].getx()===randomX && this.snake[i].gety()===randomY) isOnBody = true;
        }
        
    }
    randomX*=60;
    randomY*=60;
    return [randomX, randomY]; 
}

}





function generateFood(snake){

    var point = snake.getRandGridLocation();
    this.x = point[0];
    this.y = point[1];
    this.draw = function(){
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(this.x,this.y, 20, 20);
        ctx.fillStyle = "red"
        ctx.fill();
        ctx.stroke();
    }
    this.getx = function() {
        return this.x;
    }
    this.gety = function() {
        return this.y;
    }
}
function update() {
    ctx.clearRect(0,0,600,600);
    if(!gameOver){
        snake.updateDirHead();
        snake.move();
        snake.collition();
        snake.draw();
        food.draw();
        ctx.fillText(score.toString(), 570, 50);
        ctx.strokeText(score.toString(), 570, 50);
    }
    if(gameOver){
        ctx.fillText("Game Over", 300, 200);
        ctx.strokeText("Game Over", 300, 200);
        ctx.fillText("Score: " + score.toString(), 300, 300);
        ctx.strokeText("Score: " + score.toString(), 300, 300);
;
    }
}

var fps = 15;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
  
function draw() {
     
    window.requestAnimationFrame(draw);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > interval) {
    
        then = now - (delta % interval);
         
        update();
    }
}
draw();

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);