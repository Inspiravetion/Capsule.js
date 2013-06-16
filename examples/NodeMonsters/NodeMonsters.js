require('../../Capsule.js');
require('./Base/Character.js');
require('./Base/Hero.js');
require('./Base/Monster.js');
require('./Interfaces/TheUndead.js');
require('./TheUndead/Vampire.js');
require('./TheUndead/Zombie.js');

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

// zombie.regenerate(); // throws 'regenerate called with the wrong type of parameters.'

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
