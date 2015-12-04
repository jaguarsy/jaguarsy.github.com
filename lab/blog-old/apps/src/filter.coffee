angular.module 'cageblog'

.filter 'unsafe', ['$sce', ($sce) ->

	(val) ->
		return "" if val is undefined
		$sce.trustAsHtml(val);

] 

.filter 'summary', [->
	getSummary = (text) ->
		start_ptn = /(<[^>]+>)*/gmi
		end_ptn = /<\/?\w+>$/
		space_ptn = /(&nbsp;)*/

		text.replace start_ptn, "" 
			.replace end_ptn 
			.replace space_ptn, ""

	(val) ->
		return "" if val is undefined;

		getSummary val
]