import '../App.css';

export const meta = () => {
  return [{ title: "New Remix App" }];
};


const handleGet = async () => {
    const response = await fetch("http://localhost:8080/game");
    const responseData = await response.json();
    console.log(responseData);
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

  const setToActive = () => {
    this.className.push('active')
  }

  const renderTable = () => {
    const rows = [];

    for(let i = 0; i < 20; i++) {
      const cells = [];
      for (let j = 0; j < 20; j++) {
        cells.push(<td key= {`${i} + ${j}`} className='cells' onClick="setToActive()"> {i},{j}</td>)   
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

        <button onClick={handleGet}>Get</button>
        <button onClick={handlePost}>Post</button>
      </div>
    </div>
  );
}
