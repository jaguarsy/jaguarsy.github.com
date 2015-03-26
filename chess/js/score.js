//落子，1：人，2：电脑

var scorebase = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0,
	0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0,
	0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0,
	0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

//死二，死三，死四  	 0    	liveLevel=2
//大跳活二				     
//跳活二，眠二			 2    	sum==2 && blankCount==1 && liveLevel==0 ||sum==2 && blankCount==0 && liveLevel=1
//连活二，眠三			 3		sum==2 && blankCount==0 && liveLevel==0 ||sum==3 && blankCount==0 && liveLevel=1
//跳活三，冲四，连活三	 4		sum==3 && blankCount==1 && liveLevel==0 ||sum==4 && blankCount==0 && liveLevel=1 || sum==3 && blankCount==0 && liveLevel==0	
//活四，双四，双三，四三 100    sum==4 && blankCount==0 && liveLevel==0
//成五 					 1000
var level = [0, 1, 10, 11, 12, 1000, 10000],
	directions = [1, 16, 15, 14] //右，右下，下，左下， 不检测：左，左上，上，右上

var getBestInOneDirection = function(array, start, role, direction) {
	var sum = 0,
		index,
		item,
		blankCount = 0,
		blankTmp = 0,
		liveLevel = 0; //存活等级，两头对方棋子的数量：0 or 1 or 2，包括边界

	index = start - direction; //先检查前一颗子
	if (index < 0 || index > 0 && array[index] == 3 - role) { //撞墙了或者撞别人了
		liveLevel = 1;
	}

	for (var i = 0; i < 15; i++) {
		index = start + i * direction;
		item = array[index];

		//第一个就是空格或超出边界或空一格以上立即返回
		if (i == 0 && item == 0 || item == undefined || blankTmp > 1) {
			//f (array[index - 2 * direction] == 0) blankCount -= 2;
			return {
				start: start,
				sum: sum,
				blankCount: blankCount,
				liveLevel: liveLevel
			};
		}

		if (item == 0) { //统计空格
			blankTmp++;
			continue;
		}
		if (item == role) {
			if (blankTmp != 0) {
				blankCount++;
				blankTmp = 0;
			}
			sum++; //统计当前棋子数
		}
		if (item != role) { //检测到对方棋子
			liveLevel++;
			return {
				start: start,
				sum: sum,
				blankCount: blankCount,
				liveLevel: liveLevel
			};
		}
	}
}

var getLevel = function(obj) {
	if (obj.liveLevel == 2) return 0;
	if (obj.sum == 1) return 1;
	if (obj.sum == 2) return obj.sum - obj.blankCount - obj.liveLevel + 1;
	return obj.sum - obj.liveLevel + 1;
}

var compare = function(target, sourcelvl) {
	var level = getLevel(target);
	if (level > sourcelvl) {
		return level;
	}
	return sourcelvl;
}

//获取当前级别最高的排列
var getBest = function(array, role) {
	var best = 0,
		tmp;
	for (var i = 0; i < 225; i++) {
		for (var j = 0; j < 4; j++) {
			tmp = getBestInOneDirection(array, i, role, directions[j]);
			best = compare(tmp, best);
		}
	}

	return level[best];
}

var toArray = function(objs) {
	var array = [];
	for (var i = 0, len = objs.length; i < len; i++) {
		var value = $(objs[i]).attr('data-value') | 0;
		array.push(value);
	}
	return array;
}

function putNext(array, role) {
	var bestPlace,
		bestScore = 0,
		tmp;

	for (var i = 0; i < 225; i++) {
		if (array[i] != 0) continue;
		array[i] = role;
		tmp = getBest(array, role) + scorebase[i];
		//当前步的最佳估值减去下一步对方的最佳估值即当前步的估值
		if (tmp > bestScore) {
			bestScore = tmp;
			bestPlace = i;
		}

		array[i] = 0;
	}

	return {
		nextScore: bestScore/2,
		place: bestPlace
	};
}

function put(array, role) {
	var bestPlace,
		bestScore = -100,
		tmp,
		tmpNext;

	for (var i = 0; i < 225; i++) {
		if (array[i] != 0) continue;
		array[i] = role;
		tmp = getBest(array, role) + scorebase[i];
		tmpNext = putNext(array, 3 - role);
		//当前步的最佳估值减去下一步对方的最佳估值即当前步的估值
		if (tmp - tmpNext.nextScore > bestScore) {
			bestScore = tmp - tmpNext.nextScore;
			bestPlace = i;
		}

		array[i] = 0;
	}
	console.log(tmp)
	return {
		nextScore: bestScore,
		place: bestPlace
	};
}

var score = function(pieces) {
	var array = toArray(pieces);
	return put(array, 2);
}