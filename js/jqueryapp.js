//Array of available objects
var opponent = [
    {name: 'Ryu', img: '../images/Ryu.jpg', hp: 500},
    {name: 'Ken', img: '../images/Ken.jpg', hp: 500},
    {name: 'Chun-Li', img: '../images/ChunLi.jpg', hp: 500},
    {name: 'Cammy', img: '../images/Cammy.jpg', hp: 500},
    {name: 'Akuma', img: '../images/Akuma.jpg', hp: 500},
    {name: 'Dhalsim', img: '../images/Dhalsim.jpg', hp: 500},
    {name: 'M-Bison', img: '../images/Bison.jpg', hp: 500},
    {name: 'Zangief', img: '../images/Zangief.jpg', hp: 500},
    {name: 'Sagat', img: '../images/Sagat.jpg', hp: 500},
    {name: 'Vega', img: '../images/Vega.jpg', hp: 500},
    {name: 'Balrog', img: '../images/Balrog.jpg', hp: 500},
    {name: 'Blanka', img: '../images/Blanka.jpg', hp: 500},
    {name: 'Crimson Viper', img: '../images/CrimsonViper.jpg', hp: 500},
    {name: 'E. Honda', img: '../images/EHonda.jpg', hp: 500},
    {name: 'Fei Long', img: '../images/FeiLong.jpg', hp: 500}
];


//My Choice

var Guile = { name: 'Guile', img: '../images/Guile.jpg', hp: 500 };

//Fighter Constructor function

function Fighter(name, img, hp) {
  this.name = name;
  this.img = img;
  this.hp = hp;


//isSuccessful method calculates a % chance that Attacks will hit or miss

  this.attack = function(opponent) {
    if(isSuccessful(0.8)){
      opponent.receiveDamage(generateRandom(30, 50));
      return true;
    } else {
      return false;
    }
  };

  this.receiveDamage = function(damage){
    if(isSuccessful(0.6)){
      this.hp -= damage;
      return true;
    } else {
      return false;
    }
  };

  this.rest = function(){
    this.hp += generateRandom(50, 100);
  };

  this.isKO = function(){
    return this.hp <= 0;
  };
  // successRate
  var isSuccessful = function(p){
    return Math.random() < p;
  };
  // Returns a random int between min and max inclusive with addition of base number wanted
  var generateRandom = function(min, max){
    return Math.floor(Math.random()* (max - min)+50);
  };
}

var game = {
  player: {},
  opponent: {},
  currentPlayer: {},
  start: function(opponent, player){
    // Set the player and opponent
    this.player = new Fighter(player.name, player.img,
       player.hp);
    this.opponent = new Fighter(opponent.name, opponent.img,
    opponent.hp);
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
  win: function(){
    return this.opponent.isKO();
  },
  lose: function(){
    return this.player.isKO();
  }
};

$(document).ready(function(){
  var $attackBtn = $('#attackBtn'),
    $opponentImg = $('#opponentImg'),
    $opponentName = $('#opponent .name'),
    $opponenthp = $('#opponent .hp'),
    $playerhp = $('#guile .hp'),
    $status = $('#status'),
    $restBtn = $('#restBtn');

  // Start Game
  game.start(opponent[Math.floor(Math.random()*opponent.length)], Guile);
  // Set name and attributes for opponent
  $opponentImg.attr('src', game.opponent.img);
  $opponentName.text(game.opponent.name + '!');
  $opponenthp.text('HP: ' + game.opponent.hp);
  // Display status to a new challenger appears
  $status.text('A new challenger ' + game.opponent.name + ' approaches!');
  // On atk click
  $attackBtn.click(function(event){
    // Hide options after selecting one to prevent multi clicking
    $attackBtn.hide();
    $restBtn.hide();
    // Store current hp before attack
    var hpBeforeAttack = game.opponent.hp;
    // Run attack
    game.attack();
    // Update hp info
    $opponenthp.text('HP: ' + game.opponent.hp);
    // Update status text
    var hpAfterAttack = game.opponent.hp;
    $status.text(game.player.name + ' attacks and deals ' +
      (hpBeforeAttack - hpAfterAttack) +
      ' damage');
    // Check for win situation
    if(game.win()){
      $status.text(game.player.name + " has defeated " + game.opponent.name + "!");
      return;
    }
    // Timout during opponent turn
    window.setTimeout(function(){
        $status.text(game.opponent.name + '\'s turn');
        window.setTimeout(opponentTurn, 500);
    }, 500);

  });

  function opponentTurn(){
    if(opponent.hp > 0){
      var hpBeforeAttack = game.player.hp;
      game.attack();
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
      $status.text(game.player.name + " has been K.O. by " + game.opponent.name + "!");
      return;
    }

    // Show the buttons
    $attackBtn.show();
    $restBtn.show();
  }

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

    // Timout for 2 seconds while showing opponent turn
    window.setTimeout(function(){
        $status.text(game.opponent.name + '\'s turn');
        window.setTimeout(opponentTurn, 1000);
    }, 1000);
  });
});
