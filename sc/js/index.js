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
			img: "image/build/0_hq_red.gif",
			width: 127,
			height: 101,
			hBlock: 2,
			vBlock: 2,
			left: 0
		}],
		units = [],
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

	var scv;
	//初始化scv
	for (var i = 0; i < 6; i++) {
		scv = new createjs.Bitmap("image/unit/0_scv_red.gif");
		scv.sourceRect = {
			x: 0,
			y: 192,
			width: 46,
			height: 48
		};
		scv.x = i * 30 + 350;
		scv.y = 360;
		stage.addChild(scv);
		units.push({
			name: "scv",
			obj: scv,
			width: 30,
			height: 30,
			hBlock: 1,
			vBlock: 1
		});
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
	function Choose(sx1, sy1, sx2, sy2) {
		var x1 = Math.floor(sx1 / bWidth),
			y1 = Math.ceil(sy1 / bHeight),
			x2 = Math.floor(sx2 / bWidth),
			y2 = Math.ceil(sy2 / bHeight),
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

		for (var i = 0; i < units.length; i++) {
			var unit = units[i];

			if (!isInRect(unit.obj.x, unit.obj.y, unit.width,
					unit.height, sx1, sy1, sx2, sy2)) continue;
			if (chooseCount >= chooses.length) break;
			choose = chooses[chooseCount++];

			drawChooseCircle(choose, unit.obj.x + unit.width / 3, unit.obj.y + unit.height * 2 / 3,
				unit.hBlock * unit.width, unit.vBlock * unit.height);

			stage.update();
		}

		for (var i = x1; i <= x2; i++) {
			for (var j = y1; j <= y2; j++) {
				var t = texture[i][j];
				if (t <= 0) continue;
				if (chooseCount >= chooses.length) break;
				choose = chooses[chooseCount++];
				drawChooseCircle(choose, i * bWidth, j * bHeight - (res[t].vBlock + 1) * vCount,
					res[t].hBlock * bWidth, res[t].vBlock * bHeight);

				stage.update();
			}
		}
	}

	//碰撞检测
	function isInRect(x, y, width, height, x1, y1, x2, y2) {
		return (x >= x1 && x <= x2 || x >= x2 && x <= x1) &&
			(y >= y1 && y <= y2 || y >= y2 && y <= y1) ||
			(x < x1 && x + width > x1 && y < y1 && y + height > y1) ||
			(x < x1 && x + width > x1 && y < y1 && y + height > y2) ||
			(x < x1 && x + width > x2 && y < y1 && y + height > y1) ||
			(x < x1 && x + width > x2 && y < y1 && y + height > y2);
	}

	function drawChooseCircle(shape, x, y, width, height) {
		shape.graphics
			.setStrokeStyle(1)
			.beginStroke("#00EE00")
			.drawEllipse(x, y, width, height);
	}

	function getTopTexture(i, j) {
		for (var i = 0; i < hCount; i++) {
			for (var j = 0; j < vCount; j++) {

			}
		}
	}
})()