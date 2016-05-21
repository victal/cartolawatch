angular.module('CartolaWatcher').controller('CartolaController', ['$scope', '$interval', '$q', '$mdDialog', 'CartolaService',
    function ($scope, $interval, $q, $mdDialog, CartolaService) {
        var vm = this;
        vm.parciais = {
            'bvbzuera': {},
            'coveleski-fc': {},
            'sporten': {},
            'thebucketkickers': {}
        };
        vm.times = Object.keys(vm.parciais);
        vm.maxTimes = function () {
            var widths = {
                '980': 2,
                '1280': 4,
                '1920': 6
            };
            var maxTimes = 2;
            angular.forEach(widths, function(num, width){
               if(Modernizr.mq('(min-width: ' + width + 'px)')){
                   maxTimes = num;
               }
            });
            return maxTimes;
        };
        vm.addTime = function (nomeTime) {
            $scope.new_time = "";
            if (vm.times.length >= vm.maxTimes()) {
                var message = "O layout atual pode apresentar problemas com mais de  " + vm.maxTimes() +
                    "times simultâneos. Remova um ou mais times ou continue por sua conta e risco";
                showAlert("Atenção", message);
            }
            var slug = CartolaService.slugTime(nomeTime);
            if (vm.times.indexOf(slug) === -1) {
                CartolaService.findTime(nomeTime).then(function (result) {
                    vm.times.push(result);
                    vm.updateParciais([result]);
                }, function (result) {
                    showAlert("Erro", "Time não encontrado! É necessário passar o nome completo do time para adicioná-lo.")
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
            CartolaService.atualizaPontuados().then(function () {
                vm.updateParciais(Object.keys(vm.parciais));
                vm.mercadoAberto = CartolaService.mercadoAberto;
                $scope.nextUpdate = moment(Date.now()).add(5, 'minutes');
                if (!vm.mercadoAberto && !angular.isDefined($scope.updatePromise)) {
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

        function showAlert(title, message) {
            var alert = $mdDialog.alert({
                title: title,
                textContent: message,
                ok: 'OK'
            });
            $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }
    }
]);
