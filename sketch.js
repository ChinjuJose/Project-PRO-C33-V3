const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Render = Matter.Render;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine, world;
var ground, rope, fruit, fruitOptions, fruitLink;
var bunny, bunnyImg;
var bgImg, fruitImg;
var cutButton, blower;
var blink, sad, eat;
var bubble, bubbleImg;
var bkSound, eatSound, cutSound, sadSound, airSound;

function preload() {
  bgImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  bunnyImg = loadImage("rabbit.png");
  bubbleImg = loadImage("bubble.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  sad = loadAnimation("sad_2.png", "sad_3.png");
  bkSound = loadSound("sound1.mp3");
  eatSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");

  blink.playing = true;
  eat.playing = true;
  eat.looping = false;
  sad.playing = true;
  sad.looping = false;
  blink.frameDelay = 10;
  eat.frameDelay = 20;
  sad.frameDelay = 20;
  cutSound.looping = false;
}

function setup() {
  bkSound.play();
  createCanvas(500, 600);
  
  bkSound.setVolume(0.2);
  engine = Engine.create();
  world = engine.world;

  ground = new Ground(200, 590, 700, 20);
  console.log(ground.body);

  bubble = createSprite(290, 460, 20, 20);
  bubble.addImage(bubbleImg);
  bubble.scale = 0.1;

  rope1 = new Rope(4, { x: 230, y: 300 });
  rope2 = new Rope(4, { x: 50, y: 420 });

  fruitOptions = {
    density: 0.001
  }
  fruit = Bodies.circle(100, 400, 15, fruitOptions);
  Composite.add(rope1.body, fruit);
  fruitLink1 = new Link(rope1, fruit);
  fruitLink2 = new Link(rope2, fruit);

  bunny = createSprite(250, 100, 100, 100);
  bunny.addImage(bunnyImg);
  bunny.scale = 0.15;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  bunny.changeAnimation("blinking");

  cutButton1 = createImg("cut_btn.png");
  cutButton1.position(200, 290);
  cutButton1.size(50, 50);
  cutButton1.mouseClicked(drop1);

  cutButton2 = createImg("cut_btn.png");
  cutButton2.position(30, 400);
  cutButton2.size(50, 50);
  cutButton2.mouseClicked(drop2);

  muteButton = createImg("mute.png");
  muteButton.position(400, 20);
  muteButton.size(50, 50);
  muteButton.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() {
  background(bgImg);

  Engine.update(engine);
  ground.show();
  rope1.show();
  rope2.show();
  imageMode(CENTER);
  if (fruit != null) {
    image(fruitImg, fruit.position.x, fruit.position.y, 50, 50);
  }

  if (collide(bubble, bunny, 80)) {
    if (fruit != null) {
      removeRope();
      bubble.visible = false;
      bunny.changeAnimation("eating");
      eatSound.play();
      fruit = null;
    }
  }

  if (fruit != null && fruit.position.y >= 550) {
    bunny.changeAnimation("crying");
    fruit = null;
    bkSound.stop();
    sadSound.play();
  }

  if (collide(fruit, bubble, 40) == true) {
    engine.world.gravity.y = -1;
    bubble.position.x = fruit.position.x;
    bubble.position.y = fruit.position.y;
  }


  drawSprites();
}

function drop1() {
  cutSound.play();
  rope1.break();
  fruitLink1.detach();
  fruitLink1 = null;
}

function drop2() {
  cutSound.play();
  rope2.break();
  fruitLink2.detach();
  fruitLink2 = null;
}

function collide(fruit, sprite, distance) {
  if (fruit != null) {
    var d = dist(fruit.position.x, fruit.position.y, sprite.position.x, sprite.position.y);
    if (d <= distance) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function mute() {
  if (bkSound.isPlaying()) {
    bkSound.stop();
  } else {
    bkSound.play();
  }
}

function removeRope() {
  if (fruit != null) {
    rope1.break();
    rope2.break();
    fruitLink1.detach();
    fruitLink1 = null;
  }



}




