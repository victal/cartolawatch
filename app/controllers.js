angular.module('CartolaWatcher').controller('CartolaController', ['$scope', '$interval', '$q', 'CartolaService',
    function ($scope, $interval, $q, CartolaService) {
        var vm = this;
        vm.parciais = {
            'bvbzuera': {},
            'coveleski-fc': {},
            'sporten': {},
            'thebucketkickers': {}
        };
        vm.times = Object.keys(vm.parciais);

        vm.addTime = function (nomeTime) {
            $scope.new_time = "";
            var slug = CartolaService.slugTime(nomeTime);
            if (vm.times.indexOf(slug) === -1) {
                CartolaService.findTime(nomeTime).then(function (result) {
                    vm.times.push(result);
                    vm.updateParciais([result]);
                }, function (result) {
                    console.log('Time não encontrado!');
                });
            }
        };
        vm.removeTime = function (time) {
            vm.times.splice(vm.times.indexOf(time), 1);
            delete vm.parciais[time];
        };
        vm.updateParciais = function (times) {
            var promises = {};
            for (var i = 0; i < times.length; i++) {
                promises[times[i]] = CartolaService.parciais(times[i]);
            }
            $q.all(promises).then(function (parciais) {
                angular.extend(vm.parciais, parciais);
            });
        };
        vm.atualizaPontuados = function () {
            console.log(new Date());
            CartolaService.atualizaPontuados().then(function () {
                vm.updateParciais(Object.keys(vm.parciais));
                vm.mercadoAberto = CartolaService.mercadoAberto;
                vm.lastUpdate = Date.now();
                if (vm.mercadoAberto && !angular.isDefined($scope.updatePromise)) {
                    $scope.updatePromise = $interval(vm.atualizaPontuados, 1000 * 60 * 5);
                    $scope.$on('$destroy', function () {
                        if (angular.isDefined($scope.updatePromise)) {
                            $interval.cancel($scope.updatePromise);
                        }
                        delete $scope.updatePromise;
                    });
                }
            });
        };
        vm.atualizaPontuados();
    }
]);
