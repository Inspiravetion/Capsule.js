
// FILE 3======================================================================
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