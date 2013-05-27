Capsule.js
==========
```javascript

//Abstractclass / Interface 
var TheUndead = {
  preferredMeal : 'string',
  death_date    : 'date',
  resurect      : 'function',
  abstract      : {
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
  console.log('from the supers call :(');
};

Monster.prototype.kills = 0;

//Subclass
var Vampire = function(att){
  this.super([att, 'I am thirsty...you should run']);
  this.name = 'dracula';
  this.age = '267';
}.extends(Monster).implements(TheUndead);

Vampire.prototype.intimidate = function(){
  this.super('intimidate');
  console.log('too late...');
}

Vampire.prototype.regenerate = function(){
  this.super('regenerate', [15]);
  console.log(this.health);
}

```

