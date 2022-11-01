import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT: 3 = 3;
const COL_COUNT: 3 = 3;

enum Move {
    x = 'X',
    o = 'O'
}

type CellValue = '' | Move

type Board = [
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue],
]

let boardState: Board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];


let currentMove: Move = Move.x;
let winner: CellValue | 'Draw' = ""

type Coordinate = [number, number]
type Victory = [Coordinate, Coordinate, Coordinate]
const victories: Victory[] = [
    [
        [0, 0],
        [0, 1],
        [0, 2],
    ],
    [
        [1, 0],
        [1, 1],
        [1, 2],
    ],
    [
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 0],
        [2, 0],
    ],
    [
        [0, 1],
        [1, 1],
        [2, 1],
    ],
    [
        [0, 2],
        [1, 2],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 1],
        [2, 2],
    ],
    [
        [0, 2],
        [1, 1],
        [2, 0],
    ],
];

function checkWinner() {

    let isDraw = true
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COL_COUNT; j++) {
            if (boardState[i][j] === '') isDraw = false
        }
    }

    if (isDraw) return "Draw";

    for (let victory of victories) {
        const cell1 = boardState[victory[0][0]][victory[0][1]];
        const cell2 = boardState[victory[1][0]][victory[1][1]];
        const cell3 = boardState[victory[2][0]][victory[2][1]];
        if (cell1 !== "" && cell1 === cell2 && cell2 === cell3) {
            return cell1;
        }
    }

    return "";
}

function createCell(row: number, col: number, content: CellValue = "") {
    const cell = document.createElement("button");
    cell.setAttribute("data-row", row.toString());
    cell.setAttribute("data-col", col.toString());
    cell.setAttribute("data-content", content);
    cell.classList.add("cell");
    cell.addEventListener('click', () => {
        if (winner) return;

        if (boardState[row][col] === '') {
            boardState[row][col] = currentMove;
            cell.innerText = currentMove
            currentMove = currentMove === Move.x ? Move.o : Move.x
            renderBoard()
            winner = checkWinner()
        }
    })
    return cell;
}

function renderBoard() {
    if (!appElement) throw new Error("Cannot find app");
    if (!boardElement) throw new Error("Cannot find board");
    boardElement.innerHTML = "";
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COL_COUNT; j++) {
            boardElement.appendChild(createCell(i, j, boardState[i][j]));
        }
    }
    const oldMoveElement = document.getElementById("move-element");
    if (oldMoveElement) {
        oldMoveElement.remove();
    }
    const moveElement = document.createElement("p");
    moveElement.id = "move-element";
    moveElement.innerText = winner ? `Winner: ${winner}!` : `Next Move: ${currentMove}`;
    moveElement.classList.add("current-move");
    appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
    const resetButton = document.getElementById("reset");
    if (!resetButton) throw new Error("No Reset button");
    resetButton.addEventListener("click", () => {
        boardState = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        currentMove = Move.x;
        winner = ''
        renderBoard();
    });
    renderBoard();
}

init();
