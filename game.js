const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
ctx.canvas.width = window.innerWidth-20;
ctx.canvas.height =window.innerWidth;
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;
let grid = createGrid(numRows, numCols, 0);
let isRunning = false;
let speed = 100;
let ruleSet = 0;
let lineColor = '#aaffaa';
let aliveColor = '#ffffff';
let backgroundColor = '#000000';
let stencil = "cell";
let stencilArray = ['cell', 'glider', 'tub', 'beehive', 'boat', 'toad', 'lwss', 'mwss', 'hwss', 'pulsar', 'block', 'gliderGun'];
let isRandom = 0;

let frame = 0;
var numAlive = 0;
var numDead = 0;

let sideBar = 1;
toggleSideBar();

let seedArray = [];



const shapes = {
  'glider': [
      [[0, 0, 1], [1, 0, 1], [0, 1, 1]]
      
  ],
  'tub': [
      [[0, 1, 0], [1, 0, 1], [0, 1, 0]]
  ],
  'block': [
      [[1, 1], [1, 1]]
  ],
  'beehive': [
    [[0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 1, 0]]
    
  ], 
  'boat': [
    [[1, 1, 0], [1, 0, 1], [0, 1, 0]]
    
  ],
  'toad': [
    [[0, 1, 1, 1], [1, 1, 1, 0]]
   
    
  ],
  'lwss': [
    [[0, 1, 0, 0, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]]
    
],
'mwss': [
    [[0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 0]]
    
], 
'hwss': [
  [[0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0],
    ]
], 
'pulsar': [
  [[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]]
], 

'block':
[
  [[1, 1], [1, 1]]
],


'gliderGun': [
  [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

]
};


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
    document.getElementById('numAlive').innerHTML = 'Living Cells: ' + numAlive;
    return grid;
    
  }


  function updateGrid(ruleSet){
    
    frame = frame + 1;
    document.getElementById('frame').innerHTML = 'Frame: '+ frame;

    document.getElementById('speedText').innerHTML = 'Delay: '+ speed + 'ms';
    

    let newGrid = createGrid(numRows, numCols, 0)

if(ruleSet == 0){
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


}else if(ruleSet == 1){
  for(i = 0; i < numRows; i++){
    for(j = 0; j < numCols; j++){
      let numNeighbors = countNeighbors(grid, i, j);

      if(grid[i][j] == 0 &&  (numNeighbors == 2 || numNeighbors == 5)){
        newGrid[i][j] = 1;
        
      }else if (grid[i][j] == 1 && ( numNeighbors == 2)){
        newGrid[i][j] = 1;
        
      }else if (grid[i][j] == 1 && (numNeighbors < 2 || numNeighbors > 3)){
        newGrid[i][j] = 0;
        
      }
    }
  }

  grid = newGrid;
}

    printAlive();
   
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

function printAlive(){
  numDead = 0;
  numAlive = 0;
  for(i = 0; i < numRows; i++){
    for(j = 0; j < numCols; j++){
      if(grid[i][j] == 1){
        numAlive++;
        
      }else{
        numDead++;
      }
    }
  }
  document.getElementById('numAlive').innerHTML = 'Living/Dead Cells: '+numAlive + " : "+numDead;
}

  function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}
  
  


  function renderGrid() {
    lineColor = invertColor(backgroundColor);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        ctx.fillStyle = grid[i][j] === 1 ? aliveColor : backgroundColor;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.3;
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

  function toggleCell(row, col, stencil) {
    
    if(stencil == 'cell'){
      grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    }else{
      const shape = shapes[stencil][stencilOrientation % shapes[stencil].length];

      for (let i = 0; i < shape.length; i++) {
          for (let j = 0; j < shape[i].length; j++) {
              if (shape[i][j] === 1) {
                  grid[row + i][col + j] = 1;
              } else {
                  grid[row + i][col + j] = 0;
              }
          }
      }
    }
  
    renderGrid();
}


function setStencil(set, s){
  stencilOrientation = 0;
  
  document.getElementById(set).style.backgroundColor = "gray";
  document.getElementById(set).style.color = "black";
  
  
  st = set.split('Button');



  for (let i = 0; i < stencilArray.length; i++) {
      if(stencilArray[i] != st[0]){
          document.getElementById(stencilArray[i]+'Button').style.backgroundColor = "black";
      
          document.getElementById(stencilArray[i]+'Button').style.color = "white";
          document.getElementById(stencilArray[i]+'Button').style.hover = "white";
    }
  
  }
  stencil = s;
  
}



function rotate90(a) {
	const w = a.length;
	const h = a[0].length;
	let b = new Array(h);

	for (let y=0; y<h; y++) {
	    b[y] = new Array(w);
		  for (let x=0; x<w; x++) {
			  b[y][x] = a[w-1-x][y];
		  }
	  }
	return b;
}

function stencilRotate(){
  shapes[stencil][0] = rotate90(shapes[stencil][0]);
  let shape = rotate90(shapes[stencil][0])
  /*
  stencilOrientation+=1;
  if(stencilOrientation > 3){
    stencilOrientation = 0;
  }

  
  let shape = shapes[stencil][stencilOrientation % shapes[stencil].length];
*/

  
  for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] === 1) {
              ctx.fillStyle = 'red';
              ctx.fillRect((cellX + j) * cellSize, (cellY + i) * cellSize, cellSize, cellSize);
          }
      }
      renderGrid();
  }
  
}

function setGlider(){
  setStencil('gliderButton', 'glider');
  stencilOrientation = 0;
}
function setCell(){
  setStencil('cellButton', 'cell')
}
function setTub(){
  setStencil('tubButton', 'tub')
}
function setBeehive(){
  setStencil('beehiveButton', 'beehive');
}
function setBoat(){
  setStencil('boatButton', 'boat');
}
function setToad(){
  setStencil('toadButton', 'toad');
}
function setPulsar(){
  setStencil('pulsarButton', 'pulsar');
}
function setLWSS(){
  setStencil('lwssButton', 'lwss');
}
function setMWSS(){
  setStencil('mwssButton', 'mwss');
}
function setHWSS(){
  setStencil('hwssButton', 'hwss');
}
function setBlock(){
  setStencil('blockButton', 'block')
}

function setGliderGun(){
  setStencil('gliderGunButton', 'gliderGun');
}

  //End Model

  //Controller

  function startStop(){
    if(!isRunning){
      startGame();
      
      
    }else if(isRunning){
      stopGame();
      
    }
  }
 
function startGame(){
  
    isRunning = true;
    intervalId = setInterval(() => {
      updateGrid(ruleSet);
    }, speed);
    document.getElementById('start').innerHTML = 'Stop';
    document.getElementById('start').style.background= 'Red';
    
}

function stopGame(){
      isRunning = false;
      if(intervalId){
        clearInterval(intervalId);
      }
      document.getElementById('start').innerHTML = 'Start';
      document.getElementById('start').style.background= 'Green';
      
}

  function moveForward(){
    stopGame();
    updateGrid(ruleSet);
  }
  

  function clearGrid() {
    
    document.getElementById('start').innerHTML = 'Start';
    grid = createGrid(numRows, numCols, 0);
    stopGame();
    renderGrid();
    
  }

  function speedDown(){
    
    if (speed < 1000) {
      speed += 10

      if(isRunning){
        stopGame();
        startGame();
      }
    }
    
  }

  function speedUp(){
    if (speed > 0) {
      speed -= 10
      
      if(isRunning){
        stopGame();
        startGame();
      }
    }
  }
    
  
function randomize(){
  clearGrid();
  startGame();
  stopGame();
  grid = createGrid(numRows, numCols, 1);
  renderGrid();
}



function changeBackgroundColor(){
  backgroundColor = document.getElementById('deadColor').value;
  renderGrid();
}


function changeAliveColor(){
  aliveColor = document.getElementById('setAlive').value;
  renderGrid();
}

function saveSeed() {
  if(seedArray.length <=11){
    document.getElementById('saveSeed').style.backgroundColor = '#333';
  
    let name = prompt("Name your seed");
    if(name){
      let seedDict = {
        name: name,
        grid: JSON.stringify(grid)
    };
    seedArray.push(seedDict);
    updateSeedList();
    localStorage.setItem('seedArray', JSON.stringify(seedArray));
    }
  }else{
    document.getElementById('saveSeed').style.backgroundColor = 'red';
  }
  
  
}

function loadSeed(index) {
  if (index >= 0 && index < seedArray.length) {
      let seedDict = seedArray[index];
      grid = JSON.parse(seedDict.grid);
      renderGrid();
  }
}

function updateSeedList() {
  const seedList = document.getElementById('seedList');
  seedList.innerHTML = '';
  seedArray.forEach((seedDict, index) => {
      let seedElement = document.createElement('li');
      seedElement.textContent = seedDict.name;
      seedElement.addEventListener('click', () => {
          loadSeed(index);
      });
      seedList.appendChild(seedElement);
  });
}

function clearSeeds() {
  seedArray = [];
  localStorage.removeItem('seedArray');
  updateSeedList();
  document.getElementById('saveSeed').style.backgroundColor = '#333';
}

// Load seeds from localStorage on page load
window.onload = function() {
  let savedSeeds = localStorage.getItem('seedArray');
  if (savedSeeds) {
      seedArray = JSON.parse(savedSeeds);
      updateSeedList();
  }
};






function clearSeeds(){
  seedArray = [];

  localStorage.clear();
  updateSeedList();
}

function forward(){
  updateGrid(ruleSet);
}

function changeRuleSet(){
if(ruleSet == 0){
  ruleSet = 1;
  document.getElementById('changeRuleSet').innerHTML = conwaysRules;
}else if(ruleSet == 1){
  ruleSet = 0;
  document.getElementById('changeRuleSet').innerHTML = ourRules;
}
}


function toggleSideBar() {
  if(sideBar == 0){
    document.getElementById("sideBar").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
    document.getElementById('openButton').style.right = '250px';
    document.getElementById('openButton').innerHTML = '&#62;';
    sideBar = 1;
  }else if(sideBar == 1){
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
    document.getElementById('openButton').style.right = '0';
    document.getElementById('openButton').innerHTML = '&#60;';
    sideBar = 0;
  }
  
}





  document.getElementById('clear').addEventListener('click', clearGrid);

  document.getElementById('forward').addEventListener('click', forward);

  document.getElementById('start').addEventListener('click', startStop);
  
  
  document.getElementById('speedUp').addEventListener('click', speedUp);
  document.getElementById('speedDown').addEventListener('click', speedDown);

  document.getElementById('random').addEventListener('click', randomize);

  document.getElementById('backgroundColor').addEventListener('click', changeBackgroundColor);
  document.getElementById('aliveColor').addEventListener('click', changeAliveColor);
  

  document.getElementById('saveSeed').addEventListener('click', saveSeed);
  document.getElementById('clearSeeds').addEventListener('click', clearSeeds);

  document.getElementById('changeRuleSet').addEventListener('click', changeRuleSet);


  document.getElementById('gliderButton').addEventListener('click', setGlider);
  document.getElementById('cellButton').addEventListener('click', setCell);
  document.getElementById('tubButton').addEventListener('click', setTub);
  document.getElementById('beehiveButton').addEventListener('click', setBeehive);
  document.getElementById('toadButton').addEventListener('click', setToad);
  document.getElementById('boatButton').addEventListener('click', setBoat);
  document.getElementById('pulsarButton').addEventListener('click', setPulsar);
  document.getElementById('lwssButton').addEventListener('click', setLWSS);
  document.getElementById('mwssButton').addEventListener('click', setMWSS);
  document.getElementById('hwssButton').addEventListener('click', setHWSS);
  document.getElementById('blockButton').addEventListener('click', setBlock)
  document.getElementById('gliderGunButton').addEventListener('click', setGliderGun)

  document.addEventListener('keydown', (e) => {
    if(e.keyCode == 82){
      stencilRotate();
      renderGrid();
    }
    if(e.keyCode == 49){
      setCell();
    }
    if(e.keyCode == 50){
      setGlider();
    }
    if(e.keyCode == 51){
      setTub();
    }
    if(e.keyCode == 52){
      setBeehive();
    }
    if(e.keyCode == 53){
      setBoat();
    }
    if(e.keyCode == 54){
      setToad();
    }
    if(e.keyCode == 55){
      setBlock();

    }
    if(e.keyCode == 56){
      setLWSS();
    }
    if(e.keyCode == 57){
      setMWSS();
    }
    if(e.keyCode == 48){
      setHWSS();
    }
    if(e.keyCode == 189){
      setPulsar();
    }
    if(e.keyCode == 32){
      e.preventDefault()
      startStop();
    }

  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    toggleCell(cellY, cellX, stencil);
  });
  

  let currentCell = { row: -1, col: -1 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    renderGrid();
    

    if(stencil == 'cell'){
      ctx.fillStyle = lineColor;
      ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
    }else{
      let shape = shapes[stencil][stencilOrientation % shapes[stencil].length];

    
      for (let i = 0; i < shape.length; i++) {
          for (let j = 0; j < shape[i].length; j++) {
              if (shape[i][j] === 1) {
                  ctx.fillStyle = lineColor;
                  ctx.fillRect((cellX + j) * cellSize, (cellY + i) * cellSize, cellSize, cellSize);
              }
          }
      }
    }
    
  
});
//endController
  renderGrid();