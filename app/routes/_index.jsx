import '../App.css';
import { useEffect, useState, useRef } from 'react';

export const meta = () => {
  return [{ title: "Game of Life" }];
};


export default function Index() {
  const [boardSize, setBoardSize] = useState([]);
  const [activeCells, setActiveCells] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [count, setCount] = useState(0);
  const savedCallback = useRef(() => {});


  useEffect(() => {
    async function handleGet() {
      const response = await fetch("http://localhost:8080/game");
      const responseData = await response.json();
      setBoardSize(responseData)
    }
    handleGet();
  }, []);

  

  function updateStateOfActiveCells(prevActiveCells, newActiveCells) {
    let length = prevActiveCells.length;
    for (let i = 0; i < length; i++) {
      prevActiveCells.pop();
    } 
    for (let i = 0; i < newActiveCells.length; i++) {
      prevActiveCells.push(newActiveCells[i]);
    } 
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
    setIsRunning(true);
}

  function stopSimulation() {
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
        <h1>Game of life</h1>
        <p>Tick: {count}</p>

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
