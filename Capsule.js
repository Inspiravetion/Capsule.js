/*
The MIT License (MIT)

Copyright (c) 2013 Charles R. Lipford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(){

//Helpers

var matchesBuiltIn = function(instance, clazz){
    switch(clazz){
        case String:
            if(typeof instance == 'string')
                return true;
            break;
        case Number:
            if(typeof instance == 'number')
                return true;
            break;
        case Array:
            if(instance instanceof Array)
                return true;
            break;
        case RegExp:
            if(instance instanceof RegExp)
                return true;   
            break;
        case Date:
            if(instance instanceof Date)
                return true;
            break;
        case Object:
            return true;
    }
    return false;
}

//API

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
    mutate = opt.mutator || (function(d){ return d.clone() });
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

Object.defineProperty( Function.prototype, 'extends', {
  value: function(superClass){
    this.prototype = Object.create(superClass.prototype, {});
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
    if(typeof funcName != 'string'){
      if(funcName instanceof Array || typeof funcName == 'undefined'){
        args = funcName;
      }
      else{
        throw 'Error: Arguments to super() must be passed in an array.'
      }
      if(!this.__protoCount__){
        Object.defineProperty(this, '__protoCount__', {
          value : 0,
          writable : true,
          enumerable : false
        });
      }
      for(var i = 0; i < this.__protoCount__; i++){
        zuper = zuper.prototype.__super__;
      }
      this.__protoCount__++;
      if(zuper){
        zuper.apply(this, args);
      }
      this.__protoCount__ = 0;
      return;
    }
    if (zuper.prototype[funcName] == arguments.callee.caller){
      zuper = zuper.prototype.__super__;
    }
    if(zuper && zuper.prototype[funcName]){      
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

Object.defineProperty( Function.prototype, 'implements', { 
  value: function(nterface){
    for(property in nterface){
      if(property == 'abstract'){
        nterface[property].projectOnto(this.prototype);
      }
      else{
        var obj = { p : property };
        Object.defineProperty(this.prototype, property, { 
          get : function(){
            if(typeof this.val == 'undefined'){
              throw 'Error: attempting to access unimplemented interface property ' + this.p + '.';
            }
            return this.val;
          }.bind(obj),
          set : function(value){
            if( typeof value != nterface[this.p] ){
              throw 'Error: attempting to set interface property ' + this.p + ' with incorrect type';
            }
            this.val = value;
          }.bind(obj)
        });
      }
    }
    return this;
  },
  enumerable: false
});

Object.defineProperty( Function.prototype , 'overload', {
  value : function(prop, fn, argTypes){
    var other = this.prototype[prop] || null;
      
    this.prototype[prop] = function(){
      for(var i = 0, l = argTypes ? argTypes.length : 0; i < l; i++){
        if(l != arguments.length ||
          (!(matchesBuiltIn(arguments[i], argTypes[i]) ||
          arguments[i] instanceof argTypes[i]) && 
          arguments[i])){
          if(other){
            return other.apply(this, arguments);
          }
          throw (fn.name + ' called with the wrong type of parameters.');
        }
      }
      if(((!argTypes) || (argTypes.length == 0)) && 
        (arguments.length != 0) && (!other)){
        throw (prop + ' called with the wrong type of parameters.');
      }
      fn.apply(this, arguments);
    }
  },
  enumerable : false
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
}); 

Object.defineProperty( Object.prototype, 'clone', {
  value: function(){
    var copy = {}, val;
    if(this instanceof Number || this instanceof String ||
      this instanceof Function || this instanceof Boolean){
      return this.valueOf();
    }
    if(this instanceof Array){
      return [].slice.call(this);
    }
    if(this instanceof RegExp){
      return new RegExp(this);
    }
    if(this instanceof Date){
      return new Date(this.getTime());
    }
    for(prop in this){
      if(this[prop]){
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

Object.defineProperty(Object.prototype, 'reactive', { 
  value : function(prop, initVal, oldCpy, newCpy){                    
    var self = this,
    secret = { val : initVal };
    self.__reactiveListeners__[prop] = self.__reactiveListeners__[prop] || [];
    Object.defineProperty(self, prop, {
      set : function(newVal){
        var events = self.__reactiveListeners__[prop],
        oldval = this.val,
        copy = newVal.clone();
        this.val = newVal;
        for(var i = 0; i < events.length; i++){
          events[i].handler.call(
            events[i].context,
            (oldCpy ? oldval : oldval.clone()),
            (newCpy ? copy : newVal.clone()) 
          );
        }
      }.bind(secret),
      get : function(){
        return this.val;
      }.bind(secret),
      enumerable : true
    });
  },
  enumerable : false
});

Object.defineProperty(Object.prototype, 'arm', {
  value : function(prop, listener, ctx){
    ctx = ctx || this;
    this.__reactiveListeners__[prop].push({
      context : ctx,
      handler : listener
    });
  },
  enumerable : false
});

Object.defineProperty(Object.prototype, 'disarm', {
  value : function(prop, listener, ctx){
    var handlers = this.__reactiveListeners__[prop]
    ctx = ctx || this;
    if(!listener){
        this.__reactiveListeners__[prop] = [];
        return;
    }
    for(var i = 0; i < handlers.length; i++){
      if(handlers[i].context == ctx && handlers[i].handler == listener){
        handlers.splice(i, 1);
        return;
      }
    }
  },
  enumerable : false
});

Object.defineProperty(Object.prototype, '__reactiveListeners__', {
  value : {},
  enumerable : false
});

})()