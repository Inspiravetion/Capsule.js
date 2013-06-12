var Base      =	require('./Base.js'),
	Character = Base.Character,
	Monster   = require('./Monster.js'); // Circular dependency needs to be loaded directly

//Hero Base Class
var Hero = function(name){
  this.super([name, false]);
  this.cheesyLine = function(){
    this.super('cheesyLine', ['lose the zero...get with the hero']);
  };
}.extends(Character);

Hero.prototype.convert = function(){
  return new Monster(this.name);
}

module.exports = Hero;