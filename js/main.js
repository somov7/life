window.onload = () => {
    init();
    renderCycle();
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const GRID_W = 20;
const GRID_H = 20;
const THRESHOLD = 0.5;

let rows, cols, w, h;

let grid;

async function renderCycle() {
    ctx.save();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.fillStyle = grid[r][c] ? 'white' : 'black';
            ctx.fillRect(c * GRID_W, r * GRID_H, GRID_W, GRID_H);
        }
    }
    await new Promise(r => setTimeout(r, 100));
    nextGeneration();
    cnt = grid.reduce((accum, row) => accum + row.reduce((acc, cell) => acc + cell, 0), 0);
    if(cnt === 0) {
        init();
    }
    window.requestAnimationFrame(renderCycle);
}

function init() {
    w = window.screen.width;
    h = window.screen.height;
    cols = w / GRID_W;
    rows = h / GRID_H;
    canvas.width = w;
    canvas.height = h;
    grid = Array(rows).fill(null).map(() => Array(cols));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c] = Math.random() > THRESHOLD;
        }
    }
}

function countLiveNeighbours(r, c) {
    let result = 0;
    for (let y = Math.max(r - 1, 0); y < Math.min(r + 2, rows); y++) {
        for (let x = Math.max(c - 1, 0); x < Math.min(c + 2, cols); x++) {
            if (y === 0 && x === 0)
                continue;
            result += grid[y][x];
        }
    }
    return result;
}

function nextGeneration() {
    let newGrid = Array(rows).fill(null).map(() => Array(cols));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cnt = countLiveNeighbours(r, c);
            newGrid[r][c] = (grid[r][c] && cnt >= 2 && cnt <= 3) || (!grid[r][c] && cnt === 3)
        }
    }
    grid = newGrid;
}

window.onclick = (ev) => {
    let r = Math.floor(ev.y / GRID_H);
    let c = Math.floor(ev.x / GRID_W);
    console.log(grid[r][c]);
    grid[r][c] = true;
}

window.onkeypress = (ev) => {
    if (ev.key === 'r') {
        init();
    }
}
