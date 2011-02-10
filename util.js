coot = {};
coot.log = function (text) {
  var logp = text + '<br/>';
  $('#log').append(logp);
};
coot.create = function(o) {
  var F = function(){};
  F.prototype = o;
  return new F();
};
