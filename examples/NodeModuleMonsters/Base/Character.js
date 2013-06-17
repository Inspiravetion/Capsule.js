
//Character Base Class
var Character = function(name, evil){
  this.cheesyLine = function(line){ //can only be overridden in Subclass if it is redefined in the
    console.log(line);              //Subclass construtor...functional super() call can only happen
  };                                //from an instance function defined in the Subclass Constructor
  this.name = name;                 //after the Subclass Constructor calls super()
  this.health = 100;                
  this.reactive('evil', evil);      
  this.greet();
}

Character.prototype.greet = function(){
  if(this.name){
    console.log(this.name + ' checking in...');
  }
}

Character.overload('regenerate', function(health){
  this.health += health;
}, [Number]);

module.exports = Character; //export class as module