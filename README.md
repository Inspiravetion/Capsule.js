Capsule.js
==========

Motivation
----------

API
---
####extends(Superclass)
* Extends a class to have all the functionality of the specified Superclass.

```javascript
  var Vampire = function(){
    this.super();  
  }.extends(Monster);
```
* Superclass : The constructor function of the Superclass
* Caveats :

####super(superFunction, argArray)
* When passed super function :
* When not passed super function :

```javascript
  var Vampire = function(){
    this.super(['blood', 'transylvania']);  
  }.extends(Monster);
  
  Vampire.prototype.hunt = function(){
    this.super('hunt', ['1am', '2am']);
    //do stuff...
  }
```
* superFunction : 
* argArray :
* Caveats :
####API Caveats

Object Extension / Interface Implementation
----------------------------------------
```javascript

//Abstractclass / Interface 
var TheUndead = {
  preferredMeal : 'string', // properties that MUST be explicitly defined and their types(based on typeof)
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
  this.attack = function(){ console.log(att) }; //can only be overridden in Subclass if it is redefined in the 
  this.health = 0;                              //Subclass construtor ***functional super() call cannot happen***
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
}.extends(Monster).implements(TheUndead); // Intuitive syntax for 'extends' and 'implements'

Vampire.prototype.intimidate = function(){
  this.super('intimidate');   //call Superclass function (Monster.intimidate()) with this context
  console.log('too late...'); 
}

Vampire.prototype.regenerate = function(){
  this.super('regenerate', [15]); //call Superclass function (Monster.regenerate()) with this context passing it args
  console.log(this.health);  
}

var drac = new Vampire('chomp');
drac instanceof Monster // true
drac.schedule(); // prints 'I need to feed at least 2 times a day'
drac.regenerate(); // prints 15
drac.intimidate(); // 'I am thirsty...you should run' 'too late...'
drac.complain(); // WOMP this throws 'Error: attempting to access unimplemented interface property preferredMeal.'
drac.death_year = '1991'; // WOMP this throws Error: attempting to set interface property death_year with incorrect type
drac.death_year = 1991;// sets the value like normal

```

