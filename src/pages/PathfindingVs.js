import React,{useEffect, useState} from 'react'
import '../styling/pathfinding.css';
import Basic_maze from '../Algos/maze/Basic_maze';
import BFS from '../Algos/path/Bfs';
import DFS from '../Algos/path/Dfs';
import Dijkstra from '../Algos/path/Dijkstra';
import random_maze from '../Algos/maze/random_maze';
import Navbar from '../components/Nav';
import Modal from '../components/Modal';

/*
super(props);// call the super class constructor and pass in the props parameter
*/

var rows = 17;
var cols = 31;

var START_NODE_ROW = 4, START_NODE_COL = 6;
var END_NODE_ROW = rows-6, END_NODE_COL = cols-6;
var InitSR = START_NODE_ROW, InitSC = START_NODE_COL;
var InitER = END_NODE_ROW, InitEC = END_NODE_COL;

var animateTime = 35; // 8,35,80

function App(){
    const [Grid,setGrid] = useState([]);  // array destructuring
    const [isMousePress,setIsMousePress] = useState(false);
    const [mazeID,setMazeID] = useState(0);
    const [pathID,setPathID] = useState(0);
    const [animateType,setAnimateTimeType] = useState(2);
    const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);


    useEffect(()=>{
        gridInitialize();
        popupClickHandle();
    },[])

    const openInfoPopup = (algorithm) => {
        setSelectedAlgorithm(algorithm);
        setIsInfoPopupOpen(true);
      };

      const closeInfoPopup = () => {
        setSelectedAlgorithm(null);
        setIsInfoPopupOpen(false);
      };

    const gridInitialize =()=>{
        var grid = new Array(rows);
        for(let i=0; i<rows; i++) grid[i] = new Array(cols);

        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                grid[i][j] = new Spot(i,j);
            }
        }
        /* -- add neighbors of each node ---
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                grid[i][j].getNeighbors(grid);
            }
        } */
        setGrid(grid);
    }
    // animate the algorithm
    async function animateVisitedNodes(visitedNodes){
        for(let i=0; i<visitedNodes.length; i++){
            const node = visitedNodes[i];
            await waitForAnimatoin(animateTime);
            if(node.x === START_NODE_ROW && node.y === START_NODE_COL)
            document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited START_NODE";

            else if(node.x === END_NODE_ROW && node.y === END_NODE_COL)
            document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited END_NODE";

            else document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited";
        }
    }
    async function animateShortestPath(pathNode){
        pathNode.reverse();
        for(let i=0; i<pathNode.length; i++){
            const node = pathNode[i];
            await waitForAnimatoin(animateTime);
            if(i===0) 
            document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath START_NODE";
            else if(i+1 === pathNode.length) 
            document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath END_NODE";
            else document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath";
        }
    }

    const pathFinding = async () =>{
        var btns = document.getElementsByClassName('button-4');
        document.getElementsByTagName('select')[0].disabled = true;
        document.getElementsByTagName('select')[1].disabled = true;
        for(let i=0; i<btns.length; i++){
            btns[i].disabled = true;
        }

        var startNode = Grid[START_NODE_ROW][START_NODE_COL];
        var endNode = Grid[END_NODE_ROW][END_NODE_COL];

        switch(pathID){
            case 1:
                var obj = BFS(Grid,startNode,endNode,rows,cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
            break;
            case 2:
                obj = DFS(Grid,startNode,endNode,rows,cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
            break;
            case 3:
                obj = Dijkstra(Grid,startNode,endNode,rows,cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
            break;
            default:
            //     obj = Astar(Grid,startNode,endNode,rows,cols);
            //     await animateVisitedNodes(obj.close_list);
            //     await animateShortestPath(obj.path);
            // break;
        }
        document.getElementsByTagName('select')[0].disabled = false;
        document.getElementsByTagName('select')[1].disabled = false;
        for(let i=0; i<btns.length; i++){
            btns[i].disabled = false;
        }
    }

    const mazeGenerator = async (ar) =>{
        for(var i=0; i<ar.length; i++){
            if((ar[i].r===START_NODE_ROW && ar[i].c===START_NODE_COL) || 
            (ar[i].r===END_NODE_ROW && ar[i].c===END_NODE_COL)) continue;
                await waitForAnimatoin(animateTime);
                createWall(ar[i].r,ar[i].c);
        }
    }
    const makeAllCellAsAWall = () =>{
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                if(!((i===START_NODE_ROW && j===START_NODE_COL) || (i===END_NODE_ROW && j===END_NODE_COL))){
                    createWall(i,j);
                }
            }
        }
    }
    const mazeHandle = async () =>{        
        var arr = [];
        switch(mazeID){
            case 1:
                arr = Basic_maze(rows,cols);
                mazeGenerator(arr);
            break;
            case 2:
                makeAllCellAsAWall();
                arr = random_maze(rows,cols);
                mazeGenerator(arr);
            break;
            // case 3: // recursive division
            //     arr = recursiveDivision(rows,cols);
            //     mazeGenerator(arr);
            // break;
            default:
        }
    }
    const clearPathHandle = () =>{
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                if(i===START_NODE_ROW && j===START_NODE_COL){
                    document.getElementById(`row${i}_col${j}`).className = "square START_NODE";
                }
                else if(i===END_NODE_ROW && j===END_NODE_COL){
                    document.getElementById(`row${i}_col${j}`).className = "square END_NODE";
                }
                else if(!Grid[i][j].isWall)
                document.getElementById(`row${i}_col${j}`).className = "square";
            }
        }
    }

    const createWall=(row,col)=>{
        /*
            ********* the concept should be known array reference and copy *****
        */
        var newGrid = [...Grid] // array copy
        var node = newGrid[row][col];
        node.isWall = !node.isWall;
        newGrid[row][col] = node;
        setGrid(newGrid);
    }

    const onMouseDown = (row,col)=>{
        if(isValid(row,col)){
            setIsMousePress(true);
            createWall(row,col);
        }
    }
    const onMouseEnter = (row,col)=>{
        if(isMousePress === true && isValid(row,col)){
            createWall(row,col);
        }
    }
    const onMouseUp = ()=>{
        setIsMousePress(()=>false);
    }
    const animationTimeHandle = (type) =>{
        if(type === 1) animateTime = 8;
        else if(type === 2) animateTime = 35;
        else animateTime = 80;
        setAnimateTimeType(type);
    }

    const setStartEndNode = (id, r, c) =>{
        if(id === 1){
            let newGrid = [...Grid] // array copy
            let preStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
            let curStartNode = newGrid[r][c];
            preStartNode.isStart = !preStartNode.isStart;
            curStartNode.isStart = !curStartNode.isStart;
            setGrid(newGrid);

            START_NODE_ROW = r;
            START_NODE_COL = c;
        }
        else{
            let newGrid = [...Grid] // array copy
            let preEndNode = newGrid[END_NODE_ROW][END_NODE_COL];
            let curEndNode = newGrid[r][c];
            preEndNode.isEnd = !preEndNode.isEnd;
            curEndNode.isEnd = !curEndNode.isEnd;
            setGrid(newGrid);

            END_NODE_ROW = r;
            END_NODE_COL = c;
        } 
    }
    const popupClickHandle = () =>{
        var blur = document.getElementById("Container-blur");
        blur.classList.toggle('active');
        var popup = document.getElementById("popup");
        popup.classList.toggle('unActive');
    }

    return (
    <>
<Modal style={{border: "1px solid #334155", paddingBottom: "20px"}} popupClickHandle={popupClickHandle}>
  <div className="modal-content">
    <h3>Welcome to Path Finder Visualizer</h3>
    <p>
      This project allows you to visualize pathfinding algorithms and mazes. Explore the world of algorithms and have fun!
    </p>
    <p>
      Discover the power of algorithms:
    </p>
    <ul>
      <li><b>Breadth-First Search (BFS):</b> A graph traversal algorithm that explores all vertices in breadth-first order.</li>
      <li><b>Depth-First Search (DFS):</b> Another graph traversal algorithm that explores as far as possible along each branch before backtracking.</li>
      <li><b>Dijkstra's Algorithm:</b> A popular algorithm for finding the shortest path between nodes in a weighted graph.</li>
    </ul>
    <div style={{display:"flex",justifyContent:"center"}}>
      {/* Add any additional content here */}
      {/* <iframe width="90%" height="300px" src="https://www.youtube.com/embed/iK95rIRVbMo?autoplay=1&mute=1" title='myVideo'></iframe> */}
    </div>
  </div>
</Modal>

    <div id="Container-blur">
        <Navbar msg='Path Finder Visualizer'></Navbar>
        <div className='path-container'>
            <div className='path-header'>
                    <div>
                        <div style={{"display":"flex","margin":"6px auto"}}>
                            <div>
                                <button className='button-4 start-btn' onClick={pathFinding}>Press here to Visualize</button>
                            </div>
                            <div>
                                <select className='my-drop-down' value={pathID} onChange={(e)=>{setPathID(parseInt(e.target.value))}}>
                                <option className='my-drop-down-option' disabled value="0">Select Algorithm</option>
                                    <option value="1">Breadth-First Search</option>
                                    <option value="2">Depth-First Search</option>
                                    <option value="3">Dijkstra Algorithm</option>
                                </select>
                                {pathID !== 0 && (
                                <button className='button-4 more-info-btn' onClick={() => openInfoPopup(pathID)}>
                                            More Info
                                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='path-speed-btns'>
                            <button className={`button-1 ${animateType===1 && 'curr-speed-btn'}`} onClick={()=>animationTimeHandle(1)}>Fast</button>
                            <button className={`button-1 ${animateType===2 && 'curr-speed-btn'}`} onClick={()=>animationTimeHandle(2)}>Average</button>
                            <button className={`button-1 ${animateType===3 && 'curr-speed-btn'}`} onClick={()=>animationTimeHandle(3)}>Slow</button>
                        </div>
                    </div>
                    <div>
                        <div style={{"display":"flex","margin":"6px auto"}}>
                            <select className='my-drop-down' value={mazeID} onChange={(e)=>{setMazeID(parseInt(e.target.value))}}>
                                <option className='my-drop-down-option' disabled value="0">Select Maze</option>
                                <option value="1">Random maze</option>
                                <option value="2">Random Recursive Maze</option>
                                {/* <option value="3">Recursive division</option> */}
                                {/* <option value="4">Kruskal's algorithm</option>
                                <option value="5">Prim's algorithm</option> */}
                            </select>
                            <button className='button-4 start-maze-btn' onClick={mazeHandle}>Create Maze</button>
                            <button className='button-4' onClick={gridInitialize}>Clear walls</button>
                        </div>
                        <div style={{"display":"flex"}}>
                            <button className='button-4' onClick={clearPathHandle}>Clear path</button>
                            <button className='button-4' onClick={()=>{
                                START_NODE_ROW = InitSR;
                                START_NODE_ROW = InitSC;
                                END_NODE_ROW = InitER;
                                END_NODE_COL = InitEC;
                                clearPathHandle();
                                gridInitialize();
                            }}>
                                Reset board
                            </button>
                        </div>
                    </div>
            </div>
            <div className='grid'>
                <div onMouseLeave={()=>{setIsMousePress(false)}}>
                {/* JSX Node Of Grid (2D Array) */}
                {Grid.map((R,idx_r)=>{
                return (<div key={idx_r} className='ROW'>
                            {R.map((Value,idx_c)=>{
                                    const {x,y,isStart,isEnd,isWall} = Value;
                                    return <Node key={idx_c} 
                                    pv={{x,y,isStart,isEnd,isWall,onMouseDown,onMouseEnter,onMouseUp,setStartEndNode}}>
                                    </Node>
                                })
                            }
                        </div>)
                })}
                </div>
            </div>
        </div>
    </div>
    {isInfoPopupOpen && (
    <div className="info-popup">
      <h3>Algorithm Information</h3>
      {selectedAlgorithm === 1 && (
        <p><b>Breadth-First Search</b> is a fundamental graph traversal algorithm used to explore and analyze the structure of a graph or tree. 
        It operates in a way that explores all the vertices (nodes) at the current depth level before moving on to the vertices at the next depth level.
         BFS is often used to find the shortest path from a starting node to a target node in unweighted graphs or to perform level-order traversals in trees.
         
<b>Characteristics:</b>
<li><b>Queue-Based:</b> BFS uses a queue data structure to keep track of nodes to visit. The nodes are initially placed in the queue based on their distance from the starting node.</li>
<li><b>Level-Order Traversal:</b> BFS explores nodes level by level, starting from the initial node and moving outward. It ensures that all nodes at the current level are visited before moving to the next level.</li>
<li><b>Shortest Path:</b> When BFS is used to find the shortest path between two nodes in an unweighted graph, it guarantees that the first path it finds is the shortest.</li></p>
      )}

      {selectedAlgorithm === 2 && (
        <p> <b>Depth-First Search</b> is a fundamental graph traversal algorithm used to explore and analyze the structure of a graph or tree.
         Unlike Breadth-First Search (BFS), which explores all neighbors of a node before moving on to their children, 
         DFS explores as far as possible along each branch before backtracking. It often works recursively and can be implemented using a stack data structure.

<b> Characteristics:</b>
<li><b>Stack-Based:</b> DFS uses a stack (or recursion) to keep track of nodes to visit. It starts at the initial node and explores as deeply as possible along each branch before backtracking.</li>
<li><b>Depth-First:</b> The name "Depth-First Search" comes from its depth-first nature. It explores the deepest unvisited node first, moving deeper into the graph or tree before considering siblings.</li></p>
      )}
      {selectedAlgorithm === 3 && (
        <p>
        <b>Dijkstra's Algorithm</b>is a popular and widely used algorithm for finding the shortest path between nodes in a weighted graph. 
        It was developed by Dutch computer scientist Edsger W. Dijkstra in 1956. This algorithm is particularly valuable in scenarios where you need to find the shortest path
         from a single source node to all other nodes in a graph. <b>Key Characteristics:</b>
         <li><b>Single-Source Shortest Path:</b> Dijkstra's algorithm operates on a single source node and calculates the shortest path from that node to all other nodes in the graph.</li>
        <li><b>Greedy Approach:</b> It employs a greedy approach, meaning it chooses the path that appears to be the shortest at each step. It maintains a priority queue (or a min-heap) to efficiently select the next node to explore.</li></p>
      )}
      <button onClick={closeInfoPopup}>Close</button>
    </div>
  )}
    </>
    )
}



class Spot {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.isWall = false;
        this.isStart = (i===START_NODE_ROW && j===START_NODE_COL);
        this.isEnd = (i===END_NODE_ROW && j===END_NODE_COL);
        
        /*
        ----  below information we don't use after 16 number of commits in github ---
        this.f = 1e9;
        this.g = 1e9;
        this.previous = undefined;
        this.neighbors = [];
        this.getNeighbors = function(grid){
            if(i > 0) this.neighbors.push(grid[i-1][j]); // up
            if(j > 0) this.neighbors.push(grid[i][j-1]); // left

            if(i+1<rows) this.neighbors.push(grid[i+1][j]); // down
            if(j+1<cols) this.neighbors.push(grid[i][j+1]); // right
        }
        */
    }
}

function Node({pv}){
    const {x,y,isStart,isEnd,isWall,onMouseDown,onMouseEnter,onMouseUp,setStartEndNode} = pv;
    const allowDrop=(e)=>{e.preventDefault();}
    const drag=(e)=>{e.dataTransfer.setData("myID", e.target.id);}
    const drop=(e)=>{
        e.preventDefault();
        var data = e.dataTransfer.getData("myID");
        var dom = document.getElementById(data);
        var id = parseInt(dom.attributes.data_type.value);
        if(e.target.attributes.data_type.value !== "3" || e.target.attributes.wall.value === "true") return;
        
        // call the function
        var r = parseInt(e.target.attributes.data_x.value)
        var c = parseInt(e.target.attributes.data_y.value)
        setStartEndNode(id,r,c);
    }

    var classNode = isStart?"START_NODE":(isEnd?"END_NODE":(isWall?"obtacle":""));
    var typeId = isStart?"1":(isEnd?"2":"3");

    if(isStart || isEnd){
        return (
            <div 
            className={'square '+classNode} id={'row'+x+'_col'+y}
            data_x={x} 
            data_y={y} 
            data_type={typeId} 
            wall="false"
            draggable="true"
            onDragStart={drag} 
            onDrop={drop} 
            onDragOver={allowDrop}
            >
            </div>
        )
    }
    else{
        return(
            <div onMouseDown={(e)=>{
                e.preventDefault(); // it is necessary
                onMouseDown(x,y)}
            } 
            onMouseEnter={(e)=>{
                e.preventDefault();
                onMouseEnter(x,y)}
            } 
            onMouseUp={(e)=>{
                e.preventDefault();
                onMouseUp()}
            } 
            className={'square '+classNode} id={'row'+x+'_col'+y}
            data_x={x} 
            data_y={y} 
            data_type={typeId} 
            wall={isWall.toString()}
            onDrop={drop} 
            onDragOver={allowDrop}
            >
            </div>
        )
    }
}

async function waitForAnimatoin(time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve('');
        },time)
    })
}
const isValid = (r,c) =>{
    if((r===START_NODE_ROW && c===START_NODE_COL) || (r===END_NODE_ROW && c===END_NODE_COL)) return 0;
    else return 1;
}
export default App;