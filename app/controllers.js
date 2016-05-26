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
            angular.forEach(widths, function (num, width) {
                if (Modernizr.mq('(min-width: ' + width + 'px)')) {
                    maxTimes = num;
                }
            });
            return maxTimes;
        };
        vm.addTime = function (time) {
            if (vm.times.length >= vm.maxTimes()) {
                var message = "O layout atual pode apresentar problemas com mais de  " + vm.maxTimes() +
                    " times simultâneos. Remova um ou mais times ou continue por sua conta e risco";
                /*showAlert("Atenção", message);*/
            }
            var slug = time.time.slug;
            if (vm.times.indexOf(slug) === -1) {
                vm.times.push(slug);
                vm.updateParciais([slug]);
            }
        };
        vm.removeTime = function (time) {
            vm.times.splice(vm.times.indexOf(time), 1);
            delete vm.parciais[time];
        };
        vm.updateParciais = function (times) {
            for (var i = 0; i < times.length; i++) {
                CartolaService.parciais(times[i]).then(function(parciais){
                    vm.parciais[parciais.time.slug] = parciais;
                });
            }
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

        
    }
]).controller('SearchController', ['$scope', 'DialogService', 'TimeService', function ($scope, DialogService, TimeService) {
    var vm = this;

    function showTimesDialog(times) {
        return DialogService.showDialog({
            templateUrl: "app/fragments/searchList.html",
            locals: {
                times: times
            },
            controller: ['$scope', '$mdDialog', 'times', function($scope, $mdDialog, times){
                $scope.times = times;
                $scope.answer = function(value){
                    $mdDialog.hide(value);
                }
            }]
        });
    }

    vm.search = function (nomeTime) {
        return TimeService.search(nomeTime).then(function (times) {
            if (times.length == 0) {
                DialogService.showAlert("Erro", "Nenhum time encontrado para o critério de busca!");
            }
            else {
                var slugTime;
                $scope.new_time = '';
                if (times.length == 1) {
                    slugTime = times[0].slug;
                    TimeService.getTime(slugTime).then(function(timeFull){
                        $scope.onChoose(timeFull);
                    });
                } else {
                    showTimesDialog(times).then(function(result){
                        slugTime = result;
                        TimeService.getTime(slugTime).then(function(timeFull){
                            $scope.onChoose(timeFull);
                        });
                    });
                }
            }
        });

    }
}]);
