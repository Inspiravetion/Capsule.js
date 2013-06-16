!function(){var e=function(e,t){switch(t){case String:if("string"==typeof e)return!0
break
case Number:if("number"==typeof e)return!0
break
case Array:if(e instanceof Array)return!0
break
case RegExp:if(e instanceof RegExp)return!0
break
case Date:if(e instanceof Date)return!0
break
case Object:return!0}return!1}
Object.defineProperty(Object.prototype,"consume",{value:function(e,t,r){var n
"function"!=typeof t&&(r=r||t,t=null),n=r?Object.hasProperty.bind(this):Object.hasOwnProperty.bind(this),e.projectOnto(this,{filter:n,mutator:t})},enumerable:!1}),Object.defineProperty(Object.prototype,"projectOnto",{value:function(e,t){var r,n
t=t||{},r=t.filter||function(){return!0},n=t.mutator||function(e){return e.clone()}
for(p in this)r.call(this,p)&&(e[p]=n(this[p]))},enumerable:!1}),Object.defineProperty(Object.prototype,"hasProperty",{value:function(e){return e in this},enumerable:!1}),Object.defineProperty(Function.prototype,"extends",{value:function(e){return this.prototype=Object.create(e.prototype,{}),Object.defineProperty(this.prototype,"__super__",{value:e,enumerable:!1}),this},enumerable:!1}),Object.defineProperty(Object.prototype,"super",{value:function(e,t){var r=this.__proto__.__super__
if("string"!=typeof e){if(!(e instanceof Array||void 0===e))throw"Error: Arguments to super() must be passed in an array."
t=e,this.__protoCount__||Object.defineProperty(this,"__protoCount__",{value:0,writable:!0,enumerable:!1})
for(var n=0;n<this.__protoCount__;n++)r=r.prototype.__super__
return this.__protoCount__++,r&&r.apply(this,t),this.__protoCount__=0,void 0}if(r.prototype[e]==arguments.callee.caller&&(r=r.prototype.__super__),r&&r.prototype[e])r.prototype[e].apply(this,t)
else if(r){var o=new r
o[e]&&o[e].apply(this,t)}},enumerable:!1}),Object.defineProperty(Function.prototype,"implements",{value:function(e){for(property in e)if("abstract"==property)e[property].projectOnto(this.prototype)
else{var t={p:property}
Object.defineProperty(this.prototype,property,{get:function(){if(void 0===this.val)throw"Error: attempting to access unimplemented interface property "+this.p+"."
return this.val}.bind(t),set:function(t){if(typeof t!=e[this.p])throw"Error: attempting to set interface property "+this.p+" with incorrect type"
this.val=t}.bind(t)})}return this},enumerable:!1}),Object.defineProperty(Function.prototype,"overload",{value:function(t,r,n){var o=this.prototype[t]||null
this.prototype[t]=function(){for(var i=0,p=n?n.length:0;p>i;i++)if(p!=arguments.length||!(e(arguments[i],n[i])||arguments[i]instanceof n[i])&&arguments[i]){if(o)return o.apply(this,arguments)
throw r.name+" called with the wrong type of parameters."}if(!(n&&0!=n.length||0==arguments.length||o))throw t+" called with the wrong type of parameters."
r.apply(this,arguments)}},enumerable:!1}),Object.defineProperty(Object.prototype,"namespace",{value:function(e){var t,r,n
t=e.split("."),r=this
for(var o=0;o<t.length;o++)n=t[o],r[n]=r[n]||{},r=r[n]},enumerable:!1}),Object.defineProperty(Object.prototype,"clone",{value:function(){var e={}
if(this instanceof Number||this instanceof String||this instanceof Function||this instanceof Boolean)return this.valueOf()
if(this instanceof Array)return[].slice.call(this)
if(this instanceof RegExp)return RegExp(this)
if(this instanceof Date)return new Date(this.getTime())
for(prop in this)e[prop]=this[prop]?this[prop].clone():this[prop]
return e},enumerable:!1}),Object.defineProperty(Object.prototype,"reactive",{value:function(e,t,r,n){var o=this,i={val:t}
o.__reactiveListeners__[e]=o.__reactiveListeners__[e]||[],Object.defineProperty(o,e,{set:function(t){var i=o.__reactiveListeners__[e],p=this.val,a=t.clone()
this.val=t
for(var s=0;s<i.length;s++)i[s].handler.call(i[s].context,r?p:p.clone(),n?a:t.clone())}.bind(i),get:function(){return this.val}.bind(i),enumerable:!0})},enumerable:!1}),Object.defineProperty(Object.prototype,"arm",{value:function(e,t,r){r=r||this,this.__reactiveListeners__[e].push({context:r,handler:t})},enumerable:!1}),Object.defineProperty(Object.prototype,"disarm",{value:function(e,t,r){var n=this.__reactiveListeners__[e]
if(r=r||this,!t)return this.__reactiveListeners__[e]=[],void 0
for(var o=0;o<n.length;o++)if(n[o].context==r&&n[o].handler==t)return n.splice(o,1),void 0},enumerable:!1}),Object.defineProperty(Object.prototype,"__reactiveListeners__",{value:{},enumerable:!1})}()