"use strict"

angular.module('cageblog')

.controller('AccountCtrl', [
    '$scope',
    'account',
    '$location',
    function($scope, account, $location) {

        $scope.login = function() {
            account.signIn($scope.email, $scope.password, function() {
                $location.path('manage');
            })
        }

    }
])

.controller('ArticleCtrl', [
    '$scope',
    'article',
    'account',
    '$routeParams',
    function($scope, article, account, $routeParams) {

        var list = article.get(),
            id = $routeParams.id;

        $scope.articles = list;
        $scope.auth = account.authorized();

        if (id) {
            list.$loaded().then(function() {
                $scope.article = list.$getRecord(id);
            });
        }
    }
])

.controller('ManageCtrl', [
    '$scope',
    'article',
    'account',
    '$routeParams',
    function($scope, article, account, $routeParams) {

        var list = article.get(),
            id = $routeParams.id;

        $scope.article = {};
        $scope.articles = list;

        $scope._simpleConfig = {
            autoClearinitialContent: false,
            wordCount: true,
            elementPathEnabled: false
        }

        if (id) {
            list.$loaded().then(function() {
                $scope.article = list.$getRecord(id);
            });
        }

        $scope.add = function() {
            if ($scope.article.$id) {
                article.save($scope.article, function() {
                    $scope.article = undefined;
                });
            } else {
                article.add({
                    title: $scope.article.title,
                    author: 'Johnny Cage',
                    category: $scope.article.category,
                    description: $scope.article.description,
                    time: new Date().getTime(),
                    pinned: $scope.article.pinned == true
                }, function() {
                    $scope.article = undefined;
                });
            }
        }

        $scope.edit = function(target) {
            $scope.article = target;
        }

        $scope.remove = function(target) {
            article.remove(target)
        }

    }
])