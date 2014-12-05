"use strict"

var testApp = angular.module('testApp', ['ngRoute']);

testApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'loginController',
			templateUrl: 'views/login.html'
		})
		.when('/chat', {
			controller: 'chatController',
			templateUrl: 'views/chat.html'
		})
		.when('/detail', {
			controller: 'detailController',
			templateUrl: 'views/detail.html'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

testApp.service('dbService', function() {
	var dbContext = new Firebase("bitcage.firebaseio.com");
	var current = {
		uid: '',
		detail: {
			email: '',
			nickName: ''
		}
	}

	this.getDB = function() {
		return dbContext;
	}

	this.getCurrent = function() {
		return current;
	}

	this.signIn = function(user) {
		current = user;
	}

	this.addUser = function(uid, name) {
		this.signIn({
			uid: uid,
			detail: {
				email: email,
				nickName: ''
			}
		})
		db.child('users/' + current.uid).set(current.detail);
	}
});

testApp.controller('loginController', ['$scope', '$location', 'dbService',
		function($scope, $location, dbService) {

			var db = dbService.getDB(),
				usersRef = db.child('users'),
				userRef;

			if (db.getAuth()) {
				$location.path('/chat')
			}

			var passwordNotSame = function(p1, p2) {
				$scope.hasError = p1 != p2;
				return p1 != p2;
			}

			var login = function(email, password) {
				db.authWithPassword({
					"email": email,
					"password": password
				}, function(error, authData) {
					if (error) {
						alert("Login Failed!", error);
					} else {
						if ($scope.isRegister) {
							//dbService.addUser(authData.uid, authData.password.email)
							$scope.$apply(function() {
								$location.path('/detail');
							});
						} else {
							$scope.$apply(function() {
								$location.path('/chat');
							});
						}
					}
				});
			}

			$scope.signIn = function() {
				if ($scope.isRegister) {
					if (passwordNotSame($scope.password, $scope.confirm)) return;

					db.createUser({
						email: $scope.email,
						password: $scope.password
					}, function(error) {
						if (error) {
							switch (error.code) {
								case "EMAIL_TAKEN":
									alert("The email is already in use.");
									break;
								case "INVALID_EMAIL":
									alert("The specified email is not a valid email.");
									break;
								default:
									console.log("Error creating user:", error);
							}
						} else {
							login($scope.email, $scope.password);
						}
					});
				} else {
					login($scope.email, $scope.password);
				}
			}

		}
	])
	.controller('chatController', ['$scope', '$location', 'dbService',

		function($scope, $location, dbService) {

			var db = dbService.getDB();

			if (!db.getAuth()) {
				$location.path('/')
			}

			$scope.signOut = function() {
				db.unauth();
				$location.path('/')
			}
		}
	])
	.controller('detailController', ['$scope', '$location', 'dbService',
		function($scope, $location, dbService) {
			var db = dbService.getDB();

			if (!db.getAuth()) {
				$location.path('/')
			}
		}
	])