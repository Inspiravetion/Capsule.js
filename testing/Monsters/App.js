
//FILE 5
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


console.log('human: ' + human.health); // 30
console.log('vamp: ' + vamp.health); // 90
console.log('zombie: ' + zombie.health); //100

zombie.arm('evil', function(value){
	if(value == false){
		zombie = zombie.convert();
	}
});

zombie.die(); // Too late...
newBorn.die(); // Too Late... ***inherits abstract method from Vampire implementing TheUndead***

zombie.evil = false; //garth checking in...

console.log(zombie.instanceOf(Monsters.Base.Monster)); //false
console.log(zombie.instanceOf(Monsters.Base.Hero)); //true
console.log(zombie.instanceOf(Monsters.Base.Character)); //true

console.log(zombie.evil); // false
console.log(zombie.health); // 100
vamp.attack(zombie); //Chomp
console.log(zombie.health); // 80

newBorn.schedule(); //prints 'I need to feed at least 2 times a day' then 'give or take 3 or 4 meals'

