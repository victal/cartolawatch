angular.module('CartolaWatcher', [
    'ngMaterial'
]).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('grey');
});
