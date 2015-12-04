function AutoFade(list){
	var OutOfOrder = false,
		loadspeed = 10,
		i=0,
		node,
		newlist;

	var incFade = function(){
		if( i < list.length ) {
			if(OutOfOrder){
				node = list[newlist[i]];
			}
			else{
				node = list[i];
			}
			if(node.className.indexOf('fade-load')<0){
				node.className += ' fade-load';
				i++;
			}
			setTimeout( incFade, loadspeed );
		}
	}

	var shuffle = function(len){
		var o = [];
		for(var t=0;t<len;t++){
			o.push(t);
		}
		for(var j, x, i = len; i; ){
			j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x;
		}
		return o;
	};

	this.ini = function(speed,outorder){
		OutOfOrder = outorder;
		loadspeed = speed;
		newlist = shuffle(list.length);
		setTimeout(incFade,loadspeed);
	}
}

Object.prototype.AutoFadeIn = function(speed,outorder){
	var obj = new AutoFade(this);
	obj.ini(speed,outorder);
}