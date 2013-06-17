//FILE 1
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

Monsters.Base.Character.overload('regenerate', function(health){
  this.health += health;
}, [Number]);

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
