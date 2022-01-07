const DEBUG = true; 

canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');
// set canvas to be a tab stop
canvas.setAttribute('tabindex','0');
// set focus to the canvas so keystrokes are immediately handled
canvas.focus();

//game
let score = 0;
scoreNumber = document.getElementById('scoreNumber');
scoreNumber.textContent=(score);

//worm head and body coordinates
let worm = [
  {
    x : 100,
    y : 100, 
  },
];

//worm attributes
let wormWidth = 18;
let wormHeight = 18;
const SNAKE_MOVEMENT = 20;
let wormDirection = ''; //set to '' to have worm idle at start of game
let wormSkinColor = '#FF69B4';
let wormEyeSize = 5;
let wormEyeA = 2;
let wormEyeB = 11; 
let wormEyeColor = '#000000';

//fly attributes
let flyX;
let flyY;
const FLY_WIDTH = 18;
const FLY_HEIGHT = 18;  
let randomLoc = Math.floor(Math.random() * 19);
let flyPIX = document.getElementById('flyPIX');

initializeGame();




function initializeGame() {
window.onload = function() {
  canvas.addEventListener('keydown', setWormDirectionVariable);
  
  setInterval(function() {
    updateCanvas();
    }, 1000);

  if (DEBUG) {
    wormDirection = 'right'
    flyX = 220;
    flyY = 100;
  } else {
    flySpawn();
    setInterval(function() {
      flyMovement();
      }, 500);
    }
  }
}

function updateCanvas () {
  drawGame();
  drawFly();
  drawWormHeadAndBody();
  drawWormEyes();
  eatFly();
  gameOver();
  useWormDirectionVariableToMoveWorm();
  // headBump();
}

function drawBackground() {
  var gradient = ctx.createRadialGradient(200, 200, 100, 200, 200, 250);
  gradient.addColorStop(0, '#934B22');
  gradient.addColorStop(1, '#562E17');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width,canvas.height);
}

function drawFly() {
  // drawWormRectangles(flyX,flyY,FLY_WIDTH,FLY_HEIGHT,'#2E2B29');
  ctx.drawImage(flyPIX,flyX,flyY,FLY_WIDTH,FLY_HEIGHT);
}

function drawGame() {
  drawBackground();
  // drawGrid(); 
}

function drawGrid() {
  for (var i=19; i<=800; i += 20)
  {
    //vertical lines
    ctx.moveTo(i,0);
    ctx.lineTo(i,805);

    //horizontal lines
    ctx.moveTo(0,i);
    ctx.lineTo(805,i);

    ctx.strokeStyle='#000000'; //other color of choice = #5A2E11
    ctx.stroke();
  }
}

function drawWormHeadAndBody() { 
  worm.forEach((segment) => {
    drawRectangles(
      segment.x,
      segment.y,
      wormWidth,
      wormHeight,
      wormSkinColor
    );
  });
}

function drawWormEyes() {
  if (wormDirection === 'up') {
    drawRectangles(
      worm[0].x + wormEyeA,
      worm[0].y + wormEyeA,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeA,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
  } else if (wormDirection === 'down') {
    drawRectangles(
      worm[0].x + wormEyeA,
      worm[0].y + wormEyeB,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeB,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
  } else if (wormDirection === 'left') {
    drawRectangles(
      worm[0].x + wormEyeA,
      worm[0].y + wormEyeA,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
    drawRectangles(
      worm[0].x + wormEyeA,
      worm[0].y + wormEyeB,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
  } else if (wormDirection === 'right') {
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeA,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeB,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor);
  } else {
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeA,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
    drawRectangles(
      worm[0].x + wormEyeB,
      worm[0].y + wormEyeB,
      wormEyeSize,
      wormEyeSize,
      wormEyeColor
    );
  }
}

function drawRectangles(leftX, topY, width, height, drawColor) { 
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height); 
}

function eatFly() {
  if (worm[0].x == flyX && worm[0].y == flyY) {
    flySpawn();
    score++;
    scoreNumber.textContent=(score);
    worm.push({x : worm[0].x, y : worm[0].y});
  }
}

function flyMovement() {
  var flyDirection = ['up', 'down', 'left', 'right']
    let flyCoordinates = flyDirection[Math.floor(Math.random() * flyDirection.length)];
    if (flyCoordinates === 'up') {
      flyY = flyY - 20;
    } else if (flyCoordinates === 'down') {
      flyY = flyY + 20;
    } else if (flyCoordinates === 'left') {
      flyX = flyX - 20;
    } else if (flyCoordinates === 'right') {
      flyX = flyX + 20;
    }

    //prevent fly from going out of bounds
    if (flyY < 0) {
      flyY = flyY + 20;
    } else if (flyY > 380) {
      flyY = flyY - 20;
    } else if (flyX < 0) {
      flyX = flyX + 20;
    } else if (flyX > 380) {
      flyX = flyX - 20;
    }
}

function flySpawn() {
  const flyCoordinate = 20;
  const specialRandom = (num = 1, limit = 380) => {
  const random = Math.random() * limit;
  const res = Math.round( random / num ) * num;
  return res;
  };

  if (flyX == worm[0].x || flyY == worm[0].y) {
    flyY = specialRandom(flyCoordinate);
    flyX = specialRandom(flyCoordinate);
  } else {
    flyY = specialRandom(flyCoordinate);
    flyX = specialRandom(flyCoordinate);
  }
}

function gameOver() {
  if (worm[0].x < 0) {
    reset();
    } else if (worm[0].x > 380) {
      reset();
    } else if (worm[0].y > 380) {
      reset();
    } else if (worm[0].y < 0) {
      reset();
    } 
  }

// var i = 0;

function headBump(){
  if (worm[0] == worm[1] || worm[2] || worm[3] || worm[4] || worm[5] || worm[6] || worm[7] || worm[8]) {
    return;
  }
  
  // for (i; i < worm.length; i++) {
  //   console.log("worm length is " + worm.length);
  //   console.log("i = " + i);
    
  // }
}

function isDirection(i, j) {
  if (wormDirection === i || wormDirection === j) {
    return false; 
  } 
  return true; 
}

function reset() {
  alert ("game over");
  wormDirection = '';
  worm[0].y = 100;
  worm[0].x = 100;
  scoreNumber.textContent=(score = 0);
  worm = [
    {
      x : 100,
      y : 100, 
    },
  ];
}

function setWormDirectionVariable(event) {
  switch(event.keyCode) {
    case 38:
      if (isDirection('down', 'up')) {
        wormDirection = 'up';
      } 
      break;
    case 40:
      if (isDirection('down', 'up')) {
        wormDirection = 'down';
      }
      break;
    case 37:
      if (isDirection('right', 'left')) {
        wormDirection = 'left';
      }
      break;
    case 39:
      if (isDirection('right', 'left')) {
        wormDirection = 'right';
      }
  }
}

function useWormDirectionVariableToMoveWorm () {
  if (wormDirection === '') {
    return;
  } 

  for (let i = worm.length - 1; i > 0; i--) {
    worm[i] = Object.assign({}, worm[i - 1]);
  }

  if (wormDirection === 'up') {
    worm[0].y += -SNAKE_MOVEMENT;
  }
  if (wormDirection === 'down') {
    worm[0].y += SNAKE_MOVEMENT;
  }
  if (wormDirection === 'left') {
    worm[0].x += -SNAKE_MOVEMENT;
  }
  if (wormDirection === 'right') {
    worm[0].x += SNAKE_MOVEMENT;
  } 
}

