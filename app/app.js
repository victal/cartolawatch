angular.module('CartolaWatcher', [
    'ngMaterial',
    'CartolaWatcher.templates'
]).config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('grey');
}]).constant('Constants', {
    API_BASE_URL: window.location.origin + window.location.pathname + 'api'
});


