
//FILE 2
namespace('Monsters.Interfaces');

Monsters.Interfaces.TheUndead = {
  attack : 'function',
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
