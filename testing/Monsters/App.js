
//FILE 5
var vamp = new Monsters.TheUndead.Vampire('dracula');
zombie = new Monsters.TheUndead.Zombie('garth');
human = new Monsters.Base.Hero('charlie');

vamp.attack(zombie); // Chomp
vamp.attack(human);

zombie.attack(vamp); // Slurp
zombie.attack(human);

console.log('human: ' + human.health);
console.log('vamp: ' + vamp.health);
console.log('zombie: ' + zombie.health);

zombie.arm('evil', function(value){
	if(value == false){
		zombie = zombie.convert();
	}
});

zombie.evil = false;

console.log(zombie.instanceOf(Monsters.Base.Monster)); //false
console.log(zombie.instanceOf(Monsters.Base.Hero)); //true
console.log(zombie.instanceOf(Monsters.Base.Character)); //true

console.log(zombie);
vamp.attack(zombie);
console.log(zombie);




