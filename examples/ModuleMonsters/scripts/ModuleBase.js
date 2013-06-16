//FILE 1
namespace('Monsters.Base');

//Character Base Class
Monsters.Base.Character = function(name, evil){                   
  this.name = name;                 
  this.health = 100;                
  this.reactive('evil', evil);      

  this.cheesyLine = function(line){ 
    console.log(line);              
  };             

  this.greet = function(){
    if(this.name){
      console.log(this.name + ' checking in...');
    }
  }

  this.greet();

  return this;
}


//Monster Base Class
Monsters.Base.Monster = function(name){
  this.super([name, true]);

  this.convert = function(){
    var hero = new Monsters.Base.Hero(this.name);
    return hero;
  }

  this.attack = function(character, att, power){
    if(character instanceof Monsters.Base.Monster){
      console.log('I only eat heroes');
      return;
    }
    console.log(att);
    character.health -= power;
  }

  return this;
}.extends(Monsters.Base.Character);

//Hero Base Class
Monsters.Base.Hero = function(name){
  this.super([name, false]);

  this.cheesyLine = function(){
    this.super('cheesyLine', ['lose the zero...get with the hero']);
  }

  this.convert = function(){
    return new Monsters.Base.Monster(this.name);
  }

  return this;
}.extends(Monsters.Base.Character);
