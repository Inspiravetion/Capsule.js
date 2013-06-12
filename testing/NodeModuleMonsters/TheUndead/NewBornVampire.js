var Vampire = require('./TheUndead.js').Vampire;

//Vampire SubClass---------------------------------
NewBornVampire = function(name){
  this.super([name]);
  this.strength = 40;
}.extends(Vampire);

NewBornVampire.prototype.schedule = function(){
  this.super('schedule');
  console.log('give or take 3 or 4 meals');
}

module.exports = NewBornVampire;