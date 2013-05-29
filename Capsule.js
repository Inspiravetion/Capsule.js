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
      mutator : mutate
    });
  },
  enumerable: false
});

Object.defineProperty( Object.prototype, 'projectOnto', {
  value: function(to, opt){
    var newProp, filter, mutate;
    opt = opt || {};
    filter = opt.filter || (function(){ return true });
    mutate = opt.mutator || (function(d){ 
      if(typeof d == 'object'){
        return d.clone();
      }
      return d 
    });
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
            if( typeof value != nterface[this.p] ){
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

Object.defineProperty( Object.prototype, 'namespace', { 
  value: function(packageStr){
    var packages, scope, packge;
    packages = packageStr.split('.');
    scope = this;
    for(var i = 0; i < packages.length; i++){
      packge = packages[i];
      scope[packge] = scope[packge] || {};
      scope = scope[packge]; 
    }
  },
  enumerable: false
}); //doesnt ensure any type of dependency resolution

Object.defineProperty( Object.prototype, 'clone', { 
  value: function(){
    var copy = {};
    for(prop in this){
      if(this[prop] instanceof Array){
        copy[prop] = [].slice.call(this[prop]);
      }
      else if(this[prop] instanceof RegExp){
        copy[prop] = new RegExp(this[prop]);
      }
      else if(this[prop] instanceof Date){
        copy[prop] = new Date(this[prop].getTime());
      }
      else if(this[prop] && typeof this[prop] == 'object'){
        copy[prop] = this[prop].clone();
      }
      else{
        copy[prop] = this[prop];
      }
    }
    return copy;
  },
  enumerable: false
});
