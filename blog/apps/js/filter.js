"use strict"

angular.module('cageblog')

.filter('unsafe', ['$sce', function($sce) {
	return function(val) {
		if (val == undefined) return "";
		return $sce.trustAsHtml(val);
	};
}])

.filter('summary', [function() {
	var getSummary = function(text) {
		var start_ptn = /(<[^>]+>)*/gmi,
			end_ptn = /<\/?\w+>$/,
			space_ptn = /(&nbsp;)*/;
		return text.replace(start_ptn, "").replace(end_ptn).replace(space_ptn, "");
	}
	return function(val) {
		if (val == undefined) return "";

		return getSummary(val);
	};
}]);