(function() {
	'use strict'

	var layer = new collie.Layer({
		width: 300,
		height: 300
	});

	collie.ImageManager.add({
		marine: "image/unit/0_marine_blue.gif"
	});

	collie.ImageManager.addSprite("marine", {
		top: [0, 0, 32, 32, 3], // x, y, width, height, spriteLength
		topRight: [0, 32, 32, 32, 3],
		right: [0, 64, 32, 32, 3],
		downRight: [0, 96, 32, 32, 3],
		down: [0, 128, 32, 32, 3]
	});

	var marine = new collie.DisplayObject({
		x: "center",
		y: "center",
		width: 32,
		height: 32,
		spriteSheet: "right",
		backgroundImage: "marine"
	}).addTo(layer);

	collie.Timer.cycle(marine, "8fps", {
		to: 2,
		onEnd: function() {
			// var direction = "";

			// switch (marine.get("spriteSheet")) {
			// 	case "top":
			// 		direction = "topRight";
			// 		break;
			// 	case "topRight":
			// 		direction = "right";
			// 		break;
			// 	case "right":
			// 		direction = "downRight";
			// 		break;
			// 	case "downRight":
			// 		direction = "down";
			// 		break;
			// 	case "down":
			// 		direction = "top";
			// 		break;
			// }

			marine.set("spriteSheet", 'right');
		}
	});

	collie.Renderer.addLayer(layer);
	collie.Renderer.load(document.getElementById("container"));
	collie.Renderer.start();
})()