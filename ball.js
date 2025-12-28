// TODO: Add a gameOver function that determines 
// if all the balls have been hit or not

const game = {
  elem: document.querySelector("#gameArea"),
  state: false,
}

const gameArea = game.elem.getBoundingClientRect();

//log(gameArea.width)
//log(gameArea.offsetLeft)

const ball = {
  size: 4,
  cy: 94,
  cx: 70,
  xSpeed: .5,
  ySpeed: .5,
  elem: document.querySelector("#ball")
}
  
ball.top = ball.cy - ball.size/2;
ball.bottom = ball.cy + ball.size/2;
ball.left = ball.cx - ball.size/2;
ball.right = ball.cx + ball.size/2;

const paddle = {
  cx:70,
  cy: 96,
  width: 20,
  elem: document.querySelector("#paddle"),
}

const blocks = {
  count: [],
  elem: document.querySelectorAll(`.block`)
}

for(let i=0; i<blocks.elem.length; i++) {
  blocks.count.push({
    smashed: false,
    elem: blocks.elem[i],
  });
}

//blocks.count[6].smashed = false;

for(const block of blocks.count) {
  const rect = block.elem.getBoundingClientRect();

  const blockLeftPixels = rect.left - gameArea.left
  const blockRightPixels = rect.right - gameArea.left;
  const blockTopPixels = rect.top - gameArea.top;
  const blockBottomPixels = rect.bottom - gameArea.top;
  
  leftPerc = blockLeftPixels / gameArea.width * 100;
  rightPerc = blockRightPixels / gameArea.width * 100;
  topPerc = blockTopPixels / gameArea.width * 100;
  bottomPerc = blockBottomPixels / gameArea.width * 100;

  block.left = leftPerc;
  block.right = rightPerc;
  block.top = topPerc;
  block.bottom = bottomPerc;

  //log(block);
    
  }

ball.velocityX = -1 * ball.xSpeed // multiply by 1 to so xSpeed can be changed later in the future easier
ball.velocityY = -1 * ball.ySpeed

//log(ball.velocityY);

function loseGame() {
  window.removeEventListener("pointermove", movePaddle)
  paddle.elem.style.opacity = ".2";
  game.elem.style.background = "darkred";
  game.state = true;
}

function updateBallPosition() {
  ball.cy += ball.velocityY;
  ball.cx += ball.velocityX;

  if(ball.cy <= 0 + ball.size/2) {
    ball.velocityY = 1 * ball.ySpeed;
  } else if(ball.cy >= 100 - ball.size/2) {
    loseGame();
  }

  if(ball.cx >= 100 - ball.size/2) {
    ball.velocityX = -1 * ball.xSpeed;
  } else if(ball.cx <= 0 + ball.size/2) {
    ball.velocityX = 1 * ball.xSpeed;
  }

  ball.top = ball.cy - ball.size/2;
  ball.bottom = ball.cy + ball.size/2;
  ball.left = ball.cx - ball.size/2;
  ball.right = ball.cx + ball.size/2;

}

function bounceX() {
  if(ball.velocityX < 0) {
    ball.velocityX = 1 * ball.xSpeed;
  } 
  else if( ball.velocityX > 0) {
    ball.velocityX = -1 * ball.xSpeed;
  }
}

function bounceY() {
  
  if(ball.velocityY < 0) {
    ball.velocityY = 1 * ball.ySpeed;
  } 
  else if( ball.velocityY > 0) {
    ball.velocityY = -1 * ball.ySpeed;
  }
  
}

function updateBall() {
  updateBallPosition();
  handleBlocks();
  bouncePaddle();
}

function bouncePaddle() {

  const pad = paddle.elem.getBoundingClientRect();
  const b = ball.elem.getBoundingClientRect();

  centerB = b.left + b.width/2
  ballBottom = Math.round(b.bottom)
  let padTop = Math.round(pad.top)

  if(ballBottom >= padTop 
      && (centerB <= pad.right && centerB >= pad.left) ) {
      ball.velocityY = -1 * ball.ySpeed;
    return true;
  }
  return false;
  
}

function renderBall() {
  ball.elem.style.top = ball.cy + "%";
  ball.elem.style.left = ball.cx + "%"
}

//**********************
//*** Handle Paddle ****
//**********************

window.addEventListener("pointermove", movePaddle);

function movePaddle(event) {

  const gameRect = game.elem.getBoundingClientRect();

  event.pageX

  let mouseXPixels = event.pageX - gameRect.left
  let mouseXPercentageInGameArea = mouseXPixels / gameRect.width * 100
  //log(mouseXPixels / gameRect.width) * 100

  const min = paddle.width / 2;
  const max = 100 - paddle.width / 2

  paddle.cx = Math.min( Math.max(mouseXPercentageInGameArea, min), max )
  
}

function verticalSpeed() {
  if(bouncePaddle()) {
    //find a percentage and subtract 50% to determine if it is over or under.
    // 0% is reduce by  half
    //50% is increase by half
    //25% is stay same speed
    //25-50% is increasing by 0-50%
    //0-25% is decreasing by 50-0%

    //************************************
    //TODO: Add an if-else that uses 25-50 and 0-25 ranges to 
    //seperate incresing and decreasing
    //************************************

    /*
    if I need to try to find the percentage that it is on the paddle then I need
    to find out how many pixels into the paddle the ball is and I know that 
    the ball has hit the paddle already or else it would not be calling the function.
    If I subtract the ball pixels minus the paddle then I should be able to divide by 
    paddle width to get a percentage

    (ballLeft + ball.width / 2) - paddleLeft = # of pixels the ball is from the left edge 
    of the paddle

    Put this in a .txt file next time to organize thoughts a little better and clutter
    code base less
    */

    const pad = paddle.elem.getBoundingClientRect();
    const b = ball.elem.getBoundingClientRect();

    let offsetPixels = ( b.left + b.width / 2 ) - pad.left;
    
    //log(offsetPixels);
    //log( offsetPixels / pad.width * 100 );
    
    let offsetPercentage = offsetPixels / pad.width * 100;
    let percentageToEdge = Math.abs(offsetPercentage - 50);

    //log(percentageToEdge)

    //now implement what is written above.
    //log(ball.ySpeed, "before y")
    //log( ( ball.ySpeed + ( ball.ySpeed * (( percentageToEdge - 25) * 2) / 100 )) );
    ball.ySpeed = ( ball.ySpeed + ( ball.ySpeed * (( percentageToEdge - 25) * 2) / 100 ))

    if(ball.ySpeed >= 2) {
      ball.ySpeed = 2;
    } else if(ball.ySpeed <= 0.5) {
      ball.ySpeed = .5;
    }
    //log(ball.ySpeed, "after y")
    //log( ( (percentageToEdge - 25) * 2 ) / 100) 
    //game.state=true
    
  }
}

function horizontalSpeed() {
  if(bouncePaddle()) {
    
    

    const pad = paddle.elem.getBoundingClientRect();
    const b = ball.elem.getBoundingClientRect();

    let offsetPixels = ( b.left + b.width / 2 ) - pad.left;
    
    
    let offsetPercentage = offsetPixels / pad.width * 100;
    let percentageToEdge = Math.abs(offsetPercentage - 50);

    //log(percentageToEdge)

    //now implement what is written above.
    //log(ball.xSpeed, "before x")
    //log(percentageToEdge, "actual percentage")
    //log( (percentageToEdge * 2) / 100, "x xSpeed value")
    //log( ( ball.xSpeed + ( ball.xSpeed * (( percentageToEdge - 25) * 2) / 100 )) );
    ball.xSpeed = (percentageToEdge * 2) / 100;
    
    //log(ball.xSpeed, "after x")
    //log( ( (percentageToEdge - 25) * 2 ) / 100) 
    //game.state=true
    
  }
}

//handle Speed functions
function xDirection() {
  if(bouncePaddle()) {

    const pad = paddle.elem.getBoundingClientRect();
    const b = ball.elem.getBoundingClientRect();

    let offsetPixels = ( b.left + b.width / 2 ) - pad.left;
    
    //log(offsetPixels);
    //log( offsetPixels / pad.width * 100 );

    if ( ball.velocityX<0 ) {
      ball.direction = "left"
    } else if( ball.velocityX>0) {
      ball.direction = "right"
    }
    
    let offsetPercentage = offsetPixels / pad.width * 100;
    let percentageToEdge = offsetPercentage - 50;

    // log(percentageToEdge, "percentage to edge");

    if( percentageToEdge >= 25 && ball.direction=="left")   {
      ball.velocityX = 1 * ball.xSpeed;
      // log("left")
    } else if( percentageToEdge <= -25 && ball.direction=="right" ) {
      ball.velocityX = -1 * ball.xSpeed;
      // log("right")
    } else if(ball.direction=="left") {
      ball.velocityX = -1 * ball.xSpeed;
    } else if(ball.direction=="right") {
      ball.velocityX = 1 * ball.xSpeed;
    }
    
  }
}

function handleSpeed() {
  verticalSpeed();
  horizontalSpeed();
  xDirection();
}



function renderPaddle() {
  paddle.elem.style.top = paddle.cy + "%";
  paddle.elem.style.left = paddle.cx + "%"
}

function winGame() {
  const isTrue = (value) => value.smashed == true;

  

  if( blocks.count.every(isTrue) ) {
    window.removeEventListener("pointermove", movePaddle)
  paddle.elem.style.opacity = ".2";
  game.elem.style.background = "green";
  game.state = true;
  return true;
  }
  return false;
}

function render() {
  renderBall();
  renderPaddle();
}

////////////////////////////
///////Handle Blocks////////
////////////////////////////

function handleBlocks() {

  for(const block of blocks.count) {
    
    hitBlock(block);
    
  }
  
}


let axis = "";

function hitBlock(block) {

  // log(ball.top)
  // log(ball.bottom)
  // log(block.top)
  // log(block.bottom)

  // top and bottom collision
  if( (ball.top >= block.top && ball.top <= block.bottom 
  || ball.bottom >= block.top && ball.bottom <= block.bottom ) 
  && ball.cx >= block.left && ball.cx <= block.right
  && block.smashed != true) {
    bounceY();
    block.elem.style.visibility = "hidden";
    block.smashed = true;
    //game.state = true;
  }

  // left and right collision
    if( ( ball.right >= block.left && ball.right <= block.right  
    || ball.left <= block.right && ball.left >= block.left )
    && ball.cy >= block.top && ball.cy <= block.bottom
    && block.smashed != true) {
      bounceX();
      block.elem.style.visibility = "hidden";
      block.smashed = true;
      //game.state = true;
  }
  
  return false;
  
}

//**********************
//***** Game Loop ******
//**********************

function gameLoop() {
  // Write any code you want to happen on every animation frame here
  updateBall();
  render();
  handleSpeed();
  //hitBlock(blocks.count[0]);
  winGame();
  
  // Remember to setup the next animation frame before you finish
  

  
  // Remember to setup the next animation frame before you finish
  if(game.state == false){
    requestAnimationFrame(gameLoop);
  }
  
}

// This should probably be the final line in your
// program and the one that sets off the gameLoop.
requestAnimationFrame(gameLoop);
