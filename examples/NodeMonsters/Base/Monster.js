require('./Character.js');
require('./Hero.js');

namespace('Monsters.Base');

//Monster Base Class
Monsters.Base.Monster = function(name){
  this.super([name, true])
}.extends(Monsters.Base.Character);

Monsters.Base.Monster.prototype.convert = function(){
  var hero = new Monsters.Base.Hero(this.name);
  return hero;
}

Monsters.Base.Monster.prototype.attack = function(character, att, power){
  if(character instanceof Monsters.Base.Monster){
    console.log('I only eat heroes');
    return;
  }
  console.log(att);
  character.health -= power;
}

Monsters.Base.Monster.overload('regenerate', function(message, health){
	console.log(message);
	this.regenerate(health);
}, [String, Number]);

