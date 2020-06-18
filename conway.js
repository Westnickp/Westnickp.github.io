var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var numDivisionsInput = document.getElementById("numCells");
var id, isPlaying = false;
canvas.style.border = "1px solid grey";
ctx.fillStyle = "white";
ctx.strokeStyle = "1px grey";
ctx.lineWidth = 1;

var currentGrid = generateEmptyGrid(.7);
paintGridOnCanvas(currentGrid);

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}

canvas.addEventListener('mousedown', function(e) {
  let mousePosition = getCursorPosition(canvas, e);
  let cellWidth = canvas.height/numDivisionsInput.value;
  mousePosition[0] -= mousePosition[0] % cellWidth;
  mousePosition[1] -= mousePosition[0] % cellWidth;
  let col = Math.round(mousePosition[0]/cellWidth);
  let row = Math.round(mousePosition[1]/cellWidth);
  currentGrid[row][col] = 1 - currentGrid[row][col];
  paintGridOnCanvas(currentGrid);
});

function playButton() {
  if (isPlaying !== true) {
    id = setInterval(nextGrid, 200);
    isPlaying = true;
  }
}

function pauseButton() {
  clearInterval(id);
  isPlaying = false;
}

function generateEmptyGrid() {
  let cellsAcross = numDivisionsInput.value;
  let grid = [];
  for (let i = 0; i < cellsAcross; i++) {
    let thisRow = [];
    for (let j = 0; j < cellsAcross; j++) {
      thisRow.push(0);
    }
    grid.push(thisRow);
  }
  currentGrid = grid;
  return grid;
}
function generateRandomGrid(scarcity) {
  if (scarcity === undefined) scarcity = .7;
  let cellsAcross = numDivisionsInput.value;
  let grid = [];
  for (let i = 0; i < cellsAcross; i++) {
    let thisRow = [];
    for (let j = 0; j < cellsAcross; j++) {
      thisRow.push(Math.round(Math.random()*scarcity));
    }
    grid.push(thisRow);
  }
  currentGrid = grid;
  return grid;
}

function paintGridOnCanvas(grid) {
  let cellsAcross = numDivisionsInput.value;
  let delta = canvas.height/cellsAcross;
  for (let i = 0; i < cellsAcross; i++) {
    for (let j = 0; j < cellsAcross; j++) {
      if (grid[i][j] === 0) {
        ctx.fillStyle = "firebrick";
        ctx.fillRect(j*delta, i*delta, delta, delta);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(j*delta, i*delta, delta, delta);
      }
    }
  }
}

function nextGrid() {
  let myCopy = [];
  for (let i = 0; i < currentGrid.length; i++) {
    myCopy.push(currentGrid[i].slice(0));
  }
  let maxNumRows = myCopy.length, maxNumCols = myCopy[0].length;
  for (let i = 0; i < maxNumRows; i++) {
    for (let j = 0; j < maxNumCols; j++) {
      let neighborCount = 0;
      for (let ii = -1; ii < 2; ii++) {
        for (let jj = -1; jj < 2; jj++) {
          if (ii === 0 && jj === 0) continue;
          neighborCount += currentGrid[(i+ii+maxNumRows)%maxNumRows][(j+jj+maxNumCols)%maxNumCols];
        }
      }
      if (currentGrid[i][j] === 1) {
        if (neighborCount < 2) myCopy[i][j] = 0;
        else if (neighborCount > 3) myCopy[i][j] = 0;
        else continue;
      }
      else {
        if (neighborCount === 3) myCopy[i][j] = 1;
      }
    }
  }
  currentGrid = myCopy;
  paintGridOnCanvas(currentGrid);
}
