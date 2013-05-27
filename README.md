Capsule.js
==========
```javascript

//Abstractclass / Interface 
var TheUndead = {
  preferredMeal : 'string', // properties that MUST be defined and their types(based on typeof)
  death_year    : 'number',
  resurect      : 'function',
  abstract      : {        // definitions of properties to be used out of the box 
    complain  : function(){
      console.log('Man I could really go for some ' + this.preferredMeal);
    },
    schedule  : function(){ 
      console.log('I need to feed at least ' + this.hungerLvl + ' times a day');
    },
    hungerLvl : 2
  }
};

//Baseclass
var Monster = function(att, intim){
  this.attack = function(){ console.log(att) };
  this.health = 0;
  this.intim = intim;
  this.kills = Math.random() * 100;
};

Monster.prototype.intimidate = function() {
  console.log(this.intim);
};

Monster.prototype.regenerate  = function(amount){ 
  this.health += amount; 
};

//Subclass
var Vampire = function(att){
  this.super([att, 'I am thirsty...you should run']); //calls the Superclass (Monster) with the given args
  this.name = 'dracula';
  this.age = '267';
}.extends(Monster).implements(TheUndead); // new Vampire('chomp') instanceof Monster == true

Vampire.prototype.intimidate = function(){
  this.super('intimidate');   //prints 'I am thirsty...you should run'
  console.log('too late...'); //'too late...'
}

Vampire.prototype.regenerate = function(){
  this.super('regenerate', [15]);
  console.log(this.health);  //prints '15'
}

```

