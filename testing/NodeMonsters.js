require('../Capsule.js');

namespace('Monsters.Base');

//Character Base Class
Monsters.Base.Character = function(name, evil){
  this.cheesyLine = function(line){ //can only be overridden in Subclass if it is redefined in the
    console.log(line);              //Subclass construtor...functional super() call can only happen
  };                                //from an instance function defined in the Subclass Constructor
  this.name = name;                 //after the Subclass Constructor calls super()
  this.health = 100;                
  this.reactive('evil', evil);      
  this.greet();
}

Monsters.Base.Character.prototype.greet = function(){
  if(this.name){
    console.log(this.name + ' checking in...');
  }
}

//Monster Base Class
Monsters.Base.Monster = function(name){
  this.super([name, true])
}.extends(Monsters.Base.Character);

Monsters.Base.Monster.prototype.convert = function(){
  var hero = new Monsters.Base.Hero(this.name);
  return hero;
}

Monsters.Base.Monster.prototype.attack = function(character, att, power){
  if(character.instanceOf(Monsters.Base.Monster)){
    console.log('I only eat heroes');
    return;
  }
  console.log(att);
  character.health -= power;
}

//Hero Base Class
Monsters.Base.Hero = function(name){
  this.super([name, false]);
  this.cheesyLine = function(){
    this.super('cheesyLine', ['lose the zero...get with the hero']);
  };
}.extends(Monsters.Base.Character);

Monsters.Base.Hero.prototype.convert = function(){
  return new Monsters.Base.Monster(this.name);
}

namespace('Monsters.Interfaces');

//TheUndead Interface------------
Monsters.Interfaces.TheUndead = {
  attack    : 'function',
  resurrect : 'function',
  abstract : {
    die : function(){
      console.log('Too late...');
    },
    schedule  : function(){ 
      console.log('I need to feed at least ' + this.hungerLvl + ' times a day');
    },
    hungerLvl : 2
  }
}

namespace('Monsters.TheUndead');

//Vampire Class-----------------------------
Monsters.TheUndead.Vampire = function(name){
  this.super([name]);
  this.strength = 20;
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

Monsters.TheUndead.Vampire.prototype.attack = function(character){
  this.super('attack', [character, 'Chomp', this.strength]);
}

//Vampire SubClass---------------------------------
Monsters.TheUndead.NewBornVampire = function(name){
  this.super([name]);
  this.strength = 40;
}.extends(Monsters.TheUndead.Vampire);

Monsters.TheUndead.NewBornVampire.prototype.schedule = function(){
  this.super('schedule');
  console.log('give or take 3 or 4 meals');
}

//Zombie Class----------------------------- 
Monsters.TheUndead.Zombie = function(name){
  this.super([name]);
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

Monsters.TheUndead.Zombie.prototype.attack = function(character){
  if(character.instanceOf(Monsters.Base.Monster)){
    console.log("I don't care that you are a monster...");
  }
  console.log('Slurp');
  character.health -= 10;
}

//-----------------------------------------------------------------------------

var vamp = new Monsters.TheUndead.Vampire('dracula'); //dracula checking in...
zombie = new Monsters.TheUndead.Zombie('garth'); //garth checking in... 
newBorn = new Monsters.TheUndead.NewBornVampire('newby'); //newby checking in... 
human = new Monsters.Base.Hero('charlie'); //charlie checking in... 

vamp.attack(zombie); // I only eat heroes 
vamp.attack(human); // Chomp

zombie.attack(vamp); // I don't care that you are a monster... Slurp
zombie.attack(human); // Slurp

newBorn.attack(human); // Chomp
newBorn.attack(zombie); // I only eat heroes ***inherited from Vampire***


console.log('human: ' + human.health); // human: 30
console.log('vamp: ' + vamp.health); // vamp: 90
console.log('zombie: ' + zombie.health); // zombie: 100

zombie.arm('evil', function(oldVal, newVal){
  console.log('oldval:' + oldVal); // oldval: true
  console.log('newval:' + newVal); // newval: false
  if(newVal == false){
    zombie = zombie.convert();
  }
});

zombie.die(); // Too late...
newBorn.die(); // Too Late... ***inherits abstract method from Vampire implementing TheUndead***

zombie.evil = false; //garth checking in...

console.log(zombie.instanceOf(Monsters.Base.Monster)); //false
console.log(zombie.instanceOf(Monsters.Base.Hero)); //true
console.log(zombie.instanceOf(Monsters.Base.Character)); //true

console.log(zombie.evil); // false
console.log(zombie.health); // 100
vamp.attack(zombie); //Chomp
console.log(zombie.health); // 80

zombie.cheesyLine(); //lose the zero...get with the hero 
newBorn.schedule(); //prints 'I need to feed at least 2 times a day' then 'give or take 3 or 4 meals'
newBorn.resurrect(); // throws Error: attempting to access unimplemented interface property resurrect. 
