var Monster   = require('../Base/Base.js').Monster,
	TheUndead = require('../Interfaces/Interfaces.js').TheUndead; 

//Zombie Class----------------------------- 
var Zombie = function(name){
  this.super([name]);
}.extends(Monster).implements(TheUndead);

Zombie.prototype.attack = function(character){
  if(character instanceof Monster){
    console.log("I don't care that you are a monster...");
  }
  console.log('Slurp');
  character.health -= 10;
}

module.exports = Zombie;