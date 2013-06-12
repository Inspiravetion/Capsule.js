require('./Character.js');
require('./Monster.js');

namespace('Monsters.Base');

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