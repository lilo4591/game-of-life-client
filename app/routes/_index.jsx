import '../App.css';
import { useEffect, useState } from 'react';

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



const dataTwo = [[0, 0], [0, 2], [0, 1], [0, 3]]

export default function Index() {
  const [boardSize, setBoardSize] = useState([]);
  const [activeCells, setActiveCells] = useState([]);
  const [runSimulation, setRunSimulation] = useState([]);

  let runInterval;

  useEffect(() => {
    async function handleGet() {
      const response = await fetch("http://localhost:8080/game");
      const responseData = await response.json();
      setBoardSize(responseData)
    }
    handleGet();
  }, []);


   
    async function handlePost() {
      console.log("active cells yoo " )
      activeCells.map(elem => console.log(elem))

      const response = await fetch("http://localhost:8080/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates: [[0, 0], [0, 1], [0, 2] ] }),
      });
      const json = await response.json();
      console.log(JSON.stringify({ coordinates: [[0, 1]] }));
      console.log(json);

    }
    
  

  function callService() {
    console.log("Run simluation")
    handlePost();
  }


  function startSimulation() {
    activeCells.map(elem => console.log(elem))
    callService();
    /*if (!runInterval) {
      runInterval = setInterval(callService, 5000);
    }*/
  }

  function stopSimulation() {
    clearInterval(runInterval)
    console.log("Stop simluation")
  }

  

  function handleClick(row, col) {
    var isNotAlreadyActive = activeCells.findIndex((c => c.row === row && c.col === col)) === -1;
    if (isNotAlreadyActive) {
      setActiveCells([...activeCells, { row, col }]);
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
        const isActive = activeCells.some((cell) => cell.row === i && cell.col === j); // check if the current cell is active
        cells.push(<td key={`${i} + ${j}`} className={`cells ${isActive ? "active" : ""}`} onClick={() => handleClick(i, j)}> </td>)
      }
      rows.push(<tr key={`${i}`}>{cells}</tr>)
    }
    return <tbody>{rows}</tbody>
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="App">
        <h1>game-of-life</h1>

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
