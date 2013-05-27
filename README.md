Capsule.js
==========
```javascript
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
};```
