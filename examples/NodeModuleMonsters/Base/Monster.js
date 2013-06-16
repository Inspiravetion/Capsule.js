var Base      =	require('./Base.js'),
	Character = Base.Character,
	Hero      = require('./Hero.js');// Circular dependency needs to be loaded directly

//Monster Base Class
var Monster = function(name){
  this.super([name, true])
}.extends(Character);

Monster.prototype.convert = function(){
  var hero = new Hero(this.name);
  return hero;
}

Monster.prototype.attack = function(character, att, power){
  if(character instanceof Monster){
    console.log('I only eat heroes');
    return;
  }
  console.log(att);
  character.health -= power;
}

module.exports = Monster;
