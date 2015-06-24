angular.module 'cageblog'

.directive 'cageCategory', [
	->
		rand = -> Math.floor Math.random() * 9

		link = (scope, element, attrs) ->

			scope.$watch attrs.cageCategory, (value) ->
				return if !value

				for cate in value.split ','
					a = angular.element '<a class="post-category" href="#"></a>'
					a.addClass 'post-category-' + rand()
					a.text cate
					element.append a
				return

			return

		link: link
]