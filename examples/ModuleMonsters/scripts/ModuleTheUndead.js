
// FILE 3======================================================================
namespace('Monsters.TheUndead');

//Vampire Class-----------------------------
Monsters.TheUndead.Vampire = function(name){
  this.super([name]);
  this.strength = 20;

  this.attack = function(character){
    this.super('attack', [character, 'Chomp', this.strength]);
  }

  return this;
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

//Vampire SubClass---------------------------------
Monsters.TheUndead.NewBornVampire = function(name){
	this.super([name]);
	this.strength = 40;

  this.schedule = function(){
    this.super('schedule');
    console.log('give or take 3 or 4 meals');
  }

  return this;
}.extends(Monsters.TheUndead.Vampire);

//Zombie Class----------------------------- 
Monsters.TheUndead.Zombie = function(name){
  this.super([name]);

  this.attack = function(character){
    if(character instanceof Monsters.Base.Monster){
      console.log("I don't care that you are a monster...");
    }
    console.log('Slurp');
    character.health -= 10;
  }

  return this;
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);