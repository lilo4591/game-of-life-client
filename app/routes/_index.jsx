import '../App.css';
import { useEffect, useState, useMemo, useRef } from 'react';

export const meta = () => {
  return [{ title: "Game of Life" }];
};


const handlePost = async () => {
  const response = await fetch("http://localhost:8080/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coordinates: [[0, 1]] }),
  });
  const json = await response.json();
  console.log(JSON.stringify({ coordinates: [[0, 1]] }));
  console.log(json);
};


export default function Index() {
  

  const [boardSize, setBoardSize] = useState([]);
  const [activeCells, setActiveCells] = useState([]);
  const [runSimulation, setRunSimulation] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [count, setCount] = useState(0);
  const savedCallback = useRef(() => {});

  var runInterval;

  useEffect(() => {
    async function handleGet() {
      const response = await fetch("http://localhost:8080/game");
      const responseData = await response.json();
      setBoardSize(responseData)
    }
    handleGet();
  }, []);



    async function handlePost(savedCallbackActiveCells) {
      console.log(savedCallbackActiveCells)

      const response = await fetch("http://localhost:8080/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates: activeCells })
      });
    
      const json = await response.json();
      console.log("coordinates in handle post: " + json.coordinates)
      setActiveCells(json.coordinates);
    }
    
  

  function callService() {
    console.log("Run simluation")
    handlePost();
  }

  function updateStateOfActiveCells(prevActiveCells, newActiveCells) {

    let length = prevActiveCells.length;
    for (let i = 0; i < length; i++) {
      prevActiveCells.pop();
    } 
    console.log("EMPTY: " + prevActiveCells)


    for (let i = 0; i < newActiveCells.length; i++) {
      prevActiveCells.push(newActiveCells[i]);
    } 
    
    console.log("newActiveCells in handle post: " + newActiveCells)
    console.log("prevActiveCells in handle post: " + prevActiveCells)

    return prevActiveCells;
    
  }

  useEffect(() => {
    savedCallback.current = async (savedCallbackActiveCells) => {
      
      setCount((prevCount) => prevCount + 1);
      const response = await fetch("http://localhost:8080/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates: savedCallbackActiveCells })
      });
    
      const json = await response.json();

      activeCells.map(elem => console.log(elem))
      setActiveCells((prevActiveCells) => {
        return updateStateOfActiveCells(prevActiveCells, json.coordinates)
      });

      
    };
  }, []);

  useEffect(() => {
    function tick() {
      savedCallback.current(activeCells);    }

      let id;
      if (isRunning) {
        id = setInterval(tick, 1000);
      } 
    return () => {
      clearInterval(id);
      setCount(0);
    };
  }, [isRunning]);

  function startSimulation() {
    activeCells.map(elem => console.log(elem))
    console.log("interval in start simulation: " + count)
    console.log("isRunning in start simulation: " + isRunning)
    setIsRunning(true);
    startCounter()
    console.log("interval in start simulation: " + count)
    console.log("isRunning in start simulation: " + isRunning)
    while (count !== 0) {
      handlePost()
  }
}

  function stopSimulation() {
    console.log("interval in stop simulation before clear: " + runInterval)
    clearInterval(runSimulation)
    console.log("interval in stop simulation after clear: " + runInterval)
    runInterval = null
    console.log("Stop simluation")
    stopCounter()
  }

  function startCounter() {
    setIsRunning(true);
  }

  function stopCounter() {
    setIsRunning(false);
  }


  function handleClick(row, col) {
    var isNotAlreadyActive = activeCells.findIndex((c => c[0] === row && c[1] === col)) === -1;
    if (isNotAlreadyActive) {
      setActiveCells([...activeCells, [row, col]]);
    }
    else {
      //TODO delete from cell when clicked again
    }
    console.log("row: " + row + " column: " + col);
    activeCells.map(elem => console.log(elem))
  }

  const renderTable = () => {
    const rows = [];

    for (let i = 0; i < boardSize.rows; i++) {
      const cells = [];
      for (let j = 0; j < boardSize.columns; j++) {
        const isActive = activeCells.some((cell) => cell[0] === i && cell[1] === j); // check if the current cell is active
        cells.push(<td key={`${i} + ${j}`} className={`cells ${isActive ? "active" : ""}`} onClick={() => handleClick(i, j)}> </td>)
      }
      rows.push(<tr key={`${i}`}>{cells}</tr>)
    }
    return <tbody>{rows}</tbody>
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="App">
        <h1>game-of-life {count}</h1>

        <div className='buttonClass'>
          <button className="button"  onClick={() => startSimulation()}>Start</button>
          <button className="button" onClick={() => stopSimulation()}>Stop</button>
        </div>

        <table>
          {renderTable()}
        </table>

      </div>
    </div>
  );
}
