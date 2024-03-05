const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;
let grid = createGrid(numRows, numCols);


function createGrid(rows, cols) {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    return grid;
  }
  
  function renderGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        ctx.fillStyle = grid[i][j] === 1 ? '#fff' : '#000';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i <= numRows; i++) {
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
    }
    for (let j = 0; j <= numCols; j++) {
      ctx.moveTo(j * cellSize, 0);
      ctx.lineTo(j * cellSize, canvas.height);
    }
    ctx.stroke();
    
  }

  function toggleCell(row, col) {
    grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    renderGrid();
  }

  function clearGrid() {
    grid = createGrid(numRows, numCols);
    renderGrid();
  }

  document.getElementById('clear').addEventListener('click', clearGrid);

  
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    toggleCell(cellY, cellX);
  });
  

  renderGrid();