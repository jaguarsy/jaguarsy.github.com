"use strict"

angular.module('cageblog', ['ngRoute', 'ngCookies', 'firebase', 'ng.ueditor'])

.run([
    '$rootScope',
    '$location',
    '$cookies',
    function($rootScope, $location, $cookies) {

        $rootScope.$on('$routeChangeStart', function(event, next) {
            var authorised;
            if (next.authorized && !$cookies.uid) {
                $location.path('login')
            }
        });

    }
])

.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'apps/views/articles.html',
            controller: 'ArticleCtrl'
        })
        .when('/login', {
            templateUrl: 'apps/views/login.html',
            controller: 'AccountCtrl'
        })
        .when('/article/:id', {
            templateUrl: 'apps/views/article.html',
            controller: 'ArticleCtrl'
        })
        .when('/manage', {
            templateUrl: 'apps/views/manage.html',
            controller: 'ManageCtrl',
            authorized: true
        })
        .when('/about', {
            templateUrl: 'apps/views/about.html',
        })
        .otherwise({
            redirectTo: '/'
        });

}])