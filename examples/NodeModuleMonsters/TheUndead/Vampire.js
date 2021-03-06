var Monster   = require('../Base/Base.js').Monster,
	TheUndead = require('../Interfaces/Interfaces.js').TheUndead; 

//Vampire Class-----------------------------
var Vampire = function(name){
  this.super([name]);
  this.strength = 20;
}.extends(Monster).implements(TheUndead);

Vampire.prototype.attack = function(character){
  this.super('attack', [character, 'Chomp', this.strength]);
}

Vampire.overload('regenerate', function(){
	this.regenerate('The blood is kicking in...', 20);
});

module.exports = Vampire;
