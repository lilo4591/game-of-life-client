import '../App.css';
import { useEffect, useState } from 'react';

export const meta = () => {
  return [{ title: "Game of Life" }];
};


export const handleGet = async () => {
    const response = await fetch("http://localhost:8080/game");
    const responseData = await response.json();
    return responseData
  }

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



const dataTwo = [ [0, 0], [0, 2], [0, 1], [0, 3] ]

export default function Index() {
  const [board, setBoard] = useState([]);
  const [clickedIndex, setClickedIndex] = useState({ row: null, col: null });

  useEffect(() => {
    async function handleGet1() {
      const response = await fetch("http://localhost:8080/game");
      const responseData = await response.json();
      setBoard(responseData)
    }
    handleGet1();
  }, []);

  function handleClick(row, col) {
    console.log("row: " + row + " column: " + col);
    setClickedIndex({ row, col }); // update the state with the index of the clicked td element
   }

  const renderTable = () => {
    const rows = [];

    for(let i = 0; i < board.rows; i++) {
      const cells = [];
      for (let j = 0; j < board.columns; j++) {
        const isActive = clickedIndex?.row === i && clickedIndex?.col === j;
        cells.push(<td key= {`${i} + ${j}`} className={`cells ${isActive ? "active" : ""}`} onClick={() => handleClick(i, j)}> </td>)   
      }
      rows.push(<tr key= {`${i}`}>{cells}</tr>)
    }
    return <tbody>{rows}</tbody>
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>game-of-life</h1>
      <div className="App">

        <table>
        {renderTable()}
        </table>

        <button className="button" onClick={handleGet}>Get</button>
        <button className="button" onClick={handlePost}>Post</button>
      </div>
    </div>
  );
}
