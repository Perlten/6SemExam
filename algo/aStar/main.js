const GRID_SIZE = 40;
const WIDTH = 800;
const HEIGHT = 800;
const NODES_IN_ROW = (WIDTH / GRID_SIZE) + 1;

let startNode = null;
let endNode = null;

nodeArray = [];

let eventContainer;

function handleAStart() {
  for (let node of nodeArray) {
    node.visited = false;
    node.globalGoal = Infinity;
    node.localGoal = Infinity;
    node.parrent = null;
    node.isLine = false;
  }

  currentNode = startNode;
  startNode.localGoal = 0;
  startNode.globalGoal = heuristic(startNode, endNode);

  nodesNotTested = [startNode];
  while (nodesNotTested.length > 0 && currentNode != endNode) {
    nodesNotTested.sort((a, b) => a.globalGoal - b.globalGoal);

    while (nodesNotTested.length > 0 && nodesNotTested[0].visited) {
      nodesNotTested.shift();
    }

    if (nodesNotTested.length < 1) {
      break;
    }

    currentNode = nodesNotTested[0];
    currentNode.visited = true;

    for (let neighbour of currentNode.neighbourNodes) {

      if (!neighbour.visited && !neighbour.isObstacle) {
        nodesNotTested.push(neighbour);
      }

      let possibleLowerDistance = currentNode.localGoal + distance(currentNode, neighbour);
      if (possibleLowerDistance < neighbour.localGoal) {
        neighbour.parrent = currentNode;
        neighbour.localGoal = possibleLowerDistance;

        neighbour.globalGoal = neighbour.localGoal + heuristic(neighbour, endNode);
      }
    }
  }
}

function distance(nodeA, nodeB) {
  let triangleWidth = Math.abs(nodeA.x - nodeB.x);
  let triangleHeight = Math.abs(nodeA.y - nodeB.y);
  let res = Math.sqrt(Math.pow(triangleWidth, 2) + Math.pow(triangleHeight, 2));
  return res;
}

function heuristic(nodeA, nodeB) {
  if (eventContainer.isAStar) {
    if (eventContainer.heuristic == "0") {
      return distance(nodeA, nodeB);
    } else if (eventContainer.heuristic == "1") {
      let D = GRID_SIZE;
      let D2 = Math.sqrt(Math.pow(GRID_SIZE, 2) + Math.pow(GRID_SIZE, 2));
      let dx = abs(nodeA.x - nodeB.x)
      let dy = abs(nodeA.y - nodeB.y)
      return D * (dx + dy) + (D2 - 2 * D) * min(dx, dy)
    }
  } else {
    return 0;
  }
}


function setup() {
  eventContainer = new EventContainer();
  createCanvas(WIDTH, HEIGHT);
  setupGrid();
  connectNodes();

  startNode = nodeArray[0];
  endNode = nodeArray[nodeArray.length - 1];
  handleAStart();
}

function draw() {
  eventContainer.handleEvents();
  for (let node of nodeArray) {
    node.draw();
  }
  if (endNode.parrent) {
    let currentNode = endNode.parrent;
    while (currentNode != startNode) {
      currentNode.isLine = true;
      currentNode = currentNode.parrent;
    }
  }
}

function mouseClicked() {
  let index = getIndexFromCordinate(mouseX, mouseY);
  if (index == -1) {
    return;
  }
  if (eventContainer.ctrlPressed) {
    endNode = nodeArray[index];
  } else if (eventContainer.shiftPressed) {
    startNode = nodeArray[index];
  } else {
    nodeArray[index].isObstacle = !nodeArray[index].isObstacle;
  }
  handleAStart();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function setupGrid() {
  for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
    for (let x = 0; x < WIDTH; x += GRID_SIZE) {
      let node = new Node(x, y);
      if (getRandomInt(2) == 0) {
        node.isObstacle = true;
      }
      nodeArray.push(node);
    }
  }
}

function connectNodes() {
  let i = 0;
  for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
    for (let x = 0; x < WIDTH; x += GRID_SIZE) {
      let currentIndex = getIndexFromCordinate(x, y);
      if (currentIndex == -1) {
        return;
      }
      let currentNode = nodeArray[currentIndex];
      if (y > 0) {
        let aboveIndex = currentIndex - NODES_IN_ROW;
        currentNode.neighbourNodes.push(nodeArray[aboveIndex + 1]);
      }
      if (y < HEIGHT - GRID_SIZE) {
        let belowIndex = currentIndex + NODES_IN_ROW - 1;
        currentNode.neighbourNodes.push(nodeArray[belowIndex]);
      }
      if (x > 0) {
        let leftIndex = currentIndex - 1;
        currentNode.neighbourNodes.push(nodeArray[leftIndex]);
      }
      if (x < WIDTH - GRID_SIZE) {
        let rightIndex = currentIndex + 1;
        currentNode.neighbourNodes.push(nodeArray[rightIndex]);
      }
      if (y > 0 && x > 0) {
        let topLeftIndex = currentIndex - NODES_IN_ROW;
        currentNode.neighbourNodes.push(nodeArray[topLeftIndex]);
      }
      if (y > 0 && x < WIDTH - GRID_SIZE) {
        let topRightIndex = currentIndex - NODES_IN_ROW + 2;
        currentNode.neighbourNodes.push(nodeArray[topRightIndex]);
      }
      if (y < HEIGHT - GRID_SIZE && x > 0) {
        let buttomLeftIndex = currentIndex + NODES_IN_ROW - 2;
        currentNode.neighbourNodes.push(nodeArray[buttomLeftIndex]);
      }
      if (y < HEIGHT - GRID_SIZE && x < WIDTH - GRID_SIZE) {
        let buttomRightIndex = currentIndex + NODES_IN_ROW;
        currentNode.neighbourNodes.push(nodeArray[buttomRightIndex]);
      }
    }
  }
}

function getIndexFromCordinate(x, y) {
  if ((x < 0 || x > WIDTH) || (y < 0 || y > HEIGHT)) {
    return -1;
  }
  let NODES_IN_ROW = (WIDTH / GRID_SIZE);
  let xTemp = Math.floor(x / GRID_SIZE);
  let yTemp = Math.floor(y / GRID_SIZE);
  let index = (yTemp * NODES_IN_ROW) + xTemp
  return index;
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.parrent = null;
    this.isObstacle = false;
    this.localGoal = Infinity;
    this.globalGoal = Infinity;
    this.visited = false;
    this.neighbourNodes = [];
    this.isLine = false;
  }


  draw() {
    stroke(0, 0, 255);
    if (this.isObstacle) {
      fill(0, 0, 0);
    } else if (this == startNode) {
      fill(0, 255, 0);
    } else if (this == endNode) {
      fill(255, 0, 0);
    } else if (this.visited) {
      fill(0, 0, 255);
    } else {
      fill(255, 255, 255);
    }

    if (this.isLine) {
      fill(255, 255, 0);
    }

    rect(this.x, this.y, GRID_SIZE, GRID_SIZE);
    // for (let n of this.neighbourNodes) {
    //   let offset = GRID_SIZE / 2;
    //   stroke(255, 0, 0);
    //   line(this.x + offset, this.y + offset, n.x + offset, n.y + offset);
    // }
  }
}

class EventContainer {
  constructor() {
    this.shiftPressed = false;
    this.ctrlPressed = false;

    this.isAStar = true;
    this.heuristic = "1";


    this.algoButton = createButton("Change algorithm");
    this.algoButton.position(WIDTH + 25, 20);
    this.algoButton.mousePressed(() => {
      this.isAStar = !this.isAStar;
      handleAStart();
    });
  }

  handleEvents() {
    let newHeuristic = document.querySelector('input[name="heuristic"]:checked').value;
    if (newHeuristic != this.heuristic) {
      this.heuristic = newHeuristic;
      handleAStart();
    }
    let algoText = "Current algorithm: "
    if (this.isAStar) {
      algoText += "A*"
    } else {
      algoText += "Dijkstra"
    }
    
    document.getElementById("currentAlgo").innerText = algoText
    this.ctrlPressed = keyIsDown(17);
    this.shiftPressed = keyIsDown(16);
  }
}