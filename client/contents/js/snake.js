/**
 * Script defines all the classes and or modules that are required
 * to realize the snake game, given that the canvas tag is present
 * inside the corresponding html file.
 *
 * @author atifcppprogrammer
 */

// Selecting canvas element and obtaining two dimensional
// rendering context and storing some critical constants.
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const WIDTH  = canvas.width, HEIGHT = canvas.height;

/**
 * The class Box defines the most atomic element of the game
 * whose functionality will be inherited by other elements of
 * the game such as the food and the snake's head.
 *
 * @class
 */
class Box{
  // Method for code outside this class to ascertain drawn
  // status of this instance of Box.
  isDrawn(){
    return this.drawn;
  }
  // Method to fill this box instance with color given as
  // argument, drawn status is set true after this method
  // is called.
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,Box.DIM,Box.DIM);
    this.drawn = true;
  }
  // Method removes the color the box was filled with and
  // sets the drawn status to false.
  erase(){
    ctx.clearRect(this.x,this.y,Box.DIM,Box.DIM);
    this.drawn = false;
  }
  // Method to determine if given Box has the same coords
  // as this instance of Box.
  isSameAs(other){
    return this.x == other.x && this.y == other.y;
  }
  // Method re-assigns the x and y member variables and
  // returns the coordinates that were replaced.
  setCoords(newCoords){
    let oldCoords = [this.x,this.y];
    this.x = newCoords[0]; this.y = newCoords[1];
    return oldCoords;
  }
  // Method returns the this.x and this.y member variables
  // wrapped inside a array.
  getCoords(){
    return [this.x,this.y];
  }
  // Method to covert strings like '[1,2]' to arrays like
  // [1,2], this method is employed by generate method of
  // sub class Food.
  static coordsFrom(coordsString){
    return coordsString.split(',').map((e)=>{
      return parseInt(e);
    });
  }
  // Method to return all plausible locations where some
  // instance of Box can be created with specified value
  // of Box.DIM
  static allCoords(){
    let coords = [];
    for(let i = 0;i<WIDTH;i+=Box.DIM){
      for(let j = 0;j<HEIGHT;j+=Box.DIM){
        coords.push([i,j]);
      }
    }
    return coords;
  }
  // Storing top-left corners raw coordinates and current
  // drawing status (boolean) as member variables.
  constructor(x,y,color){
    this.x = x; this.y = y; this.color = color;
    this.drawn = false;
  }
}
// Specifying the width (same as height) that will be
// used draw box on grid.
Box.DIM = 15;

/**
 * Sub-class Head will be used to realize the head of the
 * snake element that we aim to construct, we also override
 * the draw method of the parent class to make the head
 * stand out from the rest of the body.
 *
 * @class
 */
class Head extends Box{
  // Overriding draw method of parent class to ensure that
  // head appears distint from the rest of the snakes's
  // body.
  draw(){
    switch(Snake.DIRECTION){
      // Up.
      case Snake.DIRECTIONS.U:
      this.drawUp();
      break;
      // Down
      case Snake.DIRECTIONS.D:
      this.drawDown();
      break;
      // Left
      case Snake.DIRECTIONS.L:
      this.drawLeft();
      break;
      // Right
      case Snake.DIRECTIONS.R:
      this.drawRight();
      break;
    }
    this.drawn = true;
  }
  // Method draws this instance of head when the static
  // member Snake.DIRECTION is set to Snake.DIRECTIONS.U.
  drawUp(){
    ctx.fillStyle = this.color;
    let x = this.x+Box.DIM/2, y = this.y+Box.DIM;
    ctx.beginPath();
    ctx.arc(x,y,Box.DIM/2,0,Math.PI,true);
    ctx.fill();
  }
  // Method draws this instance of head when the static
  // member Snake.DIRECTION is set to Snake.DIRECTIONS.L.
  drawLeft(){
    ctx.fillStyle = this.color;
    let x = this.x+Box.DIM, y = this.y+Box.DIM/2;
    ctx.beginPath();
    ctx.arc(x,y,Box.DIM/2,-Math.PI/2,Math.PI/2,true);
    ctx.fill();
  }
  // Method draws this instance of head when the static
  // member Snake.DIRECTION is set to Snake.DIRECTIONS.R.
  drawRight(){
    ctx.fillStyle = this.color;
    let x = this.x, y = this.y+Box.DIM/2;
    ctx.beginPath();
    ctx.arc(x,y,Box.DIM/2,Math.PI/2,-Math.PI/2,true);
    ctx.fill();
  }
  // Method draws this instance of head when the static
  // member Snake.DIRECTION is set to Snake.DIRECTIONS.D.
  drawDown(){
    ctx.fillStyle = this.color;
    let x = this.x+Box.DIM/2, y = this.y;
    ctx.beginPath();
    ctx.arc(x,y,Box.DIM/2,Math.PI,0,true);
    ctx.fill();
  }
  // Method moves this box, depending on Snake.DIRECTION
  // by employing the methods changeX() and changeY(),
  // and returns the old coords prior to moving.
  move(){
    let oldCoords = [this.x,this.y];
    this.erase(); this.changeX(); this.changeY();
    this.draw();
    return oldCoords;
  }
  // Method sets the coord this.x depending on the value
  // of Snake.DIRECTION, if computed value lies outside
  // bounds then this.x is computed againt  to make head
  // appear on opposite end of canvas.
  changeX(){
    let dx = 0;
    dx = Snake.DIRECTION == Snake.DIRECTIONS.L?-Box.DIM:0;
    dx = Snake.DIRECTION == Snake.DIRECTIONS.R?+Box.DIM:dx;
    this.x+=dx;
    // Accounting for overshoot.
    this.x = this.x<0?(WIDTH-Box.DIM):this.x;
    this.x = this.x>=WIDTH?0:this.x;
  }
  // Method sets the coord this.y depending on the value
  // of Snake.DIRECTION, if computed value lies outside
  // bounds then this.y is computed againt  to make head
  // appear on opposite end of canvas.
  changeY(){
    let dy = 0;
    dy = Snake.DIRECTION == Snake.DIRECTIONS.U?-Box.DIM:0;
    dy = Snake.DIRECTION == Snake.DIRECTIONS.D?+Box.DIM:dy;
    this.y+=dy;
    // Accounting for overshoot.
    this.y = this.y<0?(HEIGHT-Box.DIM):this.y;
    this.y = this.y>=HEIGHT?0:this.y;
  }
  // Constructor call constructor of parent class since no
  // member variables and only new methods are introduced
  // inside this base class.
  constructor(x,y,color){
    super(x,y,color);
  }
}

/**
 * Subclass Food as its name suggests will encapsulate all
 * functionality required by the food, since there is only
 * going to be one food item present at a time, it will
 * qualified as static.
 *
 * @class
 */
class Food extends Box{
  // Method to generate an instance of food at a location
  // that is not occupied by an any part of the snake's
  // body.
  static generate(){
    // Collecting all plauible coords and snake body
    // coords as strings.
    let snake = new Set(Snake.getCoords().map((e)=>{
      return e.toString();
    }));
    let boxes = new Set(Box.allCoords().map((e)=>{
      return e.toString();
    }));
    // Collecting all boxes that belong to boxes but
    // are not to be found inside snakes.
    let samples = Array.from([...boxes].filter((e)=>{
      return !snake.has(e);
    }))
    .map((e)=>Box.coordsFrom(e));
    // Selecting one element from the array samples in
    // a random fashion.
    const rnd = Math.floor(Math.random()*samples.length);
    let coords = samples[rnd];
    // Creating new food.
    Food.food = new Food(coords[0],coords[1],Food.COLOR);
    Food.food.draw();
  }
  // Overriding draw method of parent class to draw
  // snake food as a simple circle.
  draw(){
    ctx.fillStyle = this.color;
    let x = this.x+Box.DIM/2, y = this.y+Box.DIM/2;
    ctx.beginPath();
    ctx.arc(x,y,Box.DIM/2,0,2*Math.PI,true);
    ctx.fill();
    this.drawn = true;
  }
  // Constructor call constructor of parent class since no
  // member variables and only new methods are introduced
  // inside this base class.
  constructor(x,y,color){
    super(x,y,color);
  }
}
// Static member food will house all instaances of Food
// that will be created as they are consumed by snake.
Food.food = undefined;

// Static member specifying the color with which the
// food will be colored with.
Food.COLOR = "white";

/**
 * The class defines the snake element of the game using
 * the above defined classes. Since the main functions
 * have been accounted for by the above modules its
 * realization is fairly straight forward.
 *
 * @class
 */
class Snake{
  // Method draws the snake on canvas using the draw
  // methods of the MovingBox's that constitute its body.
  static draw(){
    for(let j = 0;j<Snake.BODY.length;++j)
      Snake.BODY[j].draw();
  }
  // Method erases the snake from canvas using the erase
  // methods of the MovingBox's that constitute its body.
  static erase(){
    for(let j = 0;j<Snake.BODY.length;++j)
      Snake.BODY[j].erase();
  }
  // Method to ascertain if the snake has collided with
  // a box that is part of its body.
  static hasCollided(){
    const head = Snake.BODY[0];
    for(let j = 1;j<Snake.BODY.length;++j){
      if(head.isSameAs(Snake.BODY[j]))
        return true;
    }
    return false;
  }
  // Method to return coords of each box constituting body
  // of Snake.
  static getCoords(){
    let coords = [];
    for(let j = 0;j<Snake.BODY.length;++j){
      coords.push(Snake.BODY[j].getCoords());
    }
    return coords;
  }
  // Method to ascertain if snake has eaten food i.e head
  // collided with an active instance of food.
  static hasEaten(){
    return Snake.BODY[0].isSameAs(Food.food);
  }
  // Method to make snake grow by one box if food has been
  // consumed.
  static grow(coords){
    let x = coords[0], y = coords[1];
    Snake.BODY.push(new Box(x,y,Snake.color));
  }
  // Method to move the snake on the canvas by leveraging
  // the code written in the draw and erase methods above,
  // and return coords of last element Snake.BODY;
  static move(){
    Snake.erase();
    // Changing direction of head case Snake.DIRECTION
    // has been changed.
    let coords = Snake.BODY[0].move();
    for(let x = 1; x<Snake.BODY.length;++x){
      coords = Snake.BODY[x].setCoords(coords);
    }
    Snake.draw();
    return coords;
  }
}
// Static member defining markers corresponding to each
// direction that the snake can move in.
Snake.DIRECTIONS = {'L':0,'U':1,'R':2,'D':3};

// Static member queue will store movements that need to
// be performed by snake as corresponding keyboard events
// are fired.
Snake.DIRECTION = undefined;

// Static member will store the body the snake, in the
// start will house two instances of Box one for the
// head and the other for the tail.
Snake.BODY = undefined;

// Static member specifying color with which the whole
// body of the snake will be colored with.
Snake.COLOR = "brown";

/**
 * This is a final wrapper class housing all functionality
 * peratining to scoring, pausing, levels adding and removing
 * listeners.
 *
 * @class
 */
class Game{
  // Method will create Snake.BODY by storing an instance
  // of Head and Box, generate the initial food and then
  // attach the handler for keyboard events.
  static init(){
    // Setting Score, Speed and Level.
    Game.SPEED = Game.LEVELS[0].speed;
    Game.SCORE = 0; Game.LEVEL = 0;
    Game.PAUSED = false; Game.QUIT = false;
    // Creating Snake body and generating food and
    // setting direction.
    Snake.DIRECTION = Snake.DIRECTIONS.L;
    Snake.BODY = [
      new Head(4*Box.DIM,8*Box.DIM,Snake.COLOR),
      new Box(5*Box.DIM,8*Box.DIM,Snake.COLOR),
      new Box(6*Box.DIM,8*Box.DIM,Snake.COLOR)
    ];
    Food.generate(); Snake.draw();
    addEventListener('keydown',Game.handler);
  }
  // Method encapsulating code that must be executed in the
  // event that consuming food causes snake to level up.
  static levelUp(){
    if(Game.LEVEL === Game.LEVELS.length-1)
      return;
    if(Snake.BODY.length == Game.LEVELS[Game.LEVEL].req){
      Game.LEVEL++;
      Game.SPEED = Game.LEVELS[Game.LEVEL].speed;
      if(Game.onLevelUp !== undefined)
        Game.onLevelUp();
    }
  }
  // Method encapsulating code that must execute in the
  // event snake eats food and score needs to be update.
  static scoreUp(){
    Game.SCORE+=Game.LEVELS[Game.LEVEL].score;
    if(Game.onScoreUp !== undefined)
      Game.onScoreUp();
  }
  // Method is used to remove the attached event listener
  // and to perform final clean up such as erasing the
  // food and snake.
  static cleanUp(){
    Snake.erase(); Food.food.erase();
    removeEventListener('keydown',Game.handler);
  }
  // Method encapsulates the animation loop for the game
  // and is called repeatedly until the Snake collides
  // with itself.
  static play(){
    if(Snake.hasCollided()){
      Game.cleanUp();
      if(Game.onOver !== undefined)
        Game.onOver(); return;
    }
    if(Game.QUIT){
      Game.cleanUp();
      if(Game.onQuit !== undefined)
        Game.onQuit(); return;
    }
    if(!Game.PAUSED){
      let coords = Snake.move();
      if(Snake.hasEaten()){
        Snake.grow(coords);
        Game.levelUp();
        Game.scoreUp();
        Food.generate();
      }
    }
    setTimeout(Game.play,Game.SPEED);
  }
  // Method houses the code required to entertaing
  // the keyboard events triggering the movement of
  // the snake.
  static handler(e){
    switch(e.keyCode){
      case 37:
      if(Snake.DIRECTION !== Snake.DIRECTIONS.R && !Game.PAUSED)
        Snake.DIRECTION = Snake.DIRECTIONS.L;
      break;
      case 38:
      if(Snake.DIRECTION !== Snake.DIRECTIONS.D && !Game.PAUSED)
        Snake.DIRECTION = Snake.DIRECTIONS.U;
      break;
      case 39:
      if(Snake.DIRECTION !== Snake.DIRECTIONS.L && !Game.PAUSED)
        Snake.DIRECTION = Snake.DIRECTIONS.R;
      break;
      case 40:
      if(Snake.DIRECTION !== Snake.DIRECTIONS.U && !Game.PAUSED)
        Snake.DIRECTION = Snake.DIRECTIONS.D;
      break;
      case 80:
        Game.PAUSED=!Game.PAUSED;
      break;
      case 81:
        Game.QUIT = true;
      break;
      default: return;
    }
  }
}
// For storing that score that will be made by consuming
// food, the game speed and the required length corresponding
// to achieve each level of the game.
Game.LEVELS = [
  {'score':100, 'speed':120, 'req':5},
  {'score':200, 'speed':110, 'req':10},
  {'score':300, 'speed':100, 'req':15},
  {'score':400, 'speed':90,  'req':20},
  {'score':500, 'speed':80,  'req':25},
  {'score':600, 'speed':80,  'req':30},
  {'score':700, 'speed':70,  'req':35},
  {'score':800, 'speed':70,  'req':40},
  {'score':900, 'speed':60,  'req':45},
  {'score':1000,'speed':50,  'req':50},
  {'score':1100,'speed':50,  'req':60},
  {'score':1200,'speed':40,  'req':65},
  {'score':1300,'speed':40,  'req':70},
  {'score':1400,'speed':30,  'req':75},
];

// Static parameters for storing current game speed, the
// score made by the player, the current level the player
// is at and a flag for indication whether game is in paused
// state or not.
Game.PAUSED = undefined;
Game.QUIT   = undefined;
Game.SPEED  = undefined;
Game.LEVEL  = undefined;
Game.SCORE  = undefined;

// Static members representing events that might warrant a
// GUI update by code outside this script.
Game.onLevelUp = undefined;
Game.onScoreUp = undefined;
Game.onOver = undefined;
Game.onQuit = undefined;
