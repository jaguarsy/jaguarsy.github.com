// ------------------------------------- //
// ------- GLOBAL VARIABLES ------------ //
// ------------------------------------- //

// 场景相关变量（渲染器，场景，相机，点光源，聚光光源）
var renderer, scene, camera, pointLight, spotLight;

// 场地参数
var fieldWidth = 400, fieldHeight = 200;

// 球拍参数
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// 球的参数
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// 游戏相关变量，各玩家得分值
var score1 = 0, score2 = 0;
// 最大得分值
var maxScore = 3;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.2;

// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

function setup()
{
	// 更新信息板
	document.getElementById("winnerBoard").innerHTML = "率先抢下 " + maxScore + " 分者胜!";
	
	// 重置玩家分数
	score1 = 0;
	score2 = 0;
	
	// 创建和设置场景
	createScene();
	
	// 绘制
	draw();
}

function createScene()
{
	// 场景大小
	var WIDTH = 640,
	  HEIGHT = 360;

	// 相机属性
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// 创建渲染器、相机和场景
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// 添加相机到场景中
	scene.add(camera);
	
	// 设置默认相机位置
	camera.position.z = 320;
	
	// 启动渲染器
	renderer.setSize(WIDTH, HEIGHT);

	// 添加渲染器DOM元素
	c.appendChild(renderer.domElement);

	// 设置游戏平台参数 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// 创建球拍1的材质
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// 创建球拍2的材质
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});
	// 创建平面的材质
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4BD121
		});
	// 创建球桌的材质
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x111111
		});
	// 创建柱子的材质
	var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x534d0d
		});
	// 创建地板的材质
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});
		
		
	// 创建游戏平台平面
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,	// 95%的桌子宽度, 留出空隙绘制球的出界位置
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,
		planeHeight * 1.03,
		100,				
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	// 将桌子插入地面50单位高度. 剩下的1单位为桌子的平台平面
	scene.add(table);
	table.receiveShadow = true;	
		
	// 设置球的参数
	var radius = 5,
		segments = 6,
		rings = 6;
		
	// 创建球的材料
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});
		
	// 创建球体
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// 添加球到场景
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	// 设置球位于平台上方
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	// 设置拍子参数
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// 添加拍子1到场景中
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);
	  
	// 添加拍子2到场景中
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// 设置拍子位于桌面两端
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	// 提升拍子位于桌面平台上方
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
		
	// 在桌子左侧每隔10x创建一根柱子用于显示阴影效果
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(
		
		  new THREE.CubeGeometry( 
		  30, 
		  30, 
		  300, 
		  1, 
		  1,
		  1 ),

		  pillarMaterial);
		  
		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = 230;
		backdrop.position.z = -30;		
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		  
		scene.add(backdrop);	
	}
	// 在桌子右侧每隔10x创建一根柱子用于显示阴影效果
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

		  new THREE.CubeGeometry( 
		  30, 
		  30, 
		  300, 
		  1, 
		  1,
		  1 ),

		  pillarMaterial);
		  
		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = -230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		
		scene.add(backdrop);	
	}
	
	// 创建地面
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry( 
	  1000, 
	  1000, 
	  3, 
	  1, 
	  1,
	  1 ),

	  groundMaterial);
    //设置地面的Z属性
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	// 创建点光源
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// 设置点光源位置
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// 添加点光源到场景中
	scene.add(pointLight);
		
	// 添加聚光光源以产生阴影效果
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	// 开启阴影效果
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// 绘制场景
	renderer.render(scene, camera);
	// 循环更新
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	//如果球到达了平台的左边缘(游戏玩家那一边)
	if (ball.position.x <= -fieldWidth/2)
	{	
		// 电脑玩家得一分
		score2++;
		// 更新计分板
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// 重置球的初始位置
		resetBall(2);
		matchScoreCheck();	
	}
	
	//如果球到达了平台的右边缘(电脑玩家那一边)
	if (ball.position.x >= fieldWidth/2)
	{	
		// 游戏玩家得一分
		score1++;
		// 更新计分板
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// 重置球的初始位置
		resetBall(1);
		matchScoreCheck();	
	}
	
	// 如果球运动到了平台的上边缘
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// 如果球运动到了平台的下边缘
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// 更新球的位置
	ball.position.x += ballDirX * ballSpeed;//假设为匀速运动 x(t+1)=x(t)+v*1 ;其中 v = ballDirX * ballspeed;
	ball.position.y += ballDirY * ballSpeed;//假设为匀速运动
	
	// 限制球的y方向速度分量处于 2x 和x-speed之间
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// 控制电脑玩家球拍的运动
function opponentPaddleMovement()
{
	// 让球拍在Y方向上跟随球进行运动
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	
	// 如果速度位于允许的范围内
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}
	// 如果速度超过允许的范围
	else
	{
		// 如果是正方向，限制为最大正速度
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// 如果是负方向，限制为最大负速度
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
	// 设置球拍的缩放比例为正常
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
}


// 控制游戏玩家球拍的运动
function playerPaddleMovement()
{
	// 向左运动
	if (Key.isDown(Key.A))		
	{
		// 如果球拍还没有接触到游戏区域的边缘，向左移动球拍
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// 如果球拍已经和游戏区域边缘接触，停止向左移动
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}	
	// 向右运动
	else if (Key.isDown(Key.D))
	{
		// 如果球拍还没有接触到游戏区域的边缘，向右移动球拍
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		// 如果球拍已经和游戏区域边缘接触，停止向右移动
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	// 其他条件下不进行移动拍子
	else
	{
		// 停止拍子的移动
		paddle1DirY = 0;
	}
	
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;	
	paddle1.position.y += paddle1DirY;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// 设置聚光光源跟随球进行移动
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;
	
	// 移动摄像头到玩家拍子的后面
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	// 旋转摄像头到玩家视角
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// 球拍碰撞物理效果和游戏逻辑的实现
function paddlePhysics()
{
	// 游戏玩家球拍逻辑
	// 检查球是否在X方向和球拍1对齐
	// 物体的位置的计算中心是物体的几何中心
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// 检查球是否在Y方向和球拍1对齐
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// 如果球向游戏玩家跑过来 (-ve方向)
			if (ballDirX < 0)
			{
				// 拉伸球拍表明击中了
				paddle1.scale.y = 15;
				// 逆转球的X速度分量
				ballDirX = -ballDirX;
				// 改变球的Y方向的速度分量（受球拍Y方向速度分量影响所致），以实现切球效果
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	// 电脑玩家球拍逻辑	
	// 检查球是否在X方向和球拍2对齐
	// 物体的位置的计算中心是物体的几何中心
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// 检查球是否在Y方向和球拍2对齐
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// 如果球向电脑玩家跑过来 (+ve方向)
			if (ballDirX > 0)
			{
				// 拉伸球拍表明击中了
				paddle2.scale.y = 15;	
				// 逆转球的X速度分量
				ballDirX = -ballDirX;
				// 改变球的Y方向的速度分量（受球拍Y方向速度分量影响所致），以实现切球效果
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

// 重置球的初始位置位于平台中央并设置球的方向为朝向上一次的得分者（失分者发球）
function resetBall(loser)
{
  // 设置球的位置为平台中央
  ball.position.x = 0;
  ball.position.y = 0;
  // 如果玩家是上一局的失分者，设置由玩家发球
  if (loser == 1)
  {
    ballDirX = -1;
  }
  // 如果电脑玩家是上一局的失分者，设置由电脑玩家发球
  else
  {
    ballDirX = 1;
  }
  // 设置球的Y方向速度分量
  ballDirY = 1;
}

var bounceTime = 0;
// 获胜判断函数
function matchScoreCheck()
{
	// 如果游戏玩家率先得到最高分
	if (score1 >= maxScore)
	{
		// 停止球运动
		ballSpeed = 0;
		// 更新计分板和信息栏
		document.getElementById("scores").innerHTML = "恭喜你，你赢了";		
		document.getElementById("winnerBoard").innerHTML = "刷新页面再玩一次！";
		// 设置球拍上下跳跃
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// 缩放球拍以庆祝
		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// 如果电脑玩家率先得到最高分
	else if (score2 >= maxScore)
	{
		// 停止球运动
		ballSpeed = 0;
		// 更新计分板和信息栏
		document.getElementById("scores").innerHTML = "电脑玩家获胜!";
		document.getElementById("winnerBoard").innerHTML = "刷新页面再玩一次！";
		// 设置球拍上下跳跃
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
		// 缩放球拍以庆祝
		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}