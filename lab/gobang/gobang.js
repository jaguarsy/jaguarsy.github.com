function GoBang(canvasDom, hoverDom, scorePanel) {
    var padding = 10;
    var halfPadding = padding / 2;

    var self = this;

    self.currentPlayerShow = scorePanel.querySelector('.currentPlayer');
    self.currentPlayer = 0;
    self.userHold = 0;
    self.enableAI = true;
    self.hardness = 3;
    self.rows = 15;
    self.cols = 15;
    self.canvasDom = canvasDom;
    self.width = canvasDom.width;
    self.height = canvasDom.height;
    self.offsetLeft = canvasDom.parentNode.offsetLeft;
    self.offsetTop = canvasDom.parentNode.offsetTop;
    self.cellWidth = (self.width - padding) / self.cols;
    self.cellHeight = +self.cellWidth;
    self.radius = self.cellWidth / 2;
    self.canvasContext = canvasDom.getContext('2d');
    self.hoverCanvasDOM = hoverDom;
    self.hoverCanvasContext = self.hoverCanvasDOM.getContext("2d");
    self.resources = {};
    self.listeners = {};
    self.lastMove;

    self.addListener = function (type, callback) {
        self.listeners[type] = callback;
    };

    self.trigger = function (type, params) {
        if (self.listeners[type]) {
            self.listeners[type](params);
        }
    };

    var loadResource = function () {
        var tasks = [
            loadBackground()
        ];

        return Promise.all(tasks).then(function (results) {
            self.resources.backgroundImage = results[0];
            return self.resources;
        });
    };

    var loadBackground = function () {
        return new Promise(function (resolve, reject) {
            if (self.resources.backgroundImage) {
                resolve(self.resources.backgroundImage);
                return;
            }

            var image = new Image();
            image.src = 'images/board.jpeg';
            image.onload = function () {
                resolve(image);
            };

            image.onerror = function () {
                reject();
            };
        });
    };

    var drawBackground = function (image) {
        self.canvasContext.drawImage(image, 0, 0, self.width, self.height);
    };

    var directions = [
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: -1, y: 1}
    ];

    var win = function () {
        for (var i = 0; i < self.width; i++) {
            for (var j = 0; j < self.height; j++) {
                if ((i + j) > self.width || !self.board[i] ||
                    self.board[i][j] === -1 ||
                    self.board[i][j] === undefined) {
                    continue;
                }

                var player = self.board[i][j];

                for (var k = 0; k < directions.length; k++) {
                    var dir = directions[k];

                    var count = 1,
                        startX = i + dir.x,
                        startY = j + dir.y;

                    while (true) {
                        if (!self.board[startX] ||
                            self.board[startX][startY] !== player) {
                            break;
                        }
                        count++;
                        startX += dir.x;
                        startY += dir.y;
                    }
                    if (count >= 5) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    var drawPiece = function (point, player, withPoint) {
        self.canvasContext.fillStyle = player == 0 ? '#000' : '#fff';
        self.canvasContext.beginPath();
        self.canvasContext.arc(
            point.y * self.cellWidth + halfPadding + self.radius,
            point.x * self.cellHeight + halfPadding + self.radius,
            self.radius, 0, 2 * Math.PI);
        self.canvasContext.closePath();
        self.canvasContext.fill();

        if (withPoint) {
            self.canvasContext.fillStyle = player == 1 ? '#000' : '#fff';
            self.canvasContext.beginPath();
            self.canvasContext.arc(
                point.y * self.cellWidth + halfPadding + self.radius,
                point.x * self.cellHeight + halfPadding + self.radius,
                2, 0, 2 * Math.PI);
            self.canvasContext.closePath();
            self.canvasContext.fill();
        }
    };

    self.move = function (point) {
        self.trigger('move', self.currentPlayer);

        self.board[point.x][point.y] = self.currentPlayer;
        if (self.lastMove) {
            drawPiece(self.lastMove, 1 - self.currentPlayer);
        }
        drawPiece(point, self.currentPlayer, true);
        self.lastMove = point;

        if (win()) {
            self.lastMove = null;
            self.finish();
        } else {
            self.currentPlayer = 1 - self.currentPlayer;
        }
    };

    var clearHover = function () {
        self.hoverCanvasContext.clearRect(0, 0, self.width, self.height);
    };

    var coordOnBoard = function (element, e) {
        var positionX = e.clientX - self.offsetLeft - 2 * padding;
        var positionY = e.clientY - self.offsetTop - 2 * padding;
        return {
            y: Math.round(positionX / self.cellWidth),
            x: Math.round(positionY / self.cellHeight)
        };
    };

    var drawFocus = function (point) {
        clearHover();
        self.hoverCanvasContext.beginPath();
        self.hoverCanvasContext.fillStyle = "#000000";
        self.hoverCanvasContext.rect(
            point.y * self.cellWidth + halfPadding,
            point.x * self.cellHeight + halfPadding,
            self.cellWidth,
            self.cellHeight);
        self.hoverCanvasContext.closePath();
        self.hoverCanvasContext.stroke();
    };

    self.finish = function () {
        self.hoverCanvasDOM.removeEventListener('mousemove', mouseMoveHandler);
        self.hoverCanvasDOM.removeEventListener('click', clickHandler);

        self.trigger('endThink');
        self.trigger('finish');
    };

    self.isValidPoint = function (point) {
        return self.board[point.x][point.y] === -1;
    };

    self.changeState = function () {
        if (self.currentPlayer === self.userHold) {
            self.trigger('thinking');
        } else {
            self.trigger('endThink');
        }

        self.currentPlayerShow.innerText =
            (self.userHold === self.currentPlayer ? '你' : '对手') +
            (self.currentPlayer ? '[白子]' : '[黑子]');
    };

    var AIMove = function () {
        setTimeout(function () {
            var result = AI.play(self.board, self.currentPlayer, self.hardness);
            result[1] = result[1] || [7, 7];
            self.move({x: result[1][0], y: result[1][1]});
            self.changeState();
        }, 40);
    };

    var pointerFocus;
    var mouseMoveHandler = function (event) {
        var point = coordOnBoard(this, event);
        if (point.x > -1 && point.y > -1) {
            drawFocus(point);
            pointerFocus = point;
        }
    };

    var clickHandler = function (event) {
        if (pointerFocus && self.currentPlayer === self.userHold) {
            if (self.isValidPoint(pointerFocus)) {
                self.move(pointerFocus);
                self.changeState();

                if (self.enableAI) {
                    AIMove();
                }
            }
        }
    };

    self.init = function () {
        loadResource().then(function (resources) {
            drawBackground(resources.backgroundImage);
        });
    };

    self.start = function (userHold, degree) {
        self.currentPlayer = 0;

        if (userHold !== undefined) {
            self.userHold = +userHold;
        }

        if (degree !== undefined) {
            self.hardness = +degree;
        }

        self.board = _.times(self.rows, function () {
            return _.times(self.cols, function () {
                return -1;
            });
        });

        self.hoverCanvasDOM.addEventListener('mousemove', mouseMoveHandler);
        self.hoverCanvasDOM.addEventListener('click', clickHandler);
        self.changeState();

        if (self.currentPlayer !== self.userHold && self.enableAI) {
            AIMove();
        }

        self.trigger('start');
    };
}