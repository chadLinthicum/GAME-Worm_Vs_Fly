const DEBUG = false;

canvas = document.getElementById("game-canvas");
ctx = canvas.getContext("2d");
// set canvas to be a tab stop
canvas.setAttribute("tabindex", "0");
// set focus to the canvas so keystrokes are immediately handled
canvas.focus();

//game attributes
score = 0;
topScore = 0;
scoreNumber = document.getElementById("score");
highScoreNumber = document.getElementById("high-score");
boundaryX = 600;
boundaryY = 600;
bgImg = document.getElementById("grass");

//worm attributes
worm = [{ x: 100, y: 100 }];
wormWidth = 18;
wormHeight = 18;
const SNAKE_MOVEMENT = 20;
wormDirection = ""; //set to '' to have worm idle at start of game
wormSkinColor = "#dd6287  ";
wormEyeSize = 5;
wormEyeA = 2;
wormEyeB = 11;
wormEyeColor = "#000000";

//fly attributes
flyX = 200;
flyY = 200;
const FLY_WIDTH = 18;
const FLY_HEIGHT = 18;
randomLoc = Math.floor(Math.random() * 19);
flyPIX = document.getElementById("flyPIX");

initializeGame();

function initializeGame() {
  window.onload = function (event) {
    event.preventDefault();
    canvas.addEventListener("keydown", setWormDirectionVariable);

    setInterval(function () {
      updateCanvas();
    }, 100);

    if (DEBUG) {
      wormDirection = "right";
      flyX = 220;
      flyY = 100;
    } else {
      flySpawn();
      setInterval(function () {
        flyMovement();
      }, 500);
    }
  };
}

function updateCanvas() {
  drawGame();
  drawFly();
  drawWormHeadAndBody();
  drawWormEyes();
  eatFly();
  gameOver();
  useWormDirectionVariableMoveWorm();
  headBump();
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawFly() {
  ctx.drawImage(flyPIX, flyX, flyY, FLY_WIDTH, FLY_HEIGHT);
}

function drawGame() {
  drawBackground();
  // drawGrid(); //this is causing processor slowdown, will revisit another time
}

function drawGrid() {
  for (i = 19; i <= 800; i += 20) {
    //vertical lines
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 805);

    //horizontal lines
    ctx.moveTo(0, i);
    ctx.lineTo(805, i);

    ctx.strokeStyle = "#000000"; //other color of choice = #5A2E11
    ctx.stroke();
  }
}

function drawWormHeadAndBody() {
  worm.forEach((segment) => {
    drawRectangles(segment.x, segment.y, wormWidth, wormHeight, wormSkinColor);
  });
}

function drawWormEyes() {
  if (wormDirection === "up") {
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
  } else if (wormDirection === "down") {
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
  } else if (wormDirection === "left") {
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
  } else if (wormDirection === "right") {
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
    scoreNumber.textContent = score;
    worm.push({ x: worm[0].x, y: worm[0].y });
  }
}

function flyMovement() {
  flyDirection = ["up", "down", "left", "right"];
  flyCoordinates =
    flyDirection[Math.floor(Math.random() * flyDirection.length)];
  if (flyCoordinates === "up") {
    flyY = flyY - 20;
  } else if (flyCoordinates === "down") {
    flyY = flyY + 20;
  } else if (flyCoordinates === "left") {
    flyX = flyX - 20;
  } else if (flyCoordinates === "right") {
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
  // debugger;
  //algorithm that generates fly coordinates of 20 within range of 1-580
  const flyCoordinate = 20;
  const specialRandom = (num = 1, limit = 600) => {
    const random = Math.random() * limit;
    const res = Math.round(random / num) * num;
    return res;
  };

  // ensures fly does not spawn on top of worm head/body
  for (i = 0; i < worm.length; i++) {
    if (flyX == worm[i].x && flyY == worm[i].y) {
      flyY = specialRandom(flyCoordinate);
      flyX = specialRandom(flyCoordinate);
    } else {
      flyY = specialRandom(flyCoordinate);
      flyX = specialRandom(flyCoordinate);
    }
  }
}

function gameOver() {
  if (worm[0].x < 0) {
    reset();
  } else if (worm[0].x > boundaryX) {
    reset();
  } else if (worm[0].y > boundaryY) {
    reset();
  } else if (worm[0].y < 0) {
    reset();
  }
}

function headBump() {
  for (i = 4; i < worm.length; i++) {
    if (worm[0].x === worm[i].x && worm[0].y === worm[i].y) {
      alert("Doh! You ran into yourself!");
      reset();
    }
  }
}

function isDirection(i, j) {
  if (wormDirection === i || wormDirection === j) {
    return false;
  }
  return true;
}

function reset() {
  alert("GAME OVER");
  wormDirection = "";
  worm[0].y = 100;
  worm[0].x = 100;

  if (score > highScoreNumber.textContent) {
    highScoreNumber.textContent = score;
  }

  scoreNumber.textContent = score = 0;

  worm = [
    {
      x: 100,
      y: 100,
    },
  ];
}

function setWormDirectionVariable(event) {
  switch (event.keyCode) {
    case 38:
      if (isDirection("down", "up")) {
        wormDirection = "up";
      }
      break;
    case 40:
      if (isDirection("down", "up")) {
        wormDirection = "down";
      }
      break;
    case 37:
      if (isDirection("right", "left")) {
        wormDirection = "left";
      }
      break;
    case 39:
      if (isDirection("right", "left")) {
        wormDirection = "right";
      }
  }
}

window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  );
  console.log(navigator.getGamepads());
  console.log(e.gamepad);
});

window.addEventListener("keydown", (e) => {
  console.log(e);
});

setTimeout(upPress, 1000);

function upPress() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowUp",
      altKey: false,
      bubbles: true,
      cancelBubble: false,
      cancelable: true,
      charCode: 0,
      code: "ArrowUp",
      composed: true,
      ctrlKey: false,
      currentTarget: null,
      defaultPrevented: false,
      detail: 0,
      eventPhase: 0,
      isComposing: false,
      key: "ArrowUp",
      keyCode: 38,
      location: 0,
      metaKey: false,
      repeat: false,
      returnValue: true,
      shiftKey: false,
      timeStamp: 22192.80000001192,
      type: "keydown",
      which: 38,
    })
  );
}

function update() {
  const gamepads = navigator.getGamepads();
  if (gamepads[0]) {
    if (gamepads[0].buttons[12].touched || gamepads[0].axes[1] < -0.3) {
      if (isDirection("down", "up")) {
        wormDirection = "up";
      }
    }
    if (gamepads[0].buttons[13].touched || gamepads[0].axes[1] > 0.3) {
      if (isDirection("down", "up")) {
        wormDirection = "down";
      }
    }
    if (gamepads[0].buttons[14].touched || gamepads[0].axes[0] < -0.3) {
      if (isDirection("right", "left")) {
        wormDirection = "left";
      }
    }
    if (gamepads[0].buttons[15].touched || gamepads[0].axes[0] > 0.3) {
      if (isDirection("right", "left")) {
        wormDirection = "right";
      }
    }
    if (gamepads[0].buttons[0].touched) {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: 91,
        })
      );
    }
  }

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

function useWormDirectionVariableMoveWorm() {
  if (wormDirection === "") {
    return;
  }

  for (i = worm.length - 1; i > 0; i--) {
    // debugger;
    const previousPartIndex = i - 1;
    // console.log('previousPartIndex: ', previousPartIndex);
    const previousPart = worm[previousPartIndex];
    // console.log('previousPart: ', previousPart)
    worm[i] = Object.assign({}, previousPart);
  }

  if (wormDirection === "up") {
    worm[0].y += -SNAKE_MOVEMENT;
  }
  if (wormDirection === "down") {
    worm[0].y += SNAKE_MOVEMENT;
  }
  if (wormDirection === "left") {
    worm[0].x += -SNAKE_MOVEMENT;
  }
  if (wormDirection === "right") {
    worm[0].x += SNAKE_MOVEMENT;
  }
}
