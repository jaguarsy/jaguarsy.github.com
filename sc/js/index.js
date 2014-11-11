(function(Model) {
	'use strict'

	var stage = new createjs.Stage(id("game")),
		res = Model.res,
		unit_res = Model.unit_res,
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
				image.x = i * bWidth + resource.mgLeft;
				image.y = j * bHeight - resource.height;
				stage.addChild(image);
			}
		}
	}

	var scv;
	//初始化scv
	for (var i = 0; i < 6; i++) {
		scv = new createjs.Bitmap(unit_res.scv.img);
		scv.sourceRect = unit_res.scv.sourceRect.down;
		scv.x = i * 30 + 350;
		scv.y = 360;
		scv.addEventListener('click', ChooseUnit);
		scv.res = unit_res.scv
		stage.addChild(scv);
		units.push({
			obj: scv,
			res: unit_res.scv
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

		clearChoose();

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

			if (!isInRect(unit.obj.x, unit.obj.y, unit.res.width,
					unit.res.height, sx1, sy1, sx2, sy2)) continue;
			if (chooseCount >= chooses.length) break;
			choose = chooses[chooseCount++];

			drawChooseCircle(choose, unit.obj.x + unit.res.chooseOffset.x, unit.obj.y + unit.res.chooseOffset.y,
				unit.res.hBlock * unit.res.width, unit.res.vBlock * unit.res.height);

			stage.update();
		}
		//如果选中了单位，则不选中建筑物
		if (chooseCount > 0) return;

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

	function ChooseUnit(event) {
		clearChoose();
		var target = event.currentTarget;
		drawChooseCircle(chooses[0], target.x + target.res.chooseOffset.x, target.y + target.res.chooseOffset.y,
			target.res.hBlock * target.res.width, target.res.vBlock * target.res.height);
	}

	function clearChoose() {
		for (var i = chooses.length - 1; i >= 0; i--) {
			if (chooses[i].graphics.clear)
				chooses[i].graphics.clear();
		}
	}

	function getTopTexture(i, j) {
		for (var i = 0; i < hCount; i++) {
			for (var j = 0; j < vCount; j++) {

			}
		}
	}

	document.oncontextmenu = function(event) {
			console.log(event)

			event.returnValue = false;
		} //屏蔽鼠标右键 
})(SC.Model)