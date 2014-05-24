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
		var count = 0;
		var flag = true;
		titles.limit(20000).on('child_added', function(data) {
			sum ++;
			if(sum>18100&&flag){
				setTimeout(end,1000);
			}
			if(data.val().title.indexOf(keyword)>-1){
				count++;
				$("#count").html("共有"+count+"条结果。");

				var movie = $(template);
				movie.find(".title:first").text(data.val().title);
				movie.find(".download:first").attr("onclick",
					"showlinks('"+data.val().id+"')");
				movie.attr("id",data.val().id);
				list.append(movie);
				flag = false;
				state.text("");
			}
		});
	}

	function end(){
		state.text('Sorry，找不到你想要搜索的电影...');
	}
}())

function showlinks(id){
	var flag = false;
	$(".links").each(function(){
		flag = $(this).parent().attr("id")==id;
		$(this).remove();
	});
	if(flag)return false;
	var target = movies.child(id);
	target.once('value', function(value) {
		var down = value.val().download;

		for(var i=0;i<down.length;i++){
			var m = down[i];
			var div = $("<div class='links'>");
			div.append($("<hr>"));
			div.append($("<small>").text("名称：" + m.name));
			div.append($("<br>"));
			div.append($("<small>").text("清晰度：" + m.format));
			div.append($("<br>"));
			div.append($("<small>").text("大小：" + m.size));
			div.append($("<br>"));
			div.append($("<small>").text( m.href));
			$("#"+id).append(div)
		}
	});
}