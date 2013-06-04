
  //FILE 2
  namespace('Monsters.Interfaces');

  Monsters.Interfaces.TheUndead = {
    attack : 'function',
    abstract : {
    	die : function(){
    		console.log('Too late...');
    	}
    }
  }
