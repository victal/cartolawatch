angular.module('CartolaWatcher').controller('CartolaController', ['$scope', '$q', 'CartolaService',
    function ($scope, $q, CartolaService) {
        var vm = this;
        var times = [
            'bvbzuera',
            'coveleski-fc'
        ];
        CartolaService.atualizaPontuados().then(function(response){
            console.log(response);
            vm.parciais = [];
            for (var i = 0; i < times.length; i++) {
                vm.parciais.push(CartolaService.parciais(times[i]));
            }
            $q.all(vm.parciais).then(function(parciais){
                $scope.parciais = parciais;
            });
        });
    }
]);
