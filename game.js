const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;
let grid = createGrid(numRows, numCols, 0);
let isRunning = false;
let speed = 100;
let colorWheel = ['black','aqua', '#fa7', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']
let color = colorWheel[0];

//Model 
function createGrid(rows, cols, isRandom) {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        if(isRandom == 1){
          if(Math.floor(Math.random()*1000) <=400){
          
            row.push(1);
          }else{
            row.push(0);
          }
        }else if(isRandom == 0){
          row.push(0);
        }
        
      }
      grid.push(row);
    }
    return grid;
  }


  function updateGrid(){
    let newGrid = createGrid(numRows, numCols, 0)

    for(i = 0; i < numRows; i++){
      for(j = 0; j < numCols; j++){
        let numNeighbors = countNeighbors(grid, i, j)

        if(grid[i][j] == 0 && numNeighbors == 3){
          newGrid[i][j] = 1;
        }else if (grid[i][j] == 1 && (numNeighbors < 2 || numNeighbors > 3)){
          newGrid[i][j] = 0;
        }else if (grid[i][j] == 1 && (numNeighbors == 2 || numNeighbors == 3)){
          newGrid[i][j] = 1;
        }
        

      }
    }

    grid = newGrid;
    renderGrid();
  }

  function countNeighbors(grid, row, col){
    let count = 0;
    let numRows = grid.length;
    let numCols = grid[0].length;
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < numRows && j >= 0 && j < numCols && !(i === row && j === col)) {
              count += grid[i][j];
            }
          }
        }
        return count;
  }
  
  function renderGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        ctx.fillStyle = grid[i][j] === 1 ? 'white' : color;
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

  //End Model

  //Controller
  function startGame(){
    if(!isRunning){
      isRunning = true;
      intervalId = setInterval(() => {
        updateGrid();
      }, speed);
    }
  }


  function stopGame(){
    if(isRunning){
      isRunning = false;
      clearInterval(intervalId);
    }
  }


  function moveForward(){
    stopGame();
    updateGrid();
  }
  

  function clearGrid() {
    grid = createGrid(numRows, numCols, 0);
    renderGrid();
  }

  function speedDown(){
  document.getElementById('speed').innerHTML = 'Speed: '+speed +'ms';

    //slow down

    //Change 'speed' variable to make interval faster. 
    //Note: higher speed value, slower frame change
    //Speed = 10 is faster than speed = 1000

    
  }

  function speedUp(){
    
    //speed up

    //Change 'speed' variable to make interval faster. 
    //Note: higher speed value, slower frame change
    //Speed = 10 is faster than speed = 1000
  }
  
function randomize(){
  clearGrid();
  grid = createGrid(numRows, numCols, 1);
  renderGrid();
}

let nextColor = 1

function changeColor(){
  color = colorWheel[nextColor]
  nextColor += 1;
  if(nextColor == colorWheel.length){
    nextColor = 0
  }
  
  renderGrid();
}


  document.getElementById('clear').addEventListener('click', clearGrid);

  document.getElementById('forward').addEventListener('click', moveForward);

  document.getElementById('start').addEventListener('click', startGame);
  document.getElementById('stop').addEventListener('click', stopGame);
  
  document.getElementById('speedUp').addEventListener('click', speedUp);
  document.getElementById('speedDown').addEventListener('click', speedDown);

  document.getElementById('random').addEventListener('click', randomize);

  document.getElementById('backgroundColor').addEventListener('click', changeColor);
  
  
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    toggleCell(cellY, cellX);
  });
  
//endController
  renderGrid();