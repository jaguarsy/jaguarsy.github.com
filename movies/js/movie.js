var movies = new Firebase('https://409728463list.firebaseIO-demo.com/list');

(function(){
	var 
		template = $("#template").html(),
		list = $("#list"),
		counter = $("#count"),
		state = $("#state"),
		titles = new Firebase('https://409728463.firebaseIO-demo.com/titles'),
		isSearching = false;

	$("#search").click(function(){
		if(isSearching) return false;
		isSearching = true;
		s();
	});

	$("#searchtext").keydown(function(e){
		if(e.keyCode==13){
			if(isSearching) return false;
			isSearching = true;
			s();
		}
	});

	function s(){
		counter.empty();
		list.empty();
		var keyword = $("#searchtext").val();
		if(keyword.replace(/\s/g,"")==""){
			isSearching = false;
			return false;
		}
		state.text("正在搜索...如果是首次搜索会比较慢，请耐心等候- -");

		var sum = 0;
		var count = 0;
		var flag = true;
		titles.limit(20000).on('child_added', function(data) {
			sum ++;
			if(sum>18100&&flag){
				setTimeout(end,1000);
				isSearching = false;
			}
			if(data.val().title.indexOf(keyword)>-1){
				count++;
				counter.html("共有"+count+"条结果。");

				var movie = $(template);
				movie.find(".title:first").text(data.val().title);
				movie.find(".download:first").attr("onclick",
					"showlinks('"+data.val().id+"')");
				movie.attr("id",data.val().id);
				list.append(movie);
				flag = false;
				isSearching = false;
				clear();
			}
		});
	}

	function end(){
		state.text('Sorry，找不到你想要搜索的电影...');
		setTimeout(clear,1000);
	}

	function clear(){
		state.text("");
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
			var a = $("<a>").append($("<small>").text(m.href));
			a.attr("href",m.href)
			div.append(a);
			$("#"+id).append(div)
		}
	});
}