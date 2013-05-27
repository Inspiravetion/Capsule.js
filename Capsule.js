Object.defineProperty( Object.prototype, 'consume', {
  value: function(other, mutate, global){
    var propExists;
    if(typeof mutate != 'function'){
      global = global || mutate;
      mutate = null;
    }
    if(global){
      propExists = Object.hasProperty.bind(this);
    }
    else{
      propExists = Object.hasOwnProperty.bind(this);
    }
    other.projectOnto(this, {
      filter : propExists,
      mutate : mutate
    });
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'projectOnto', {
  value: function(to, opt){
    var newProp, filter, mutate;
    opt = opt || {};
    filter = opt.filter || (function(){ return true });
    mutate = opt.mutate || (function(d){ return d });
    for(p in this){
      if(filter.call(this, p)){
        to[p] = mutate(this[p]);  
      }
    }
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'hasProperty', {
  value: function(prop){
    return (prop in this);
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'extends', {
  value: function(superClass){
    this.prototype = new superClass();
    Object.defineProperty(this.prototype, '__super__', {
      value : superClass,
      enumerable : false
    });
    return this;
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'super', {
  value: function(funcName, args){
    var zuper = this.__proto__.__super__;
    if(arguments.length == 1){
      if(typeof funcName == 'object'){
        args = funcName;
        if(zuper){
          zuper.apply(this, args);
        }
        return;
      }
    }
    if(zuper.prototype[funcName]){
      zuper.prototype[funcName].apply(this, args);
    }
    else{
      if(zuper){
        var temp = new zuper();
        if(temp[funcName]){
          temp[funcName].apply(this, args);
        }
      }
    }
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'implements', { 
  value: function(nterface){
    for(property in nterface){
      if(property == 'abstract'){
        nterface[property].projectOnto(this.prototype);
      }
      else{
        var obj = { p : property };
        Object.defineProperty(this.prototype, property, { 
          get : function(){
            throw 'Error: attempting to access unimplemented interface property ' + this.p + '.';
          }.bind(obj),
          set : function(value){
            if( typeof value != nterface[property] ){
              throw 'Error: attempting to set interface property ' + this.p + ' with incorrect type';
            }
            return value;
          }.bind(obj)
        });
      }
    }
    return this;
  },
  enumerable: false
});

// //-----------------------------------------------------------------------------

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

// {}.Namespace('MyKillerGame.Villans');

var Monster = function(att, intim){
  this.attack = function(){ console.log(att) };
  //functions should never be added to 'this'
  //as it means they get added at runtime after the
  //subclass defines it on its prototype
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

// var a = function(){
//   this.a = 1;
//   this.b = 'wrong';
//   this.d = 2;
// }

// var b = function(){
//   this.b = 'right';
//   this.c = 4;
// }

// var ab = new a();
// var bc = new b();

// ab.consume(bc, function(d){
//   return 'mutated ' + d;
// });
// console.log(ab);

var v = new Vampire('chomp');
console.log(v);
console.log(v.__proto__);
v.intimidate();
v.attack();
v.regenerate();
// console.log(v);
// v.schedule();
// v.preferredMeal;
// v.complain();

// // Mummy.prototype.resurection = '';

// // var m = new Mummy();
// // m.absFunc1();
// // console.log(m.death_cause);
// // m.projectOn(Mummy, Vampire);

// // console.log(new Vampire('chomp...\n'));
// console.log(new Vampire('chomp...\n') instanceof Monster); 

// new Vampire('chomp...').attack();
// new Vampire('chomp...').intimidate();
// // console.log(new Monster('abc', 'def'));

// console.log(a = function(){}.prototype);

//snObject || Objection || Polymorph 
