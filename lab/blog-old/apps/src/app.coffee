"use strict"

angular.module 'cageblog', ['ngRoute', 'ngCookies', 'firebase', 'ng.ueditor']

.run [
    '$rootScope',
    '$location',
    '$cookies',
    ($rootScope, $location, $cookies) ->

        $rootScope.$on '$routeChangeStart', (event, next) ->
            $location.path '#' if next.authorized and !$cookies.uid
            
]

.config ['$routeProvider', ($routeProvider) ->

    $routeProvider
        .when '/', 
            templateUrl: 'apps/views/articles.html',
            controller: 'ArticleCtrl'

        .when '/login', 
            templateUrl: 'apps/views/login.html',
            controller: 'AccountCtrl'
        
        .when '/article/:id', 
            templateUrl: 'apps/views/article.html',
            controller: 'ArticleCtrl'

        .when '/manage/:id', 
            templateUrl: 'apps/views/manage.html',
            controller: 'ManageCtrl',
            authorized: true

        .when '/manage', 
            templateUrl: 'apps/views/manage.html',
            controller: 'ManageCtrl',
            authorized: true

        .when '/about', 
            templateUrl: 'apps/views/about.html',

        .otherwise
            redirectTo: '/'

]