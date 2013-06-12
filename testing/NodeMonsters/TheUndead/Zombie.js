namespace('Monsters.TheUndead');

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