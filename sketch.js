var dog, happyDog, database, foodS, foodStock, foodObj;
var dogImage, dogHappyImage;
var fedTime, lastFed;
var feed, addFood;

function preload(){
  dogImage=loadImage("Dog.png");
  dogHappyImage=loadImage("happydog.png");
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();

  foodObj = new Food;

  dog = createSprite(750,250);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background("green");
  foodObj.display();
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed % 12 + "PM", 400,30);
   }
   else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }
   else{
     text("Last Feed : "+ lastFed + "AM", 400,30);
   }
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogHappyImage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}