// run me to get the next URL

var left = function() {
  var dodgy = {
    payload: 42,
    shifty: function() {
      return this.payload << 20 >> 10;
    }
  };

  var calc = function(fn) {
    return fn();
  };

  return calc(dodgy.shifty);
};

var right = function() {
  var adderFuncs = [];

  for (var i = 0; i < 10; i++) {
    adderFuncs.push(function() {
      return i;
    });
  }

  return adderFuncs.map(function(fn) {
    return fn();
  }).reduce(function(i, total) {
    return total + i;
  });
};

var getNextUrl = function() {
  return left + '/' + right();
};

console.log('the next URL is: /' + getNextUrl());