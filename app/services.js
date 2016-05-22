angular.module('CartolaWatcher').factory('CartolaService', ['$http', 'TimeService', 'Constants',
    function ($http, TimeService, Constants) {
        return {
            pontuados: null,
            mercadoAberto: false,
            times: {},
            atualizaPontuados: function () {
                var self = this;
                return $http({
                    method: 'GET',
                    url: Constants.API_BASE_URL + '/atletas/pontuados'
                }).then(function successCallback(response) {
                    self.pontuados = response.data;
                    return response.data;
                }, function errorCallback(response) {
                    console.log('ERROR');
                    console.log(response.data.mensagem);
                    self.mercadoAberto = true;
                    return response;
                });
            },
            parciais: function (slugTime) {
                return TimeService.getTime(slugTime).then(function (time) {
                    return this.__getParciais(time);
                }.bind(this));
            },
            __getParciais: function (time) {
                var self = this;
                var result = {
                    'time': {
                        'nome': time.time.nome,
                        'cartola': time.time.nome_cartola,
                        'escudo': time.time.url_escudo_png,
                        'patrimonio': time.patrimonio,
                        'total': 0
                    },
                    'jogadores': []
                };
                time.atletas.sort(function (a, b) {
                    if (a.posicao_id <= b.posicao_id) {
                        return -1;
                    }
                    return 1;
                });
                time.atletas.forEach(function (atleta) {
                    var id = atleta.atleta_id.toString();
                    var pontuacao = 0;
                    if (self.mercadoAberto) {
                        pontuacao = atleta.pontos_num;
                    }
                    else {
                        var parcial = self.pontuados.atletas[id];
                        if (parcial) {
                            pontuacao = parcial.pontuacao;
                        }
                    }
                    result.time.total += pontuacao;
                    var clube = 'SEM';
                    if(time.clubes[atleta.clube_id.toString()]){
                        clube = time.clubes[atleta.clube_id.toString()].abreviacao;
                    }
                    result.jogadores.push({
                        'nome': atleta.apelido,
                        'pontuacao': pontuacao.toString(),
                        'posicao': time.posicoes[atleta.posicao_id].abreviacao,
                        'time': clube
                    });
                });
                return result;
            }
        }
    }
]).factory('TimeService', ['$http', '$q', 'Constants', function ($http, $q, Constants) {
    return {
        times: {},
        search: function (nomeTime) {
            return $http({
                method: 'GET',
                url: Constants.API_BASE_URL + '/times?q=' + nomeTime
            }).then(function (response) {
                return response.data;
            });
        },
        getTime: function (slugTime) {
            if (this.times[slugTime]) {
                var deferred = $q.defer();
                deferred.resolve(this.times[slugTime]);
                return deferred.promise;
            }
            return $http({
                method: 'GET',
                url: Constants.API_BASE_URL + '/time/' + slugTime
            }).then(function (response) {
                this.times[slugTime] = response.data;
                return this.times[slugTime];
            }.bind(this));
        }
    };
}]).factory('DialogService', ['$mdDialog', function ($mdDialog) {
    return {
        showAlert: function (title, message, options) {
            var params = {
                title: title,
                textContent: message,
                ok: 'OK'
            };
            angular.extend(params, options)
            var alert = $mdDialog.alert(params);
            $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        },
        showDialog: function(options){
            return $mdDialog.show(options);
        }
    };
}]);