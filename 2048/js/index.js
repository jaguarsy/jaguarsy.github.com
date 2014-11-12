(function() {
	'use strict'

	var stage = new createjs.Stage("game"),
		graphics = new createjs.Graphics(),
		direct = {
			up: {
				x: 0,
				y: -1
			},
			right: {
				x: 1,
				y: 0
			},
			down: {
				x: 0,
				y: 1
			},
			left: {
				x: -1,
				y: 0
			}
		},
		block = [],
		bWidth = 150,
		bHeight = 150,
		hCount = 4,
		vCount = 4,
		randNum,
		keynum,
		currentDir,
		bg;

	graphics.beginStroke("#aaa")
		.beginFill("#ddd")
		.drawRect(0, 0, bWidth, bHeight);

	for (var i = 0; i < hCount; i++) {
		block[i] = [];
		for (var j = 0; j < vCount; j++) {
			bg = new createjs.Shape(graphics);
			bg.x = i * bWidth;
			bg.y = j * bHeight;
			block[i][j] = new createjs.Text("", "40px Arial", "#ff7700")
			block[i][j].textAlign = "center";
			block[i][j].x = i * bWidth + bWidth / 2;
			block[i][j].y = j * bHeight + (bHeight - block[i][j].getMeasuredHeight()) / 2;
			stage.addChild(bg);
			stage.addChild(block[i][j]);
		}
	}

	create(2);
	stage.update();
	document.onkeydown = function(e) {

		if (window.event) // IE
		{
			keynum = e.keyCode
		} else if (e.which) // Netscape/Firefox/Opera
		{
			keynum = e.which
		}
		switch (keynum) {
			case 38:
				currentDir = direct.up;
				break;
			case 39:
				currentDir = direct.right;
				break;
			case 40:
				currentDir = direct.down;
				break;
			case 37:
				currentDir = direct.left;
				break;
			default:
				currentDir = undefined;
		}
		if (currentDir) {
			fall(currentDir)
			stage.update();
		}
	}


	function id(selector) {
		return document.getElementById(selector);
	}

	function create(count, fallback) {
		for (var i = 0; i < count; i++) {
			randNum = getRand();
			if (block[randNum.x][randNum.y].text != "") {
				i--;
			} else {
				block[randNum.x][randNum.y].text = randNum.value;
				if (fallback)
					fallback();
			}
		}
	}

	function getRand() {
		return {
			value: Math.random() * 10 > 2 ? 2 : 4,
			x: parseInt(Math.random() * 10 % 4),
			y: parseInt(Math.random() * 10 % 4)
		}
	}

	var target,
		stepy = 1,
		stepx = 1,
		flag,
		hasNum;

	function fall(dir) {
		flag = 0;
		hasNum = 0;
		if (dir == direct.down) stepy = -1;
		else stepy = 1;
		if (dir == direct.right) stepx = -1;
		else stepx = 1;
		for (var i = (hCount - 1) * (1 - stepx) / 2; i < hCount && i >= 0; i += stepx) {
			for (var j = (vCount - 1) * (1 - stepy) / 2; j < vCount && j >= 0; j += stepy) {
				if (block[i][j].text != "") hasNum++;
				if (overRange(i, j, dir)) continue;
				if (block[i][j].text == "") continue;
				target = getTarget(i, j, dir, block[i][j].text);
				if (target == undefined) continue;
				flag++;
				target.text = (target.text == "" ? 0 : parseInt(target.text)) + parseInt(block[i][j].text);
				if (target.text == "2048") {
					id("win").style.display = "block";
					return;
				}
				block[i][j].text = "";
			}
		}
		if (flag > 0) {
			create(1, function() {
				if (hasNum >= vCount * hCount - 1) {
					if (isDead()) {
						id("lose").style.display = "block";
						return;
					}
				}
			});
		}
	}

	var tmpx, tmpy;

	function getTarget(x, y, dir, value) {
		tmpx = x, tmpy = y;
		for (var i = 0; i < vCount; i++) {
			if (overRange(tmpx, tmpy, dir)) {
				if (tmpx == x && tmpy == y) {
					return undefined;
				} else {
					return block[tmpx][tmpy];
				}
			}
			tmpx += dir.x;
			tmpy += dir.y;
			target = block[tmpx][tmpy];
			if (target.text == "") continue
			if (target.text == value) {
				return target;
			} else {
				if (tmpx - dir.x == x && tmpy - dir.y == y) {
					return undefined;
				} else {
					return block[tmpx - dir.x][tmpy - dir.y];
				}
			}
		}
	}

	function overRange(i, j, dir) {
		return i + dir.x > hCount - 1 || i + dir.x < 0 || j + dir.y > vCount - 1 || j + dir.y < 0;
	}

	function isDead() {
		var temp;
		for (var i = 0; i < hCount; i++) {
			for (var j = 0; j < vCount; j++) {
				temp = block[i][j]

				if (getTarget(i, j, direct.up, temp.text) ||
					getTarget(i, j, direct.down, temp.text) ||
					getTarget(i, j, direct.right, temp.text) ||
					getTarget(i, j, direct.left, temp.text)) {
					return false;
				}
			}
		}
		return true;
	}

	function ini() {
		for (var i = 0; i < hCount; i++) {
			for (var j = 0; j < vCount; j++) {
				block[i][j].text = "";
			}
		}
		create(2);
		stage.update();
	}
})()