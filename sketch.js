var gameOverImg,gameOver,playAgainImg, replay;
var BG1, BG2, BG3;
var database;
var gameState = "start";
var bubbleImg, bubble, bubbleFX, SceneSpeed, Edges, Stream;
var coinImg, coin, coinFX, rockImg, rock, fishImg, fish, SceneImg, Scene;
var SI, startImg, start, stoneImg, stone, stoneGroup, coinGroup,
 bubbleGroup, buttonFX, Game_Music, logoImg, logo, ImpactFX,checkpointFX, failFX;
var Score = 0;
var Lives = 3;
var Coins = 0;
var timeOn = false;
var playerSpeed = 18;
var time = 10;
var plusCoinImg, plusCoin, plusLiveImg, plusLive, lessLiveImg, lessLive;

function preload()
{

  fishImg = loadAnimation("Game_Sprites/fish_Img/fish1.png","Game_Sprites/fish_Img/fish2.png",
  "Game_Sprites/fish_Img/fish3.png","Game_Sprites/fish_Img/fish4.png");

  logoImg = loadImage("Game_Sprites/Game-Logo.png");
  Game_Music = loadSound("Sounds/BlueDream.wav");
  buttonFX = loadSound("Sounds/ButtonFX.mp3");
  Stream = loadSound("Sounds/WaterFX.wav");
  startImg = loadImage("Game_Sprites/Start.png");
  stoneImg = loadImage("Game_Sprites/StoneImg.png");
  coinImg = loadAnimation("Game_Sprites/coin1.png","Game_Sprites/coin2.png","Game_Sprites/coin3.png",
  "Game_Sprites/coin4.png");
  coinFX = loadSound("Sounds/CoinFX.mp3");
  bubbleFX = loadSound("Sounds/BubbleFX.mp3");
  bubbleImg = loadImage("Game_Sprites/BubbleImg.png");
  ImpactFX = loadSound("Sounds/Impact.mp3");
  checkpointFX = loadSound("Sounds/checkpoint.mp3");
  failFX = loadSound("Sounds/fail.mp3");

  // background images
  BG1 = loadImage("Game_Sprites/HomeBG.png");
  BG2 = loadImage("Game_Sprites/WaterBG.png");
  BG3 = loadImage("Game_Sprites/GameOverBG.png");
  // game over image
  gameOverImg = loadImage("Game_Sprites/GameOver.png");
  // play again
  playAgainImg = loadImage("Game_Sprites/PlayAgain.png");
  // point images effects
  plusLiveImg = loadImage("Game_Sprites/plusLive.png");
  lessLiveImg = loadImage("Game_Sprites/lessLive.png");
  plusCoinImg = loadImage("Game_Sprites/plusCoin.png")

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  SceneSpeed = 10;

  // scene of the game
  Scene = createSprite(width/2,-150,5,5);

  // fish
  fish = createSprite(width/2, 570, 5,5);
  fish.addAnimation("fish",fishImg);
  fish.scale = 0.6;
  fish.setCollider("rectangle",0,0, 170, 370);
  //fish.debug = true;

  // start image
  start = createSprite(width/2, height/2 + 160, 5, 5); 
  start.addImage("start", startImg);
  start.scale = 0.6;

  // Game logo
  logo = createSprite(width/2, height/2 - 100, 5,5);
  logo.addImage("logo", logoImg);
  logo.scale = 0.7;

  // game over logo
  gameOver = createSprite(width/2, height/2 - 100, 5, 5);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 1;
  gameOver.visible = false;

  // replay button
  replay = createSprite(width/2, height/2 + 60, 20, 10);
  replay.addImage("replay", playAgainImg);
  replay.scale = 0.8;
  replay.visible = false;

  // points images
  plusCoin = createSprite(random(0,width),random(height/2,height),5,5);
  plusLive = createSprite(random(0,width),random(height/2,height),5,5);
  lessLive = createSprite(random(0,width),random(height/2,height),5,5);
  plusCoin.addImage("+1coin",plusCoinImg);
  plusLive.addImage("+1live",plusLiveImg);
  lessLive.addImage("-1live",lessLiveImg);
  plusCoin.scale = 1;
  plusLive.scale = 1;
  lessLive.scale = 1;
  plusCoin.visible = false;
  plusLive.visible = false;
  lessLive.visible = false;

  Edges = createEdgeSprites();
  stoneGroup = createGroup();
  coinGroup = createGroup();
  bubbleGroup = createGroup();

}

function draw() {
  background(BG1);

  // When Game State is "Start"
  if(gameState === "start")
  {
    // Home Page
   // Scene.addImage("background1",BG1);
    Scene.y = height/2;

    // fish
    fish.visible = false;

    // changing game state
    if(mousePressedOver(start))
    {
      gameState = "play";
      buttonFX.play();
      numState = 2;

    }


  }

  // When Game State is "Play"
  if(gameState === "play" )
  {
    // music
    //Game_Music.play();
    // reset adjustments
    Scene.visible = true;
    fish.visible = true;

    console.log(frameRate());
    Score = Score + Math.round(frameRate()/60);

    // background
    Scene.addImage("background2",BG2);
    Scene.velocityY = SceneSpeed;
    Scene.scale = 0.8;

    // gaming music

    // reseting the background
    if(Scene.y >= 900)
    {
      Scene.y = -150;
      //Scene.x = random(390,410);
    }

    fish.collide(Edges[3]);
    start.visible = false;
    logo.visible = false;
    fish.visible = true;

    // fish movement controls

    if(keyDown("left") && fish.x > 0)
    {
      fish.x -= playerSpeed;
    }

    if(keyDown(RIGHT_ARROW) && fish.x < windowWidth)
    {
      fish.x += playerSpeed;
    }    
    
    if(keyDown(UP_ARROW) && fish.y > windowHeight -200)
    {
      fish.y -= 6;
    }    
    
    if(keyDown(DOWN_ARROW) )
    {
      fish.y += 8;
    }

    // spawn bubbles
    spawnBubble();

    // spawning obctacles
    spawnStone();

    // spawning coins
    spawnCoin();

    // gaining coins
    if(coinGroup.isTouching(fish))
    {
      timeOn = true;
      Coins = Coins + 1;
      coinGroup.destroyEach();
      coinFX.play();
      plusCoin.x = random(0,width);
      plusCoin.y = random(height/2, height);
      plusCoin.visible = true;
      plusCoin.velocityY = -10;

    }

    // gaining a new life
    if(Coins >= 10)
    {
      timeOn = true;
      Coins = 0;
      Lives = Lives + 1;
      SceneSpeed = SceneSpeed + 2;
      playerSpeed = playerSpeed + 2;
      plusLive.x = random(200,width -200);
      plusLive.y = random(height/2, height);
      plusLive.visible = true;
      plusLive.velocityY = -10;
    }

    // reaching goal points
    if(Score > 0 && Score % 1000 === 0)
    {
      Lives = Lives + 1;
      SceneSpeed = SceneSpeed + 2;
      playerSpeed = playerSpeed + 2;
      plusLive.x = random(200,width -200);
      plusLive.y = random(height/2, height);
      plusLive.visible = true;
      plusLive.velocityY = -10;
      checkpointFX.play();

    }

    // failing
    if(stoneGroup.isTouching(fish))
    {
      timeOn = true;
      stoneGroup.destroyEach();
      Lives = Lives - 1;
      ImpactFX.play();
      lessLive.x = random(200,width -200);
      lessLive.y = random(height/2, 0);
      lessLive.visible = true;
      lessLive.velocityY = playerSpeed;

    }
    if(Lives <= 0)
    {
      fish.visible = false;
      gameState = "end";
      plusCoin.visible = false;
      plusLive.visible = false;
      lessLive.visible = false;
      failFX.play();
      
    }

  }

  // When Game State is "End"
  if(gameState === "end")
  {
    background(BG3);
    Scene.visible = false;
    gameOver.visible = true;
    replay.visible = true;
    //replay.debug = true;
    // background
    //Scene.addImage("background3",BG3);
    Scene.velocityY = 0;
    stoneGroup.destroyEach();
    coinGroup.destroyEach();
    bubbleGroup.destroyEach();

    // REPLAYING THE GAME
    // changing game state
    if(mousePressedOver(replay))
    {
      // image resets
      gameState = "start";
      buttonFX.play();
      gameOver.visible = false;
      replay.visible = false;
      logo.visible = true;
      start.visible = true;
      fish.visible = true;
      // play mode resets
      Lives = 3;
      Score = 0;
      Coins = 0;
      playerSpeed = 17;
      SceneSpeed = 8;
      fish.x = width/2;
      
    }


  }

  drawSprites();
  if(gameState === "play")
  {
    // lives
    fill("red");
    stroke("black");
    strokeWeight(7);
    textSize(35);
    text("Lives: "+ Lives, width - 150, 75);
    // Coins
    fill("yellow");
    text("Coins: "+ Coins, width - 150, 35);
    // score
    fill("lightgreen");
    text("Score: "+ Score, width/2 - 100, 35);

  }
  if(gameState === "end")
  {
    fill("blue");
    textSize(75);
    strokeWeight(5);
    stroke("purple")
    text("High Score: "+ Score, width/2 -285, 100);
  }

}

function spawnCoin()
{
  var coinSpeed = SceneSpeed/1.3;
  if(frameCount % 130 === 0 )
  {
    coin = createSprite(random(0,width), 0, 5, 5);
    coin.addAnimation("score", coinImg);
    coin.scale = 0.8;
    coin.velocityY = coinSpeed;
    coin.lifetime = Math.round(650/coinSpeed);
    coinGroup.add(coin);
    //coin.debug = true;
  }
}

function spawnBubble()
{
  var bubbleSpeed = SceneSpeed/0.8;
  if(frameCount % 250 === 0 )
  {
    bubble = createSprite(random(0,width), 0, 5, 5);
    bubble.addImage("bubble", bubbleImg);
    bubble.scale = 0.2;
    bubble.velocityY = bubbleSpeed;
    bubble.lifetime = Math.round(650/bubbleSpeed);
    bubbleFX.play();
    bubbleGroup.add(bubble);
    
  }
}

function spawnStone()
{
  
  if(frameCount % 100 === 0 )
  {
    stone = createSprite(random(50,width - 50), 0, 5, 5);
    stone.addImage("obstacle", stoneImg);
    stone.scale = 1.3;
    stone.velocityY = SceneSpeed;
    stone.lifetime = Math.round(650/SceneSpeed);
    stoneGroup.add(stone);
    stone.depth = Scene.depth +1;
    //stone.debug = true;
    
  }

}




