var a = 1800;
var times;
var strt = false;

const speed = 15;
const delay = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), speed);
    });
}

async function start() {
    var sudoku = [[]];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            const val = document.getElementById(String(i) + String(j)).value

            sudoku[i].push(Number(val));

        }
        sudoku.push([]);
    }

    const check = await initialCheck(sudoku);

    if (!check) { alert("Give correct inputs"); }

    else {
        const result = await solve(sudoku, 0, 0);
        clearInterval(times);
        if (!result) alert("No solution exists");
    }

}

async function initialCheck(sudoku) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] > 9 || sudoku[i][j] < 0) return false;
            if (sudoku[i][j]) {

                for (var k = 0; k < 9; k++) if (sudoku[i][j] == sudoku[k][j] && k != i) return false;

                for (var k = 0; k < 9; k++) if (sudoku[i][j] == sudoku[i][k] && k != j) return false;

                var boxrow = i - i % 3;
                var boxcol = j - j % 3;
                for (var k = 0; k < 3; k++) {
                    for (var l = 0; l < 3; l++) {
                        if (sudoku[k + boxrow][l + boxcol] == sudoku[i][j] && (k + boxrow != i || l + boxcol != j))
                            return false;
                    }
                }
            }
        }
    }
    return true;
}

async function finalCheck(sudoku) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] > 9 || sudoku[i][j] < 1) return false;

            for (var k = 0; k < 9; k++) if (sudoku[i][j] == sudoku[k][j] && k != i) return false;

            for (var k = 0; k < 9; k++) if (sudoku[i][j] == sudoku[i][k] && k != j) return false;

            var boxrow = i - i % 3;
            var boxcol = j - j % 3;
            for (var k = 0; k < 3; k++) {
                for (var l = 0; l < 3; l++) {
                    if (sudoku[k + boxrow][l + boxcol] == sudoku[i][j] && (k + boxrow != i || l + boxcol != j))
                        return false;
                }
            }

        }
    }
    return true;
}

async function solve(sudoku, row, col) {
    if (row == 9) {
        // show(sudoku);
        return true;
    }
    if (col == 9)
        return solve(sudoku, row + 1, 0);

    if (sudoku[row][col] > 0)
        return solve(sudoku, row, col + 1);

    for (var i = 1; i < 10; i++) {
        const res = await valid(sudoku, row, col, i);
        if (res) {
            await delay();
            document.getElementById(String(row) + String(col)).value = i;
            sudoku[row][col] = i;
            const correct = await solve(sudoku, row, col + 1);
            if (correct)
                return true;
            await delay();
        }
    }
    sudoku[row][col] = 0;
    document.getElementById(String(row) + String(col)).value = 0;
    return false;
}

async function valid(sudoku, row, col, num) {

    for (var i = 0; i < 9; i++) if (sudoku[row][i] == num) return false;

    for (var i = 0; i < 9; i++) if (sudoku[i][col] == num) return false;

    var boxrow = row - row % 3;
    var boxcol = col - col % 3;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (sudoku[i + boxrow][j + boxcol] == num)
                return false;
        }
    }
    return true;
}

async function game() {
    if (strt == false) {
        times = setInterval(time, 1000);
        strt = true;
        var sudoku = [[]];
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                const val = document.getElementById(String(i) + String(j)).value
                sudoku[i].push(Number(val));
            }
            sudoku.push([]);
        }

        var cnt = 0;

        while (cnt < 10) {
            var a = Math.floor((Math.random()) * 10);
            if (a == 9) a = 2;
            var b = Math.floor((Math.random()) * 10);
            if (b == 9) b = 7;
            var c = Math.floor((Math.random()) * 10);
            if (c == 0) c = 5;

            if (sudoku[a][b] == 0 && await valid(sudoku, a, b, c)) {
                document.getElementById(String(a) + String(b)).value = c;
                sudoku[a][b] = c;
                cnt++;
            }


        }

    }
    else {
        clear();
    }

}

async function submit() {
    var sudoku = [[]];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            const val = document.getElementById(String(i) + String(j)).value

            sudoku[i].push(Number(val));

        }
        sudoku.push([]);
    }

    var won = finalCheck(sudoku);
    clearInterval(times);
    if (won) alert("You won the game!")
    else alert("You lose");

}



async function time() {
    a--;
    var b = Math.floor(a / 60);
    var c = a % 60;
    if (b < 10)
        minu.innerHTML = '0' + String(b);
    else minu.innerHTML = String(b);
    if (c < 10)
        secs.innerHTML = '0' + String(c);
    else secs.innerHTML = String(c);

    if (c == 0 && b == 0) {
        alert("Time's Up!");
        clearInterval(times);
    }

}

async function clear() {
    strt = false;
    clearInterval(times);
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            document.getElementById(String(i) + String(j)).value = 0;

    a = 1801;
    game();
}
