 //FILE 1
  namespace('Monsters.Base');

  //Character Base Class
  Monsters.Base.Character = function(name, evil){
    this.name = name;
    this.health = 100;
    this.reactive('evil', evil);
    this.greet();
  }

  Monsters.Base.Character.prototype.greet = function(){
    console.log(this.name + ' checking in...');
  }

  //Monster Base Class
  Monsters.Base.Monster = function(name){
    this.super([name, true])
  }.extends(Monsters.Base.Character);

  Monsters.Base.Monster.prototype.convert = function(){
    var hero = new Monsters.Base.Hero(this.name);
    return hero;
  }

  Monsters.Base.Monster.prototype.attack = function(character, att, power){
    if(character.instanceOf(Monsters.Base.Monster)){
      console.log('I only eat heroes');
      return;
    }
    console.log(att);
    character.health -= power;
  }

  //Hero Base Class
  Monsters.Base.Hero = function(name){
    this.super([name, false]);
  }.extends(Monsters.Base.Character);

  Monsters.Base.Hero.prototype.convert = function(){
    return new Monsters.Base.Monster(this.name);
  }
