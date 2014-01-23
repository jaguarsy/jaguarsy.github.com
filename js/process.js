var userlist;
var loginpanel;
var chatpanel;
var userRef;
var messagesRef;
var messagelisten;
var islogin = false;
var storage = window.sessionStorage;
var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
var root = 'https://395703303.firebaseIO-demo.com/';

$(function(){
	userRef = new Firebase(root + 'userlist/');
	messagesRef = new Firebase(root + 'messagelist/');
	messagelisten = new Firebase(root + 'messagelist/');
	loginpanel = $('#login');
	chatpanel = $('#chat');
	loginpanel.hide();
	chatpanel.hide();
	if(getCurrentName()!=null){
		islogin = true;
	}
	userRef.on('value', function(snapshot) {
		userlist = snapshot.val();
		if(islogin){
			if(!chatpanel.is(':visible'))
				chatpanel.fadeIn();
			ini();
		}
		else loginpanel.fadeIn();
	});
});

function login(){
	error('');
	var username = $('#username').val();
	var password = $('#password').val();
	if(username =='' || password == '') {
		error("用户名密码不能为空。");
		return;
	}
	$('#username').val('');
	$('#password').val('');
	$.each(userlist, function (n, value) {
		var name = userlist[n].username;
        if(name == username){
        	if(userlist[n].password != password){
        		error("密码错误。");
        		return;
        	}
        	else{
				loadMainPanel(username);
				return;
        	}
        }
    });
}

function register(){
	var username = $('#registername').val();
	var password = $('#registerpassword').val();
	var confirm = $('#confirmpassword').val();
	if(username=='' || password=='' || confirm==''){
		alert("用户名密码不能为空。")
	}
	if(confirm!=password){
		alert("密码不相同。");
		return;
	}
	$('#registername').val('');
	$('#registerpassword').val('');
	$('#confirmpassword').val('');

	userRef.push({username:username, password:password});

	$('#myModal').modal('hide');
	loadMainPanel(username);
}

function loadMainPanel(username){
	setCurrentName(username);
	ini();
	loginpanel.hide();
	chatpanel.fadeIn();
}

function logout(){
	islogin = false;
	resetCurrentName();
	chatpanel.hide();
	loginpanel.fadeIn();
}

function error(message){
    $('#error').text(message);
}

function ini(){
	var users = $('#userspanel');
	users.empty();
	$.each(userlist, function (n, value) {
		addToList(users,n,value.username);
	});
	$('#currentName').text(getCurrentName());
	$('#messagepanel').hide();

	messagelisten.limit(10).on('child_added', function (snapshot) {
    	var message = snapshot.val();
    	if(message.hasread == '0'){
    		if(message.user != getCurrentName() && message.to == getCurrentName()){
    			var obj = $('#user_'+message.user);
    			var sum = 0;
    			if(obj.text()!='') sum = parseInt(obj.text());
    			sum++;
    			obj.text(sum);
    		}
    	}
  	});
}

function addToList(panel,id,name){
	panel.append('<a href="javascript:void(0)" class="list-group-item" onclick="talkToUser(\'' 
		+ id + '\')"><span class="badge" id="user_' + name + '"></span>' + 
		name + '</a>');
}

function getCurrentName(){
	if(isChrome)
		return storage.getItem('chat');
	else 
		return $.cookie('chat');
}

function setCurrentName(value){
	if(isChrome)
		return storage.setItem('chat',value);
	else 
		return $.cookie('chat',value);
}

function resetCurrentName(){
	if(isChrome)
		storage.removeItem('chat');
	else 
		$.cookie('chat', null);
}

function talkToUser(id){
	var talkToName = userlist[id].username;

	if(talkToName == getCurrentName()){
		alert("不能与自己聊天。");
		return;
	}

	updateUnReadMsg(talkToName);

	//显示消息
	$('#messagepanel').fadeIn();
	$('#talkto').text(talkToName);
	$('#messagesDiv').empty();

	messagesRef.off('child_added');
	messagesRef.limit(10).on('child_added', function (snapshot) {
    	var message = snapshot.val();
    	if(message.user == $('#talkto').text() && message.to == getCurrentName()){
			updateUnReadMsg(talkToName);
    	}
    	else{
    		if(message.hasread == '0'){
    			if(message.user != getCurrentName() && message.to == getCurrentName()){
    				var obj = $('#user_'+message.user);
    				var sum = 0;
    				if(obj.text()!='') sum = parseInt(obj.text());
    				sum++;
    				obj.text(sum);
    			}
    		}
    	}
    	if(message.to == $('#talkto').text() && message.user == getCurrentName() || 
    		message.to == getCurrentName() && message.user == $('#talkto').text()){
    		$('<div/>').text(message.detail).prepend($('<strong/>')
      			.text(message.user+': ')).appendTo($('#messagesDiv'));
    		$('#messagesDiv').append($('<small/>').text(message.sendtime).addClass('text-muted'));
    		$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    	}
  	});

  	$('#messageInput').keypress(function (e) {
    	if (e.keyCode == 13) {
			sendMessage();
			return false;
    	}
  });
}

function updateUnReadMsg(talkToName){
	//更新未查看消息
	$('#user_'+talkToName).empty();

	messagesRef.once('value', function(snapshot){
		var list = snapshot.val();
		$.each(list, function (n, value) {
			if(value.to == getCurrentName() && value.user == talkToName){
				messagesRef.child(n).update({hasread:1});
			}
		});
	});
}

function sendMessage(){
	var name = getCurrentName();
    var text = $('#messageInput').val();
    var talkto = $('#talkto').text();
    var now = getTime();
    if(text=='')return;
    messagesRef.push({
    	user:name, 
    	detail:text, 
    	to:talkto, 
    	hasread:0,
    	sendtime:now
    });
    $('#messageInput').val('');
}

function getTime(){ 
  var date = new Date();
  var hour = date.getHours();
  var min_ = date.getMinutes(); 
  var sec = date.getSeconds();
  if(hour<10)hour="0"+hour;
  if(min_<10)min_="0"+min_;
  if(sec<10)sec="0"+sec;

  return date.toLocaleDateString()+" "+hour+":"+min_+":"+sec;
}