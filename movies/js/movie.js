var movies = new Firebase('https://409728463list.firebaseIO-demo.com/list');

(function(){
	var template = $("#template").html();
	var list = $("#list");
	var state = $("#state");
	var titles = new Firebase('https://409728463.firebaseIO-demo.com/titles');

	$("#search").click(function(){
		s();
	});

	$("#searchtext").keydown(function(e){
		if(e.keyCode==13){
			s();
		}
	});

	function s(){
		list.empty();
		state.text("正在搜索...如果是首次搜索会比较慢，请耐心等候- -");
		var keyword = $("#searchtext").val();
		var sum = 0;
		titles.limit(20000).on('child_added', function(data) {
			sum ++;
			if(sum>18100){
				setTimeout(end,1000);
			}
			if(data.val().title.indexOf(keyword)>-1){
				var movie = $(template);
				movie.find(".title:first").text(data.val().title);
				movie.find(".download:first").attr("onclick",
					"showlinks('"+data.val().id+"')");
				movie.attr("id",data.val().id);
				list.append(movie);
				state.text("");
			}
		});
	}

	function end(){
		state.text('Sorry，找不到你想要搜索的电影...');
	}
}())

function showlinks(id){
	$(".links").each(function(){
		$(this).remove();
	});
	var target = movies.child(id);
	target.once('value', function(value) {
		var down = value.val().download;
		for(var i=0;i<down.length;i++){
			var m = down[i];
			var div = $("<div class='links'>");
			div.append($("<p>").text(m.name+","+m.format+","+m.size));
			div.append($("<p>").text(m.href));
			div.append($("<hr>"));
			$("#"+id).append(div)
		}
	});
}