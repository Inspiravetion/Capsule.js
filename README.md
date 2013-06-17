Capsule.js
==========

Motivation
----------
I switched from traditional OOP Languages to using alot of JavaScript about a year ago and while I love the expressiveness 
and freedom it gives, I really miss the basic polymorphic goodness you get with other languages. Now obviously you can 
extend objects and such in JavaScript but it is an eyesore to say the least. There are also libraries to do this for you
(underscore, google closure, etc) but they are usually very large and require you to use some type of global object to be 
a wrapper around the whole process. The point of this library is to make traditional OOP practices native to JavaScript 
Objects so that you can code with intuitive syntax and have it work how you would expect. And for those of you worried 
about prototype pollution, all (API) properties added to Object are NON-ENUMERABLE...so 'for (prop in obj)' will not be 
corrupted. Along with the API bits that deal with inheritance and code reuse I also implemented reactive variables so that
you can have handlers called whenever a specific property of an object is changed .Also did I mention it's less than 9kb un-minified and
less than 5kb minified?

Download
--------

* [minified](https://raw.github.com/Inspiravetion/Capsule.js/master/Capsule-min.js)
* [un-minified](https://raw.github.com/Inspiravetion/Capsule.js/master/Capsule.js)

Usage
-----

###Browser:
Simply import Capsule.js via a ```<script/>``` tag before any code that uses its API.

```html
<script type="text/javascript" src='path/to/Capsule.js'></script>
<script type="text/javascript" src='path/to/MyApp.js'></script>
```

###Node:
Make sure to require Capsule.js before the first use of its API. You only need to require it once and you dont need to catch
it as a variable.

```javascript
require('./path/to/Capsule.js'); 
```

API
---

* [namespace](http://inspiravetion.github.io/Capsule.js#namespacenamespacestr)
* extends
* super
* implements
* overload
* reactive
* arm
* disarm
* clone
* consume
* projectOnto
* hasProperty

###namespace(nameSpaceStr)
Verifies that the given namespace exists in the global scope and if it doesn't, creates it. Allows you to logically
organize the code in an app as well as avoid naming collisions.

```javascript
  //FILE 1
  namespace('Monsters.Base');
  
  Monsters.Base.Monster = function(){
    this.evil = true; 
  }

  //FILE 2
  namespace('Monsters.Interfaces');
  
  Monsters.Interfaces.TheUndead = {
    attack : 'function'
  }

  // FILE 3
  namespace('Monsters.TheUndead');

  Monsters.TheUndead.Vampire = function(){
    this.super();
  }.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

  Monsters.TheUndead.Vampire.prototype.attack = function(){
    if(this.evil){
      console.log('Chomp');
    }
  }
  
  //FILE 4
  namespace('Monsters.TheUndead');

  Monsters.TheUndead.Zombie = function(){
    this.super();
  }.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

  Monsters.TheUndead.Zombie.prototype.attack = function(){
    if(this.evil){
      console.log('Slurp');
    }
  }
  
  //FILE 5
  var vamp = new Monsters.TheUndead.Vampire(),
  zombie = new Monsters.TheUndead.Zombie();
  
  vamp.attack(); // Chomp
  zombie.attack(); // Slurp
  
  //*** FILES 1 & 2 MUST BE LOADED BEFORE FILES 3 & 4 WHICH MUST BE LOADED BEFORE FILE 5 ***
  
```
* Parameters :
  * ```nameSpaceStr``` : A string delimiting nested packages with a '.' 
* Caveats :
  * Provides no dependency resolution.

###extends(superClass)
Extends a class to have all the functionality of ```superClass```.

```javascript
  var Vampire = function(){
    this.super();  
  }.extends(Monster);
  
  var dracula = new Vampire();
  dracula instanceof Monster // true
```
* Parameters :
 * ```superClass``` : The constructor function of the SuperClass
* Caveats : 
  * Each class may only extend a single SuperClass
  * ```this.super()``` must be called in the Subclass constructor for extension to function properly

###super(funcName, argArray)
Can be used in two different ways. If ```funcName``` is not present, the super gets called with the callers context ('this') and ```argArray``` as its parameters.
If ```funcName``` is present, then the the SuperClass's function given by ```funcName``` is called with the ```argArray``` as its parameters and the callers 'this' as it's context.

```javascript
  var Monster = function(diet, homeland){
    this.diet = diet;
    this.homeland = homeland;
    this.intimidate = function(intim){ //can only be overwritten in SubClass's Constructor
    	console.log(intim);
    };
  }
  
  Monster.prototype.hunt = function(beginning, end){
    console.log('I am going hunting from ' + beginning + ' to ' + end);
  }

  var Vampire = function(){
    this.super(['blood', 'transylvania']);  
    this.intimidate = function(){     // defined AFTER super() call
    	this.super('intimidate', ['You look tasty']);	
    };
  }.extends(Monster);
  
  Vampire.prototype.hunt = function(){
    this.super('hunt', ['dusk', 'dawn']);
    console.log("The sun doesn't agree with me");
  }
  
  var dracula = new Vampire();
  dracula.diet; //blood
  dracula.homeland; //transylvania
  dracula.hunt(); // prints 'I am going hunting from dusk to dawn' then "The sun doesn't agree with me"
  dracula.intimidate(); //prints 'You look tasty'
```
* Parameters :
 * ```funcName``` (optional): the String name of the SuperClass's function to be called
 * ```argArray``` (optional): the arguments to pass to either the SuperClass constructor or one of its functions
* Caveats : 
  * ```funcName``` may be a function on the prototype of the SuperClass or an instance method of the SuperClass BUT if it is an
instance method, than the functional super() may only be called by a SubClass's instance method AFTER the normal super() has
been called. 
  * Calling functional super from an instance method involves more overhead and is therefore less efficient than having
that function on the prototype.

###implements(interfaceObj)
Adds each property of the ```interfaceObj``` to an Objects prototype. If any of the properties that are not in the 'abstract' object
are referenced before they are explicitly defined or set to a value that != its current value (when used with typeof), 
then an error is thrown. This is to guarantee that you explicitely define these values to satisfy the interface. Any of the 
properties in the 'abstract' object of the interface just get added to the prototype and can be used accordingly. This can 
be chained for multiple interfaces ie. ```var myClass(){}.implements(a).implements(b);```.

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

  var Vampire = function(){}.implements(TheUndead);
  
  var dracula = new Vampire();
  dracula.die();//prints 'lol too late'
  
  dracula.sobStory();//these both throw 'Error: attempting to access unimplemented interface property infectionStory.'
  dracula.infectionStory;//because infectionStory has not been properly set yet
```
* Parameters :
 * ```interfaceObj``` : An Object literal that defines what properties should be enforced along with their acceptable values. An 
optional 'abstract' portion defines properties to be directly added to the prototype. Acceptable interface property values 
include ```'undefined'```, ```'object'```, ```'boolean'```, ```'number'```, ```'string'```, or ```'function'```.
* Caveats : 
  * Throws errors at runtime if a property is accessed that hasnt been implemented. This is the point however. 
  * ```this``` must be used to access a property of ```interfaceObject``` from within a function that is defined in the 'abstract' portion.

###overload(funcStr, implFunc, argTypeArr)
Overloads a function on the callers prototype so that different implementations can be resolved at runtime based on the args passed in.

```javascript
  var Hero = function(){};

  var Monster = function(){};

  Monster.prototype.growl = function(){ console.log('grrr') };

  Monster.overload('attack', function(){
      console.log('i take no params');
  });

  Monster.overload('attack', function(a){
      console.log('I take a string');
  }, [String]);

  Monster.overload('attack', function(munster){
      munster.growl();
  }, [Monster]);

  Monster.overload('attack', function(a){
      console.log('I take a number');
  }, [Number]);

  Monster.overload('attack', function(a){
      console.log('I take a number, a string, and a Hero');
  }, [Number, String, Hero]);

  var Vampire = function(){
    this.super();
  }.extends(Monster);

  var NewBornVampire = function(){
    this.super();
  }.extends(Vampire);

  var m = new Monster();
  m.attack(); // i take no params
  m.attack('dfgsdf'); // I take a string

  var vamp = new Vampire();
  vamp.attack(1); // I take a number
  vamp.attack(vamp); // grrr

  var newvamp = new NewBornVampire();
  newvamp.attack(2, 'sf', new Hero()); // I take a number, a string, and a Hero
  newvamp.attack(2, null, new Hero()); // I take a number, a string, and a Hero
  newvamp.attack(null); // I take a number
  newvamp.attack({}); // throws 'attack called with the wrong type of parameters.'
```
* Parameters :
  * ```funcStr``` : The string name of the function to overload.
  * ```implFunc``` : The desired implementation to be called at runtime.
  * ```argTypeArr``` : An Array of Class constructor functions that define what type of 
arguments ```implFunc``` takes. Arguments passed into ```implFunc``` will be tested against 
the contents of ```argTypeArr``` using ```instanceof```. If ```Object``` is contained in ```argTypeArr```,
anything can be passed in for that parameter. ```null``` can also be passed in for any parameter.
* Caveats :
  * All versions of the overloaded function must be added using ```overload()```. Otherwise, the first implementation
that doesn't will act as the default implementation. Additionally, any implementation defined before it will never be called.
  * When passing in null, be aware that it masks the parameter type it is representing. Thus, the last function implementation
whos signature matches the parameters being passed in (null acting as a 'wildcard'), will be the function that is called.
  * Cannot be used within a class constructor ie. ```this.overload('somefunc', function(){}, [myObj])```.

###reactive(propStr, value, oldSingleton, newSingleton)
Creates a reactive property on the caller initialized to ```value```. The property will then emit an event any time it is changed.
if ```oldSingleton``` / ```newSingleton``` is true, all of the callbacks will recieve the same copy of the old value / new value. If it is false, they will all recieve their own copy.

```javascript
  var Reactor = function(singleton){
    this.reactive('bomb', 'unstable');
    this.reactive('dud', {
      changMe : 1
    }, false, singleton);
  }

  var kaboom = function(value){
    console.log('KABOOOOM');
  };

  var fizz = function(){
    console.log('Fizzz');
  };

  var fiz = function(oldValue, newValue){
    oldValue.fizzle = 'fiz';
    newValue.fizzle = 'fiz';
  }

  var zle = function(oldValue, newValue){
    newValue.fizzle += 'zle';
    console.log(oldValue);
    console.log(newValue);
  }

  var reactor = new Reactor(),
  sharedReactor = new Reactor(true);

  reactor.arm('bomb', kaboom);
  reactor.arm('dud', fizz);
  sharedReactor.arm('dud', fiz);
  sharedReactor.arm('dud', zle);

  reactor.bomb; //'unstable'
  reactor.bomb = 'about to explode...'; // causes callback to be called...prints 'KABOOOOM'

  reactor.dud; // { changeMe : 1 }
  reactor.dud.changeMe = 2; // nothing happens
  reactor.dud = {}; // causes callback to be called...prints 'Fizzz'

  sharedReactor.dud = {}; // causes fiz() and zle() to be called passing them a singleton
                          // prints { changeMe : 1 } then { fizzle : 'fizzle' }
```
* Parameters : 
  * ```propStr``` : The name of the property being added
  * ```value``` : The value of the property being added
  * ```oldSingleton``` : A boolean signifying if all callbacks should get the same copy of the old value of the reactive property.Defaults to false (each gets its own copy).
  * ```newSingleton``` : A boolean signifying if all callbacks should get the same copy of the new value that the reactive property
is changed to or if they should all get their own copies. Defaults to false (each gets its own copy).
* Caveats : Only emits event when actual property is changed (changing ```reactiveObject.property``` will not emit events to listeners listening
on ```reactiveObject```)
* If ```oldSingleton``` or ```newSingleton``` are false it causes extra overhead to give fresh copies to registered callbacks

###arm(propStr, callback, context)
Allows you to provide a handler for the event emitted when a reactive property is changed.
```javascript
  var Reactor = function(){
    this.reactive('bomb', 'unstable');
  }
  
  var reactor = new Reactor();
  
  reactor.arm('bomb', function(value){
    console.log(this);
    console.log(value);
  });
  
  reactor.bomb; //'unstable'
  reactor.bomb = 'about to explode...'; // prints { bomb : 'about to explode...' } then 'about to explode...'
```
* Parameters :
  * ```propStr``` : The string name of the target reactive property
  * ```callback``` : A function to be called when the event is emitted. Gets passed the new value of the reactive property.
  * ```context``` (optional): a context to be used for ```this``` when the event is called. Defaults to the object calling ```arm()```
* Caveats : 
  * The callback should not change the ```propStr``` as this would cause an infinite loop

###disarm(propStr, callback, optContext)
Removes either a specified handler, or all handlers from a reavtive property

```javascript
  var Reactor = function(){
	this.reactive('bomb', 'armed');
  };
  
  var spark = function(){
  	console.log('spark');
  };
  
  var r = new Reactor();
  
  r.arm('bomb', spark);
  r.arm('bomb', function(){
  	console.log('fizzle');
  });
  r.arm('bomb', function(){
  	console.log('boom');
  });
  
  r.bomb = 'exploding'; // causes callbacks to call 'spark' then 'fizzle' then 'boom'
  r.disarm('bomb', spark);
  
  r.bomb = 'no spark'; //causes callbacks to call 'fizzle then 'boom'
  r.disarm('bomb');
  
  r.bomb = 'add more handlers to re-arm me!' // nothing happens
  
```
* Parameters :
  * ```propStr``` : The string name of the target reactive property
  * ```callback``` : The handler that should be removed. If ommitted, will delete all handlers for the given ```propStr```
  * ```optContext``` (optional): The context of the specific handler that should be removed
* Caveats : 
  * To be able to remove a specific handler, the callback passed to ```arm()``` and ```disarm()``` must not be anonymous  

###clone()
Returns a deep copy of the calling object. Can be used on built in or user defined data types.

```javascript
  var Monster = function(){
    this.name = 'munster';
    this.diet = {
      breakfast : 'brains',
      lunch     : 'blood',
      dinner    : 'chicken'
    }
  }
  
  Monster.prototype.yell = function(){
    console.log(this.name.toUpperCase());
  }
  
  var Vampire = function(){
    this.super();
  }.extends(Monster);
  
  var dracula = new Vampire(),
  copy = dracula.clone();
  
  copy.yell() // 'MUNSTER'
  copy.name = "this shouldn't change dracula's name";
  copy.diet.breakfast = 'bacon';
  
  dracula.yell() // 'MUNSTER'
  dracula.diet.breakfast; // 'brains'
  
  var original = [1, 2, 3],
  copy = original.clone();
  
  copy.push(4); // [1, 2, 3, 4]
  original; // [1, 2, 3]
```
* Parameters : N/A
* Caveats :
  * Not inteaded for use with DOM nodes  

###consume(other, mutator, global)
Consumes all the properties in ```other``` that already exist in 'this'. Allows you to set default values in your code and have them
overridden by an init Object without having to explicitely check for their existence. 
```javascript
  var blade = {
    name : 'blade',
    attack : function(){
      console.log("Oh you're human?...nevermind you are free to go");
    }
  }
  
  var Monster = function(){};
  
  Monster.prototype.attack = function(){
    console.log('grrrrrr');
  }
  
  var Vampire = function(initObj){
    this.super();
    this.name = 'dracula';
    this.preferredMeal = 'blood';
    if(initObj){
      this.consume(initObj); 
    }
  }.extends(Monster);
  
  var a = new Vampire(blade); //ideal way to use consume (in constructor)
  a.name; // 'blade' 
  a.attack(); //prints 'grrrrrr'
  
  var b = new Vampire();
  b.consume(blade); //alternate use case (outside of constructor)
  b.name; // 'blade' 
  b.attack(); //prints 'grrrrrr'
  
  var c = new Vampire();
  c.consume(blade, true); 
  c.name // 'blade' 
  c.attack(); //now prints "Oh you're human?...nevermind you are free to go"
  
  var d = new Vampire();
  d.consume(blade, function(prop){
    if(typeof prop == 'function'){
      return function(){ 
        console.log('Mwuahaha I overwrote your function');
        prop();
      }
    }
    return 'The Vampire ' + prop;
  }, true); 
  d.name // 'The Vampire blade' 
  d.attack(); // now prints 'Mwuahaha I overwrote your function' and then 
              //"Oh you're human?...nevermind you are free to go" 
  
```
* Parameters :
  * ```other``` : The Object to be consumed
  * ```mutator``` (optional): A function that takes the value of other's properties and returns an altered value
  * ```global``` (optional): If true, properties on the prototype chain will be searched for and overridden, otherwise only properties that return true for ```this.hasOwnProperty()``` will be considered.
* Caveats : 
  * You may use ```consume()``` for functions BUT do not do this if you want to be able to call ```super('myFuncName')``` on the function from a subclass as it will not be on the prototype. If you want to override a function do it explicitly on the prototype and have it use values bound to 'this' that can be consumed to change the functionality at runtime
  * If you choose to use a mutator function you must deal with processing different types of data internally. There is no logic
in ```consume()``` to differentiate between a string or function or any other type of data.

###projectOnto(other, options)
Places all or a subset, depending on the options object, of an objects properties onto ```other```.

```javascript
  var Monster = function(){
    this.name = 'Munster';
    this.age  = '212';
  }
  
  Monster.prototype.eat = function(){
    console.log('nom nom nom');
  }
  
  var monster = new Monster(),
  cleanObject = {};
  
  monster.projectOnto(cleanObject); // cleanObject now has the properties 'name', 'age', and 'eat' defined
  
  monster.projectOnto(cleanObject, {
    filter : function(prop){
      if(!this.hasOwnProperty(prop)){
        return true;
      }
      return false;
    }.bind(cleanObject) //must be bound...otherwise 'this' refers to monster instead of cleanObject
  }); //will result in no change as cleanObject already has all the properties being tested for
  
  monster.projectOnto(cleanObject, {
    mutator : function(prop){
      if (typeof prop == 'function'){
        return prop;
      }
      return 'Changed value: ' + prop;
    }
  }); //now cleanObject.name == 'Changed value: Munster' and cleanObject.age = 'Changed value: 212'
  
```
* Parameters :
  * ```other``` : The other object to copy properties to
  * ```options``` (optional): An object containing up to two functions (```filter``` and ```mutator``). The filter function will be called with the value
of each property and should return true for all properties that should be projected onto ```other```. The mutator function will be
passed the value of all the properties that have passed the filter test, it should return the value to be set on ```other``` for the 
property being considered. If filter is ommitted all properties will be copied. If mutator is ommitted, values will not be changed
before they are set.
* Caveats : 
  * By default, this function does not place the properties onto the prototype of the given object. If you want to alter
a prototype then it must be passed in as ```other```.

###hasProperty(property)
Similar to ```hasOwnProperty()``` except that it searches the whole prototype chain. Basically just syntactic sugar for the ```in``` operator

```javascript
  var Monster = function(){
    this.name = 'Munster';
    this.age  = '212';
  }
  
  Monster.prototype.attack = function(){};
  
  var Vampire = function(){
    this.super();
  }.extends(Monster);
  
  var vamp = new Vampire();
  vamp.hasOwnProperty('name'); //true
  vamp.hasOwnProperty('attack'); //false
  vamp.hasProperty('name'); //true
  vamp.hasProperty('attack'); //true
```
* Parameters : 
  * ```property``` : The String property to test for. 
* Caveats :
  * This cannot detect properties that are non-enumerable.

###API Tips
* Every instance of a class should have the same functions. Prototypes dictate what properties classes have. Changing the
Prototype on the fly  ==  'Bad News Bears'. Put functions on the Prototype when you define the class.
* Instance variables of a class should override their inherited values. Variables can also go on the prototype, but they
should be defined AFTER ```this.super()``` is called in the constructor function or they could be overridden with the 
Superclass's values.

Extended Example
----------------------------------------
```javascript

//FILE 1========================================================================
namespace('Monsters.Base');

//Character Base Class-------------------------
Monsters.Base.Character = function(name, evil){
  this.cheesyLine = function(line){ 
    console.log(line);             
  };                                
  this.name = name;                 
  this.health = 100;                
  this.reactive('evil', evil);      
  this.greet();
}

Monsters.Base.Character.prototype.greet = function(){
  console.log(this.name + ' checking in...');
}

Monsters.Base.Character.overload('regenerate', function(health){
  this.health += health;
}, [Number]);

//Monster Base Class-------------------
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

//Hero Base Class-------------------
Monsters.Base.Hero = function(name){
  this.super([name, false]);
  this.cheesyLine = function(){
    this.super('cheesyLine', ['lose the zero...get with the hero']);
  };
}.extends(Monsters.Base.Character);

Monsters.Base.Hero.prototype.convert = function(){
  return new Monsters.Base.Monster(this.name);
}

//FILE 2=======================================================================
namespace('Monsters.Interfaces');

//TheUndead Interface------------
Monsters.Interfaces.TheUndead = {
  attack    : 'function',
  resurrect : 'function',
  abstract : {
    die : function(){
      console.log('Too late...');
    },
    schedule  : function(){ 
      console.log('I need to feed at least ' + this.hungerLvl + ' times a day');
    },
    hungerLvl : 2
  }
}

// FILE 3======================================================================
namespace('Monsters.TheUndead');

//Vampire Class-----------------------------
Monsters.TheUndead.Vampire = function(name){
  this.super([name]);
  this.strength = 20;
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

Monsters.TheUndead.Vampire.prototype.attack = function(character){
  this.super('attack', [character, 'Chomp', this.strength]);
}

Monsters.TheUndead.Vampire.overload('regenerate', function(){
  this.regenerate('The blood is kicking in...', 20);
});

//Vampire SubClass---------------------------------
Monsters.TheUndead.NewBornVampire = function(name){
  this.super([name]);
  this.strength = 40;
}.extends(Monsters.TheUndead.Vampire);

Monsters.TheUndead.NewBornVampire.prototype.schedule = function(){
  this.super('schedule');
  console.log('give or take 3 or 4 meals');
}

//Zombie Class----------------------------- 
Monsters.TheUndead.Zombie = function(name){
  this.super([name]);
}.extends(Monsters.Base.Monster).implements(Monsters.Interfaces.TheUndead);

Monsters.TheUndead.Zombie.prototype.attack = function(character){
  if(character instanceof Monsters.Base.Monster){
    console.log("I don't care that you are a monster...");
  }
  console.log('Slurp');
  character.health -= 10;
}

//FILE 4=======================================================================

var vamp = new Monsters.TheUndead.Vampire('dracula'); //dracula checking in...
zombie = new Monsters.TheUndead.Zombie('garth'); //garth checking in... 
newBorn = new Monsters.TheUndead.NewBornVampire('newby'); //newby checking in... 
human = new Monsters.Base.Hero('charlie'); //charlie checking in... 

vamp.attack(zombie); // I only eat heroes 
vamp.attack(human); // Chomp

zombie.attack(vamp); // I don't care that you are a monster... Slurp
zombie.attack(human); // Slurp

newBorn.attack(human); // Chomp
newBorn.attack(zombie); // I only eat heroes ***inherited from Vampire***


console.log('human: ' + human.health); // human: 30
console.log('vamp: ' + vamp.health); // vamp: 90
console.log('zombie: ' + zombie.health); // zombie: 100

vamp.regenerate(); // The blood is kicking in...
console.log('vamp: ' + vamp.health); // vamp: 110

zombie.regenerate(10);
console.log('zombie: ' + zombie.health); // zombie: 110

zombie.regenerate(); // throws 'regenerate called with the wrong type of parameters.'

zombie.arm('evil', function(oldVal, newVal){
  console.log('oldval:' + oldVal); // oldval: true
  console.log('newval:' + newVal); // newval: false
  if(newVal == false){
    zombie = zombie.convert();
  }
});

zombie.die(); // Too late...
newBorn.die(); // Too Late... ***inherits abstract method from Vampire implementing TheUndead***

zombie.evil = false; //garth checking in...

console.log(zombie instanceof Monsters.Base.Monster); //false
console.log(zombie instanceof Monsters.Base.Hero); //true
console.log(zombie instanceof Monsters.Base.Character); //true

console.log(zombie.evil); // false
console.log(zombie.health); // 100
vamp.attack(zombie); //Chomp
console.log(zombie.health); // 80

zombie.cheesyLine(); //lose the zero...get with the hero 
newBorn.schedule(); //prints 'I need to feed at least 2 times a day' then 'give or take 3 or 4 meals'
newBorn.resurrect(); // throws Error: attempting to access unimplemented interface property resurrect. 

```
License
--------
The MIT License (MIT)

Copyright (c) 2013 Charles R. Lipford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
