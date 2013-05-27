Capsule.js
==========

Motivation
----------

API
---
####extends(Superclass)
Extends a class to have all the functionality of the specified Superclass.

```javascript
  var Vampire = function(){
    this.super();  
  }.extends(Monster);
  
  var dracula = new Vampire();
  dracula instanceof Monster // true
```
* Parameters :
 * Superclass : The constructor function of the Superclass
* Caveats : Only supports single extension  and ```this.super()``` must be called in the Subclass constructor for extension to function properly

####super(funcName, argArray)
Can be used in two different ways. If funcName is not present, the super gets called with this context and argArray as its parameters.
If funcName is present, then the the Superclasse's function given by funcName is called with the argArray as its parameters.

```javascript
  var Vampire = function(){
    this.super(['blood', 'transylvania']);  
  }.extends(Monster);
  
  Vampire.prototype.hunt = function(){
    this.super('hunt', ['1am', '2am']);
    //do stuff...
  }
```
* Parameters :
 * funcName (optional): the String name of the Superclasse's function to be called
 * argArray (optional): the arguments to pass to either the Superclass constructor or one of its functions
* Caveats : funcName must be a function on the prototype of the Superclass

####implements(interfaceObj)
Adds each property of the interfaceObj to an Objects prototype. If any of the properties that are not in the 'abstract' object
are referenced or set to a value that != its current value (when used with typeof), then an error is thrown. This is to guarantee
that you explicitely define these values to satisfy the interface. Any of the properties in the 'abstract' object of the interface
just get added to the prototype and can be used accordingly.

```javascript
  var TheUndead = {
    infectionStory : 'string',
    abstract : {
      die : function(){
        console.log('lol too late');
      },
      sobStory : function(){
        console.log('I got this way when ' + this.infectionStory + ' :(')
      }
    }
  }  

  var Vampire = function(){
    this.super();  
  }.extends(Monster).implements(TheUndead);
  
  var dracula = new Vampire();
  dracula.die(); // prints 'lol too late'
  dracula.sobStory(); // throws error because infectionStory has not been properly set yet
  dracula.infectionStory // also throws error
```
* Parameters :
 * interfaceObj : An Object literal that defines what properties should be enforced along with their acceptable values. An 'abstract' portion defines properties to be directly added to the prototype.
* Caveats : Throws errors at runtime if a property is accessed that hasnt been implemented. This is the point however.


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

