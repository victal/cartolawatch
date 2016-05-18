angular.module('CartolaWatcher').factory('CartolaService', ['$http', function ($http) {
    return {
        pontuados: null,
        mercadoAberto: false,
        times: {},
        atualizaPontuados: function () {
            var self = this;
            return $http({
                method: 'GET',
                url: 'http://localhost/api/atletas/pontuados'
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
        slugTime: function(nomeTime) {
            return nomeTime.toLowerCase().replace(/[ .]/, "-").replace(/[^a-z0-9-]/, "");
        },
        findTime: function(nomeTime) {
            var slugTime = this.slugTime(nomeTime);
            return $http({
                method: 'GET',
                url: 'http://localhost/api/time/' + slugTime
            }).then(function (response) {
                this.parciais[slugTime] = response.data;
                return slugTime;
            }.bind(this), function (response) {
                return response;
            });
        },
        parciais: function (slugTime) {
            var time, self = this;
            if (this.times[slugTime]) {
                time = this.times[slugTime];
                return this.__getParciais(time);
            }
            else {
                return $http({
                    method: 'GET',
                    url: 'http://localhost/api/time/' + slugTime
                }).then(function (response) {
                    time = response.data;
                    self.times[slugTime] = time;
                    return self.__getParciais(time);
                }, function (response) {
                    console.log(response);
                });
            }
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
            time.atletas.sort(function(a, b){
                if(a.posicao_id <= b.posicao_id){
                    return -1;
                }
                return 1;
            });
            time.atletas.forEach(function (atleta) {
                var id = atleta.atleta_id.toString();
                var pontuacao = '-';
                if (self.mercadoAberto) {
                    pontuacao = atleta.pontos_num;
                }
                else {
                    var parcial = self.pontuados[id];
                    if (parcial) {
                        pontuacao = parcial.pontuacao;
                    }
                }
                result.time.total += pontuacao;
                result.jogadores.push({
                    'nome': atleta.apelido,
                    'pontuacao': pontuacao.toString(),
                    'posicao': time.posicoes[atleta.posicao_id].abreviacao,
                    'time': time.clubes[atleta.clube_id.toString()].abreviacao
                });
            });
            return result;
        }
    }
}]);