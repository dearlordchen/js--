Array.prototype.getUnique = function(){
  // add a comments
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
      alert('hoxfix is finished');
   }
   return a;
}
