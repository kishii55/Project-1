//console.log('app.js connected');

// Fighter constructor
var hero = function(health, attack, speed, accuracy, critical){
  this.hp = health;
  this.atk = attack;
  this.spd = speed;
  this.acc = accuracy;
  this.crit = critical;
}

// Make an enemy
function opponent() {

  // set hp static

  var  = 100

  // set attack to random number between 20 and 5
  var attack = Math.floor((Math.random() * 20) + 5);

  //set speed to a random number between 10 and 5
  var speed = Math.floor((Math.random() * 10 + 5);

  // set accuracy to random %
  var accuracy = Math.floor(Math.random() * 0.8) + 0.3;

  // create and return new opponent
  return new Ship(hp, atk, spd, acc, crit);
}
