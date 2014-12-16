var app = angular.module('starter.services', []);

/**
 * A simple example service that returns some data.
 */
app.factory("Answer", function($localstorage) {
  
});

app.factory("Letters", function() {
  var Letters = {};

  Letters.aToI = function() {
    return ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  }
  
  Letters.jToR = function() {
    return ["J", "K", "L", "M", "N", "O", "P", "Q", "R"];
  }

  Letters.sToZ = function() {
    return ["S", "T", "U", "V", "W", "X", "Y", "Z", ""];
  }

  return Letters
});

app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])