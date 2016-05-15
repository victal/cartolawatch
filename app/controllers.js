angular.module('CartolaWatcher').controller('CartolaController', ['$scope', function($scope){
  var vm = this;
  times = [
    'BVBZuera',
    'The Bucketkickers', 
    'Sporten', 
    'Coveleski FC',
    'LG.FLU'
  ];

  times.forEach(function(time){
    CartolaService.timeParcial(time).then(function
  });
}]);
