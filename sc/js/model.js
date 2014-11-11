var SC = {}

SC.Model = {
	res: [{
		name: "bg",
		img: "image/bg1.gif",
		width: 65,
		height: 32,
		hBlock: 1,
		vBlock: 1,
		mgLeft: 0
	}, {
		name: "mine",
		img: "image/block/mine.gif",
		width: 41,
		height: 46,
		hBlock: 1,
		vBlock: 1,
		mgLeft: 10
	}, {
		name: "ves",
		img: "image/block/ves.gif",
		width: 115,
		height: 53,
		hBlock: 2,
		vBlock: 2,
		mgLeft: 8
	}, {
		name: "hq",
		img: "image/build/0_hq_red.gif",
		width: 127,
		height: 101,
		hBlock: 2,
		vBlock: 2,
		mgLeft: 0
	}],

	unit_res: {
		scv: {
			name: "scv",
			img: "image/unit/0_scv_red.gif",
			sourceRect: {
				up: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				up_right: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				right: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				down_right: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				down: {
					x: 0,
					y: 192,
					width: 46,
					height: 48
				},
				down_left: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				left: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
				up_left: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
			},
			pos: {
				x: 0,
				y: 0
			},
			canMove: true,
			isMoving: false,
			speed: 10,
			moveTarget: {
				x: 0,
				y: 0
			},
			width: 30,
			height: 25,
			hBlock: 1,
			vBlock: 1,
			mgLeft: 0,
			chooseOffset: {
				x: 10,
				y: 20
			}
		}
	}
}