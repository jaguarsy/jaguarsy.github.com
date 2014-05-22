var root = 'https://395703303blog.firebaseIO-demo.com/';
var articleRef;
var articles;

//模板解析
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        returns = returns.replace(/<img/g,'<img class="img-responsive"'); //修改所有图片为响应式
        return (returns + "") == "undefined" ? "" : returns;
    });
}

$(function(){
    var template = $("#template-article").html();
    var home = $("#home");

    articleRef = new Firebase(root + 'articles/');
    
    //for test
    //articleRef.push({id:Guid.NewGuid().ToString(),title:"测试标题", content:"测试内容", author:"Johnny", time:getTime()});
    
    articleRef.limit(50).on('child_added', function (snapshot) {
    	var art = snapshot.val();
    	home.append(template.temp(art));
  	});

    window.onscroll = function () {  
        var top = document.documentElement.scrollTop || document.body.scrollTop;  
        $('.article').each(function(){
            if($(this).nextAll().length===0) return;
            //精度不够
            if(Math.abs(top-$(this).offset().top)<=2){
                console.log($(this).children(':first').html());
            }
        });
    };
});

function getTime(){ 
  var date = new Date();
  var hour = date.getHours();
  var min_ = date.getMinutes(); 
  if(hour<10)hour="0"+hour;
  if(min_<10)min_="0"+min_;

  return date.toLocaleDateString()+" "+hour+"时"+min_+"分";
}