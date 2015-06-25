$.get('/Universal/Do_AddArticleScore.aspx?aid=486460&random=' + new Date().getTime());

$('table th')[0].innerText = '你会发现这个标题跟外面的不一样';
$('#articlecontent h1')[0].innerText = '你会发现这个标题跟外面的不一样';
document.title = '你会发现这个标题跟外面的不一样';

var loadCss = function(path) {
	if (!path || path.length === 0) {
		throw new Error('argument "path" is required !');
	}
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.href = path;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	head.appendChild(link);
}

loadCss('http://jaguarsy.github.io/awsome.css');