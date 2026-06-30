import React, { useState } from "react";
<<<<<<< HEAD
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
=======
import LoginForm from "./components/LoginForm";
import CadastroForm from "./components/CadastroForm";
import PainelUsuario from "./components/PainelUsuario";

function App() {
  const usuarioSalvo = localStorage.getItem("usuario");

  const [usuario, setUsuario] = useState(
    usuarioSalvo ? JSON.parse(usuarioSalvo) : null,
  );
  const [tela, setTela] = useState("login"); // "login" ou "cadastro"

  const handleLogin = (usuarioLogado) => {
    setUsuario(usuarioLogado);
  };

  const handleLogout = () => {
    setUsuario(null);
    setTela("login");
  };

  if (usuario) {
    return <PainelUsuario usuario={usuario} onLogout={handleLogout} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      {tela === "login" ? (
        <LoginForm
          onLogin={handleLogin}
          onIrParaCadastro={() => setTela("cadastro")}
        />
      ) : (
        <CadastroForm onIrParaLogin={() => setTela("login")} />
      )}
>>>>>>> df8504c (feat - add login e autenticacao)
    </div>
  );
}

export default App;
