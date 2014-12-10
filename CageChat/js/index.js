"use strict"

var testApp = angular.module('testApp', ['ngRoute', 'ngCookies']);

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

testApp.factory('dbService', ['$cookies', function($cookies) {
	var dbContext = new Firebase("bitcage.firebaseio.com");

	return {
		getDB: function() {
			return dbContext;
		},

		getCurrent: function() {
			return {
				uid: $cookies.uid,
				detail: {
					email: $cookies.email,
					nickName: $cookies.nickName
				}
			}
		},

		signIn: function(user) {
			$cookies.uid = user.uid;
			$cookies.email = user.detail.email;
			$cookies.nickName = user.detail.nickName;
		},

		signOut: function() {
			$cookies.uid = '';
			$cookies.email = '';
			$cookies.nickName = '';
			dbContext.unauth();
		},

		addUser: function(uid, email) {
			this.signIn({
				uid: uid,
				detail: {
					email: email,
					nickName: ''
				}
			})
			var current = this.getCurrent();
			dbContext.child('users/' + current.uid)
				.set(current.detail);
		},

		rename: function(name) {
			var current = this.getCurrent();
			current.detail.nickName = name;
			dbContext.child('users/' + current.uid).set(current.detail);
			this.signIn(current);
		},

		changepassowrd: function(oldpassword, newpassowrd, callback) {
			dbContext.changePassword({
				email: $cookies.email,
				oldPassword: oldpassword,
				newPassword: newpassowrd
			}, function(error) {
				if (error) {
					switch (error.code) {
						case "INVALID_PASSWORD":
							alert("The specified user account password is incorrect.");
							break;
						case "INVALID_USER":
							alert("The specified user account does not exist.");
							break;
						default:
							alert("Error creating user:", error);
					}
				} else {
					alert("User password changed successfully!");
					if (callback) callback();
				}
			});
		}
	}
}]);

testApp.controller('loginController', ['$scope', '$location', 'dbService', '$timeout',
		function($scope, $location, dbService, $timeout) {

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
					console.log(authData)
					if (error) {
						alert("Login Failed!", error);
					} else {
						if ($scope.isRegister) {
							dbService.addUser(authData.uid, authData.password.email)
							$scope.$apply(function() {
								$location.path('/detail');
							});
						} else {
							usersRef.child(authData.uid).on('value', function(shot) {

								$timeout(function() {
									dbService.signIn({
										uid: authData.uid,
										detail: shot.val()
									})
									$location.path('/chat');
								}, 0)
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
	.controller('detailController', ['$scope', '$location', 'dbService',
		function($scope, $location, dbService) {
			var db = dbService.getDB(),
				userRef = db.child('users'),
				current = dbService.getCurrent();

			if (!db.getAuth()) {
				$location.path('/')
			}

			$scope.submit = function() {
				dbService.rename($scope.nickName)
				$location.path('/chat');
			}

			$scope.changepassowrd = function() {
				dbService.changepassowrd($scope.oldpassword, $scope.newpassword,
					function() {
						$scope.$apply(function() {
							$location.path('/')
						})
					});
			}
		}
	])
	.controller('chatController', ['$scope', '$location', 'dbService', '$timeout', '$anchorScroll',

		function($scope, $location, dbService, $timeout, $anchorScroll) {

			var db = dbService.getDB(),
				userRef = db.child('users'),
				messageRef = db.child('message'),
				current = dbService.getCurrent(),
				oldhash;

			$scope.nickName = current.detail.nickName;

			if (!db.getAuth()) {
				$location.path('/')
			}

			userRef.on('value', function(shot) {
				$scope.userlist = [];
				var list = shot.val();
				angular.forEach(list, function(value, key) {
					if (key == current.uid) return;
					$timeout(function() {
						$scope.userlist.push(value.nickName);
					}, 0)
				});

			})

			messageRef.on('value', function(shot) {
				$timeout(function() {
					$scope.messagelist = shot.val()
				}, 0)
			})

			$scope.signOut = function() {
				dbService.signOut();
				$location.path('/')
			}

			$scope.sendMessage = function($event) {
				if ($event) $event.preventDefault()
				if (!$scope.content) return;
				messageRef.push({
					talkto: '',
					content: $scope.content,
					from: current.detail.nickName,
					time: Date.parse(new Date()),
					readed: true
				})
				$scope.content = '';
				oldhash = $location.hash();
				$location.hash('bottom');
				$anchorScroll();
				$location.hash(oldhash);
			}
		}
	])