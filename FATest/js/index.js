var testApp = angular.module('testApp', []);

testApp.controller('testController', ['$scope', '$timeout', function($scope, $timeout) {

	$scope.loaded = false;

	var db = new Firebase("bitcage.firebaseio.com/test/list");

	$scope.list = [];

	db.on("child_added", function(snapshot) {
		$timeout(function() {
			$scope.list.push(snapshot.val());
			$scope.loaded = true;
		}, 0);
	});


	$scope.submit = function() {
		db.push({
			value: $scope.inputValue
		});
	}

}])