angular.module('rpnow', [
    'LocalStorageModule', 'luegg.directives', 'mp.colorPicker', 'ngMaterial', 'ui.router', 'ngMeta'
])

.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}])

.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '50'
        })
        .accentPalette('deep-purple');
    $mdThemingProvider.theme('dark')
        .primaryPalette('grey', {
            'default': '800'
        })
        .accentPalette('amber')
        .dark();
    $mdThemingProvider.alwaysWatchTheme(true);
}])

.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('rpnow')
        .setDefaultToCookie(false)
}])

.run(['ngMeta', function(ngMeta) {
    ngMeta.init();
}])

// give the view a reference to the ui-state.
// https://github.com/angular-ui/ui-router/issues/561
.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$uiState = $state;
}])

.run(['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
    localStorageService.bind($rootScope, 'nightMode', true);
}])

// detect if the user is primarily using touch or a mouse,
//  guessing according to which the window notices first
//  used to decide whether to show tooltips or not
.run(['$rootScope', function($rootScope) {
    $rootScope.hasMouse = undefined;
    window.addEventListener('touchstart', detectEvent);
    window.addEventListener('mousemove', detectEvent);
    function detectEvent(evt) {
        window.removeEventListener('touchstart', detectEvent);
        window.removeEventListener('mousemove', detectEvent);
        $rootScope.hasMouse = (evt.type === 'mousemove');
    }
}])

.run(['$rootScope', '$mdMedia', function($rootScope, $mdMedia) {
    $rootScope.$watch(function() { return $mdMedia('gt-sm'); }, function(desktop) {
        $rootScope.isDesktopMode = desktop;
    });
}])