(function() {
	'use strict'

	var stage = new createjs.Stage(id("game")),
		res = [{
			img: "image/bg1.gif",
			width: 65,
			height: 32,
			hBlock: 1,
			vBlock: 1,
			left: 0
		}, {
			img: "image/block/mine.gif",
			width: 41,
			height: 46,
			hBlock: 1,
			vBlock: 1,
			left: 10
		}, {
			img: "image/block/ves.gif",
			width: 115,
			height: 53,
			hBlock: 2,
			vBlock: 2,
			left: 8
		}, {
			img: "image/build/0_hq_blue.gif",
			width: 127,
			height: 101,
			hBlock: 2,
			vBlock: 2,
			left: 0
		}],
		bWidth = 65,
		bHeight = 32,
		hCount = 15,
		vCount = 20,
		texture = [],
		chooses = [],
		image,
		temp;

	//地形数据载入
	for (var i = 0; i < hCount; i++) {
		texture[i] = [];
		for (var j = 0; j < vCount; j++) {
			texture[i][j] = 0
		}
	}

	//test
	texture[9][8] = 2
	texture[10][10] = 1
	texture[10][11] = 1
	texture[10][12] = 1
	texture[10][13] = 1
	texture[10][14] = 1
	texture[9][16] = 2
	texture[6][12] = 3

	//初始化地形
	for (var i = 0; i < hCount; i++) {
		for (var j = 0; j < vCount; j++) {
			image = new createjs.Bitmap(res[0].img);
			image.x = i * bWidth;
			image.y = j * bHeight;
			stage.addChild(image);
		}
	}

	for (var i = 0; i < 12; i++) {
		chooses[i] = new createjs.Shape();
		stage.addChild(chooses[i]);
	}

	var resource;
	for (var i = 0; i < hCount; i++) {
		for (var j = 0; j < vCount; j++) {
			//判断是否非背景，需要修改判断方式
			if (texture[i][j] > 0) {
				resource = res[texture[i][j]];
				image = new createjs.Bitmap(resource.img);
				image.x = i * bWidth + resource.left;
				image.y = j * bHeight - resource.height;
				stage.addChild(image);
			}
		}
	}

	stage.addEventListener("mousedown", MouseDown);
	stage.addEventListener("stagemouseup", MouseUp);
	stage.update();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);

	function tick() {
		stage.update();
	}

	function id(id) {
		return id === null || id === undefined ?
			console.log("Please provide element id") :
			document.getElementById(id);
	}

	function MouseDown(event) {
		var x = event.stageX,
			y = event.stageY;

		Choose(x, y, x, y)
		event.addEventListener("mousemove", function(e) {
			stage.removeChild(temp)
			temp = new createjs.Shape();
			temp.graphics
				.setStrokeStyle(1)
				.beginStroke("#00F5FF")
				.drawRect(x, y, e.stageX - x, e.stageY - y);
			stage.addChild(temp)

			Choose(x, y, e.stageX, e.stageY)
			stage.update();
		});
	}

	function MouseUp(event) {
		stage.removeChild(temp)
		stage.update();
	}

	//选择一个区域中的所有物体
	function Choose(x1, y1, x2, y2) {
		var x1 = Math.floor(x1 / bWidth),
			y1 = Math.ceil(y1 / bHeight),
			x2 = Math.floor(x2 / bWidth),
			y2 = Math.ceil(y2 / bHeight),
			tmp,
			chooseCount = 0,
			choose;

		//console.log(x1 + "," + y1 + "," + x2 + "," + y2)

		for (var i = chooses.length - 1; i >= 0; i--) {
			if (chooses[i].graphics.clear)
				chooses[i].graphics.clear();
		}

		if (x1 > x2) {
			tmp = x1;
			x1 = x2;
			x2 = tmp;
		}
		if (y1 > y2) {
			tmp = y1;
			y1 = y2;
			y2 = tmp;
		}

		for (var i = x1; i <= x2; i++) {
			for (var j = y1; j <= y2; j++) {
				var t = texture[i][j];
				if (t <= 0) continue;
				if (chooseCount >= chooses.length) break;
				choose = chooses[chooseCount++];
				choose.graphics
					.setStrokeStyle(1)
					.beginStroke("#00EE00")
					.drawEllipse(i * bWidth, j * bHeight - (res[t].vBlock + 1) * vCount,
						res[t].hBlock * bWidth, res[t].vBlock * bHeight);

				stage.update();
			}
		}
	}

	function getTopTexture(i, j) {
		for (var i = 0; i < hCount; i++) {
			for (var j = 0; j < vCount; j++) {

			}
		}
	}
})()