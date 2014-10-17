$.post('http://sc2.haoest.com/Forum/1/AddPost',{
 __RequestVerificationToken:$('input[name="__RequestVerificationToken"]').val(),
 ForumId:'1',
Title:'大家好我叫'+$('.sign-in-partial li a:first').text().trim(),
Content:'<p>支持好易思特星际战区！</p>',
Excerpt:'支持好易思特星际战区！',
editorValue:'<p>支持好易思特星际战区！</p>'
},function(data){console.log(data)});