$(function() {
	var isCompute = false

	var init = function() {
		var div = $('<div>').addClass('item'),
			chessPanel = $('#chess-panel'),
			piecePanel = $('#piece-panel')

		for (var i = 0; i < 196; i++) {
			chessPanel.append(div.clone());
		}

		for (var i = 0; i < 225; i++) {
			piecePanel.append(div.clone());
		}
	}

	init()

	var pieces = $('#piece-panel .item');

	var move = function(piece, index) {
		piece = piece instanceof jQuery ? piece : $(piece);
		piece.removeClass('prepare-' + index);
		piece.addClass('active-' + index);
		piece.attr('data-value', index);
	}

	var isWin = function() {}

	var compute = function() {
		var result = score(pieces);
		console.log(result)
		move(pieces[result.place], 2);
	}

	pieces.hover(function() {
		$(this).addClass('prepare-1');
	}, function() {
		$(this).removeClass('prepare-1');
	})

	pieces.on('click', function() {
		if (isWin()) return;
		move($(this), 1);
		compute();
	})
})