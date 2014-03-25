var root = 'https://395703303blog.firebaseIO-demo.com/';
var articleRef;
var articles;

//模板解析
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined" ? "" : returns;
    });
}

String.prototype.getDom = function() {
　　 var objE = document.createElement("div");
　　 objE.innerHTML = this;
　　 return objE.childNodes;
};

$(function(){
    var template = $("#template-article").html();
    var home = $("#home");

    articleRef = new Firebase(root + 'articles/');

    articleRef.limit(50).on('child_added', function (snapshot) {
    	var art = snapshot.val();
    	home.append(template.temp(art));
  	});

});