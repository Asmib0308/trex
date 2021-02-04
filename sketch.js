function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trex_collided = loadAnimation("trex_collide.png")
  groundimg = loadImage("ground2.png")
  obstacles1 = loadImage("obstacle1.png");
  obstacles2 = loadImage("obstacle2.png");
  obstacles3 = loadImage("obstacle3.png");
  obstacles4 = loadImage("obstacle4.png");
  obstacles5 = loadImage("obstacle5.png");
  obstacles6 = loadImage("obstacle6.png");
  clouds = loadImage("cloud.png");
  gameOverI = loadImage("gameOver.png");
  restartI = loadImage("restart.png");
  
  cpsound = loadSound("checkPoint.mp3");
  diesound =  loadSound("die.mp3");
  jumpsound =  loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  PLAY = 1;
  END = 0;
  gameState = PLAY;

  trex = createSprite(200, 160, 10, 10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.x = 50;

  ground = createSprite(300, 185);
  ground.addImage(groundimg);

  edges = createEdgeSprites();

  inviGround = createSprite(300, 197, 600, 10)
  inviGround.visible = false;

  ObstaclesGroup = createGroup();
  CloudsGroup = createGroup();
  
  restart = createSprite(300,110);
  restart.addImage(restartI);
  restart.scale = 0.8
  gameOver = createSprite(300,60);
  gameOver.addImage(gameOverI);

  score = 0;
 localStorage[0] = 0;
}

function draw() {
  background("white");
  trex.collide(inviGround);
  
  text("Score - " + score,500,40);
  text("High -  " + localStorage[0],500,20)
  console.log(localStorage)

  if(gameState === PLAY){
    if (keyDown("space") && trex.y > 150) {
      trex.velocityY = -12;
      jumpsound.play();
    }
    score = score + Math.round(getFrameRate()/60);

    spawnObstacles();
    spawnClouds();

    ground.velocityX = -6
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }   
    trex.velocityY = trex.velocityY + 1
    
    if (count>0 && count%100 === 0){
    cpsound.play();
    }
    
    gameOver.visible = false;
    restart.visible = false;
    
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END
      diesound.play();
    }
  }   
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided");
    trex.velocityY = 0; 
    
  }
  
  if(mousePressedOver(restart)) {
    gameState = PLAY;
    trex.changeAnimation("running");
    reset();
  }
    drawSprites();
 }

function reset() {
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  if(localStorage[0] < score ){
    localStorage[0] = score;
  }
  
  console.log(localStorage[0]);
  score = 0;
}

function spawnObstacles() {
  if (World.frameCount % 60 === 0) {
    obstacle = createSprite(600, 170);
    obstacle.velocityX = -6;
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacles1);
        break;
      case 2:
        obstacle.addImage(obstacles2);
        break;
      case 3:
        obstacle.addImage(obstacles3);
        break;
      case 4:
        obstacle.addImage(obstacles4);
        break;
      case 5:
        obstacle.addImage(obstacles5);
        break;
      case 6:
        obstacle.addImage(obstacles6);
        break;
    }


    obstacle.scale = 0.5;
    obstacle.lifetime = 100;

    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (World.frameCount % 40 === 0) {
    cloud = createSprite(600, 80);
    cloud.y = Math.round(random(30, 120));
    cloud.velocityX = -6;
    cloud.addImage(clouds);
    cloud.scale = 0.5;
    cloud.lifetime = 100;
    CloudsGroup.add(cloud);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

  }
}