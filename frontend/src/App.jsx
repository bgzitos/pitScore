import React, { useState } from "react";
import EstadioList from "./components/EstadioList";
import PartidaList from "./components/PartidaList";

function App() {
  const [tela, setTela] = useState("estadios");

  return (
    <div>
      <nav style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        <button onClick={() => setTela("estadios")} disabled={tela === "estadios"}>
          Estádios
        </button>
        <button
          onClick={() => setTela("partidas")}
          disabled={tela === "partidas"}
          style={{ marginLeft: "8px" }}
        >
          Partidas
        </button>
      </nav>
      {tela === "estadios" ? <EstadioList /> : <PartidaList />}
    </div>
  );
}

export default App;
