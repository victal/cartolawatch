angular.module('CartolaWatcher').directive('amTimeUntil', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var activeTimeout = null,
                modelName = attrs.amTimeUntil,
                futureMoment;

            function cancelTimer() {
                if(activeTimeout !== null){
                    $timeout.cancel(activeTimeout);
                    activeTimeout = null;
                }
            }

            $scope.$watch(modelName, function (value) {
                if (angular.isUndefined(value) || value === null || (value === '')) {
                    cancelTimer();
                    if (futureMoment) {
                        element.text('');
                        futureMoment = null;
                    }
                    return;
                }
                futureMoment = value;
                updateContent();
            });
            function updateContent() {
                var now = moment(Date.now()),
                    difference = "";
                if(now.isBefore(futureMoment)){
                    difference = now.to(futureMoment);
                }
                else {
                    difference = now.to(moment(Date.now()));
                }
                var howOld = Math.abs(now.diff(futureMoment, 'minute'));
                var secondsUntilUpdate = 3600;
                if (howOld < 1) {
                    secondsUntilUpdate = 1;
                } else if (howOld < 60) {
                    secondsUntilUpdate = 30;
                } else if (howOld < 180) {
                    secondsUntilUpdate = 300;
                }
                element.text(difference);
                activeTimeout = $timeout(updateContent, 1000*secondsUntilUpdate);
            }
        }
    };
}]);