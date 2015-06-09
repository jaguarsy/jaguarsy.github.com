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
	'$routeParams',
	function($scope, article, $routeParams) {

		var list = article.get(),
			id = $routeParams.id;

		$scope.articles = list;
		console.log( id)
		if(id){
			$scope.article = list[0];
		}
	}
])

.controller('ManageCtrl', [
	'$scope',
	'article',
	'account',
	function($scope, article, account) {

		$scope.article = {};
		$scope.articles = article.get();

		$scope._simpleConfig = {
			autoClearinitialContent: false,
			wordCount: true,
			elementPathEnabled: false
		}

		$scope.add = function() {
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

		$scope.edit = function(target) {
			$scope.article = target;
		}

		$scope.remove = function(target) {
			article.remove(target)
		}

	}
])