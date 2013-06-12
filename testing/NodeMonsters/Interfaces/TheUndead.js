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