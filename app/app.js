angular.module('CartolaWatcher', [
    'ngMaterial'
]).config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('grey');
}]).constant('Constants', {
    API_BASE_URL: window.location.origin + window.location.pathname + 'api'
});


