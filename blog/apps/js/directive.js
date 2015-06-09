"use strict"

angular.module('cageblog')

.directive('cageCategory', [
	function() {

		var rand = function() {
			return Math.floor(Math.random() * 9);
		}

		function link(scope, element, attrs) {

			scope.$watch(attrs.cageCategory, function(value) {
				if (!value) return;
				var cates = value.split(',');

				for (var i = 0, len = cates.length; i < len; i++) {
					var a = angular.element('<a class="post-category" href="#"></a>');
					a.addClass('post-category-' + rand());
					a.text(cates[i]);
					element.append(a);
				}
			});
		}

		return {
			link: link
		};

	}
])