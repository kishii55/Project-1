//Array of available objects
var opponent = [
    {name: 'Ryu', img: 'images/Ryu.jpg', hp: 200, rnd: 0},
    {name: 'Guile', img: 'images/Guile.jpg', hp: 200, rnd: 0},
    {name: 'Chun-Li', img: 'images/ChunLi.jpg', hp: 200, rnd: 0},
    {name: 'Cammy', img: 'images/Cammy.jpg', hp: 200, rnd: 0},
    {name: 'Akuma', img: 'images/Akuma.jpg', hp: 200, rnd: 0},
    {name: 'Dhalsim', img: 'images/Dhalsim.jpg', hp: 200, rnd: 0},
    {name: 'M-Bison', img: 'images/Bison.jpg', hp: 200, rnd: 0},
    {name: 'Zangief', img: 'images/Zangief.jpg', hp: 200, rnd: 0},
    {name: 'Sagat', img: 'images/Sagat.jpg', hp: 200, rnd: 0},
    {name: 'Vega', img: 'images/Vega.jpg', hp: 200, rnd: 0},
    {name: 'Balrog', img: 'images/Balrog.jpg', hp: 200, rnd: 0},
    {name: 'Blanka', img: 'images/Blanka.jpg', hp: 200, rnd: 0},
    {name: 'Crimson Viper', img: 'images/CrimsonViper.jpg', hp: 200, rnd: 0},
    {name: 'E. Honda', img: 'images/EHonda.jpg', hp: 200, rnd: 0},
    {name: 'Fei Long', img: 'images/FeiLong.jpg', hp: 200, rnd: 0}
];


//My Choice

var Ken = {name: 'Ken', img: 'images/KenStandingStill.png', hp: 200, rnd: 0};

//=================================================================+
//Fighter Constructor function
//==================================================================
function Fighter(name, img, hp, rnd) {
  this.name = name;
  this.img = img;
  this.hp = hp;
  this.rnd = rnd;

  this.isKO = function(){
    return this.hp <= 0;
  };

  this.totalWins = function(){
    return this.rnd < 3;
  };

  // successRate
  var isSuccessful = function(percent){
    return Math.random() < percent;
  };
  // Returns a random int between min and max inclusive with addition of base number wanted
  var generateRandom = function(min, max){
    return Math.floor(Math.random()* (max - min)+50);
  };

  //isSuccessful method calculates a % chance that Attacks will hit or miss or dealing little to massive dmg (like dodging and performing critical hits)

  this.rest = function(){
    this.hp += generateRandom(50, 70);
  };

  this.attack = function(opponent) {
    if(isSuccessful(0.9)){
      opponent.receiveDamage(generateRandom(50, 80));
      return true;
    } else {
      return false;
    }
  };

  this.receiveDamage = function(damage){
    if(isSuccessful(0.8)){
      this.hp -= damage;
      return true;
    } else {
      return false;
    }
  };

}

//==================================================================
//GAMEPLAY Constructor
//==================================================================
var game = {
  player: {},
  opponent: {},
  currentPlayer: {},
  start: function(opponent, player){
    // Set the player and opponent
    this.player = new Fighter(player.name, player.img, player.hp, player.rnd);
    this.opponent = new Fighter(opponent.name, opponent.img,
    opponent.hp, opponent.rnd);
    // Set the currentPlayer to player
    this.currentPlayer = this.player;
  },
  attack: function(){
    if(this.currentPlayer === this.player){
        this.player.attack(this.opponent);
        this.currentPlayer = this.opponent;
    } else {
      this.opponent.attack(this.player);
      this.currentPlayer = this.player;
    }
  },
  rest: function(){
    if(this.currentPlayer === this.player){
      this.player.rest();
      this.currentPlayer = this.opponent;
    } else {
      this.opponent.rest();
      this.currentPlayer = this.player;
    }
  },
  continue: function(){
    return this.player.totalWins();
  },
  win: function(){
    return this.opponent.isKO();
  },
  lose: function(){
    return this.player.isKO();
  }
};

//==================================================================
// BEGIN DOCUMENT ONLOAD
//==================================================================
$(document).ready(function(){
  var $attackBtn = $('#attackBtn'),
    $opponentImg = $('#opponentImg'),
    $opponentName = $('#opponent .name'),
    $opponenthp = $('#opponent .hp'),
    $opponentRnd = $('#opponent .rnd'),
    $playerhp = $('#ken .hp'),
    $playerRnd = $('#ken .rnd')
    $status = $('#status'),
    $restBtn = $('#restBtn');
    $restartBtn = $('#restartBtn');


//==================================================================//Invoking Start Game to DOM
//=================================================================
  game.start(opponent[Math.floor(Math.random()*opponent.length)], Ken);
  // Set name and attributes for opponent
  $opponentImg.attr('src', game.opponent.img);
  $opponentName.text(game.opponent.name);
  $opponenthp.text('HP: ' + game.opponent.hp);
  $opponentRnd.text('Rounds Won: ' + game.opponent.rnd);
  // Display status to a new challenger appears
  $status.text('A new challenger ' + game.opponent.name + ' approaches!');

  //================================================================
  //ATTACK button
  //================================================================

  // On atk click
  $attackBtn.click(function(event){
    // Hide options after selecting one to prevent multi clicking
    $attackBtn.hide();
    $restBtn.hide();
    // Store current hp before attack
    var hpBeforeAttack = game.opponent.hp;
    //Store current rnd before attack
    var rndBeforeAttack = game.player.rnd;
    // Run attack
    game.attack();
    // Update hp/rnd info
    $opponenthp.text('HP: ' + game.opponent.hp);
    // Update status text
    var hpAfterAttack = game.opponent.hp;
    $status.text(game.player.name + ' attacks and deals ' +
      (hpBeforeAttack - hpAfterAttack) +
      ' damage');


    // Check for win situation
    if(game.win() && game.continue()){
      $playerRnd.text('Rounds Won: ' + (rndBeforeAttack + 1));
      $status.text(game.player.name + " has defeated " + game.opponent.name + "!");
      game.start(opponent, ken);
    }
    // Timout during opponent turn
    window.setTimeout(function(){
        $status.text(game.opponent.name + '\'s turn');
        window.setTimeout(opponentTurn, 1000);
    }, 1000);

  });

  function opponentTurn(){
    //The enemy will choose to attack 75% of the time and if not will choose to rest
    if(Math.random() < 0.75){
      //store player hp before opponent attacks
      var hpBeforeAttack = game.player.hp;
      //store rounds opponent has before attacks
      var rndBeforeAttack = game.opponent.rnd;
      //opponent attacks
      game.attack();
      //store player hp after opponent attacks
      var hpAfterAttack = game.player.hp;
      // Update player hp and info
      $playerhp.text('HP: ' + game.player.hp);
      $status.text(game.opponent.name + ' attacks and deals ' +
      (hpBeforeAttack - hpAfterAttack) + ' damage.');
    } else {
      var hpBeforeRest = game.opponent.hp;
      game.rest();
      var hpAfterRest = game.opponent.hp;
      // Update player hp
      $opponenthp.text('hp: ' + game.opponent.hp);
      $status.text(game.opponent.name + ' recovers ' +
      (hpAfterRest - hpBeforeRest) + ' HP!');
    }

    // Check for loss
    if(game.lose()){
      $opponentRnd.text('Rounds Won: ' + (rndBeforeAttack + 1));
      $status.text(game.player.name + " has been K.O. by " + game.opponent.name + "! G.a.M.e O.v.E.r");
      //Return Stops functions from moving on
      return;
    }

    // Show the buttons
    $attackBtn.show();
    $restBtn.show();
  }
//================================================================
//REST button
//================================================================
  // Add handler to rest button
  $restBtn.click(function(event){
    // Hide the buttons
    $restBtn.hide();
    $attackBtn.hide();
    // Save hp before rest
    var hpBeforeRest = game.player.hp;
    // rest
    game.rest();
    // Save hp after resting and print difference to status
    var hpAfterRest = game.player.hp;
    $status.text(game.player.name + ' recovers ' +
    (hpAfterRest - hpBeforeRest) + ' HP!');
    $playerhp.text('HP: ' + game.player.hp);

    // Timout during opponent turn
    window.setTimeout(function(){
        $status.text(game.opponent.name + '\'s turn');
        window.setTimeout(opponentTurn, 1000);
    }, 1000);
  });


//==================================================================
//RESTART button
//==================================================================
  $restartBtn.click(function(event){
    location.reload();
  });
// =================================================================
//FINAL ATTACK Function
//==================================================================

//save objects
var $kenStill = $('.kenStill'),
    $kenBounce = $('.kenBounce'),
    $kenFire = $('.kenFire'),
    $hadouken = $('.hadouken');

  //Event when mouse over super finish changes image
  $kenStill.mouseover(function() {
    $kenStill.hide();
    $kenBounce.show();
  })

  $kenStill.mouseleave(function() {
    $kenBounce.hide();
    $kenStill.show();
    $kenFire.hide();
  })

  //Event: when left click show hadouken
  .mousedown(function() {
    $hadouken.show();
    $kenBounce.hide();
    $kenFire.show();
    $hadouken.finish().show().animate({'left': '550px'}, 500,function() {    
  });


  })
  .mouseup(function() {
    $kenFire.hide();
    $kenBounce.show();
    $hadouken.hide();
  });


//END DOCUMENT ONLOAD
});
