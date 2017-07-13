function Square(row, col, color) {
    this.piece = -1;
    this.row = row;
    this.col = col;
    this.color = color;
}

var COLOR_NAME = {
    LIGHT: 1,
    DARK: 0
};

var board = [];
var boardEl = document.getElementById('gameBoard');

var numberOfKnightsInPlay = 0;

for (var i = 0; i < 8*8; i++) {
    var is_odd_square = !!(i & 1);
    var row = i / 8 | 0;
    var col = i % 8;
    var is_odd_row = !!(row & 1);
    var color = is_odd_square ? COLOR_NAME.DARK : COLOR_NAME.LIGHT;
    if (is_odd_row) color = !color - 0;
    var sq = new Square(row, col, color);

    if (i % 8 === 0) {
        board.push([]);
    }

    var currentRow = board[board.length - 1];
    currentRow.push(sq);
}

function run() {
    boardEl.innerHTML = '';
    for (var i = 0; i < 8*8; i++) {
        var row = i / 8 | 0;
        var col = i % 8;
        var square = document.createElement('div');
        var squareObj = board[row][col];

        square.dataset.row = row;
        square.dataset.col = col;

        square.classList.add('square');
        square.classList.add(squareObj.color === COLOR_NAME.LIGHT ? 'light' : 'dark');
        if (squareObj.piece >= 0) {
            square.classList.add('piece');
            square.classList.add(PIECE_ID_TO_CLASS[squareObj.piece]);
        }

        function highlightKnightSquares(row, col, level) {
            var toHighlightSquares = [];

            if (col <= 6) {
                var s1y = row - 2;
                var s1x = col + 1;
                toHighlightSquares.push({ r: s1y, c: s1x });

                var s4y = row + 2;
                var s4x = col + 1;
                toHighlightSquares.push({ r: s4y, c: s4x });
            }

            if (col <= 5) {
                var s2y = row - 1;
                var s2x = col + 2;
                toHighlightSquares.push({ r: s2y, c: s2x });

                var s3y = row + 1;
                var s3x = col + 2;
                toHighlightSquares.push({ r: s3y, c: s3x });
            }

            if (col >= 1) {
                var s5y = row + 2;
                var s5x = col - 1;
                toHighlightSquares.push({ r: s5y, c: s5x });

                var s8y = row - 2;
                var s8x = col - 1;
                toHighlightSquares.push({ r: s8y, c: s8x });
            }

            if (col >= 2) {
                var s6y = row + 1;
                var s6x = col - 2;
                toHighlightSquares.push({ r: s6y, c: s6x });

                var s7y = row - 1;
                var s7x = col - 2;
                toHighlightSquares.push({ r: s7y, c: s7x });
            }
            

            toHighlightSquares.forEach(function(sqNums) {
                var toHighlight = boardEl.getElementsByClassName('square')[sqNums.r * 8 + sqNums.c];
                if (toHighlight) {
                    var existingNumberOfMoves = toHighlight.dataset.numberOfKnightMoves - 0 || 0;
                    var newNumberOfMoves = level;
                    if (newNumberOfMoves < existingNumberOfMoves) {
                        toHighlight.classList.remove('highlight' + existingNumberOfMoves);
                        toHighlight.classList.add('highlight' + newNumberOfMoves);
                        toHighlight.dataset.numberOfKnightMoves = newNumberOfMoves;
                    } else if (!toHighlight.classList.contains('highlight')) {
                        toHighlight.classList.add('highlight');
                        toHighlight.classList.add('highlight' + newNumberOfMoves);
                        toHighlight.dataset.numberOfKnightMoves = newNumberOfMoves;
                    }
                }
            });

            return toHighlightSquares;
        }

        square.onclick = function(e) {

            if (!e.shiftKey || e.shiftKey && numberOfKnightsInPlay >= 2) {
                numberOfKnightsInPlay = 1;
                var existingHighlighted = boardEl.getElementsByClassName('highlight');

                Array.prototype.slice.call(existingHighlighted).forEach(function(existingSq) {
                    existingSq.classList.remove('highlight');
                    delete existingSq.dataset.numberOfKnightMoves;
                    existingSq.className = existingSq.className.replace(/highlight[0-9]/g, '');
                });
            } else {
                numberOfKnightsInPlay++;
            }

            var row = this.dataset.row - 0;
            var col = this.dataset.col - 0;

            var highlightedSquares = highlightKnightSquares(row, col, 1);
            var highlightedSquares2 = [];
            highlightedSquares.forEach(function(sq) {
                highlightedSquares2.push(highlightKnightSquares(sq.r, sq.c, 2));
            });

            highlightedSquares2.forEach(function(highlightedSquares2Arr) {
                highlightedSquares2Arr.forEach(function(sq) {
                    highlightKnightSquares(sq.r, sq.c, 3);
                });
            });

        };

        boardEl.appendChild(square);
    }
}

run();