import React, { useState } from "react";
import "./index.css";
import LoginForm from "./components/LoginForm";
import CadastroForm from "./components/CadastroForm";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AdminPanel from "./components/AdminPanel";

function App() {
  const usuarioSalvo = localStorage.getItem("usuario");
  const [usuario, setUsuario] = useState(
    usuarioSalvo ? JSON.parse(usuarioSalvo) : null
  );
  const [authTela, setAuthTela] = useState("login");
  const [secao, setSecao] = useState("home");

  const handleLogin = (usuarioLogado) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
    setSecao("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setAuthTela("login");
  };

  if (!usuario) {
    return authTela === "login" ? (
      <LoginForm
        onLogin={handleLogin}
        onIrParaCadastro={() => setAuthTela("cadastro")}
      />
    ) : (
      <CadastroForm onIrParaLogin={() => setAuthTela("login")} />
    );
  }

  return (
    <div>
      <Navbar usuario={usuario} secao={secao} onNavegar={setSecao} onLogout={handleLogout} />
      {secao === "home" && <Home />}
      {secao === "admin" && <AdminPanel />}
      {secao === "simulador" && (
        <div className="page" style={{ paddingTop: 48 }}>
          <p style={{ color: "var(--text-muted)" }}>Simulador em desenvolvimento.</p>
        </div>
      )}
      {secao === "perfil" && (
        <div className="page" style={{ paddingTop: 48 }}>
          <p style={{ color: "var(--text-muted)" }}>Perfil em desenvolvimento.</p>
        </div>
      )}
    </div>
  );
}

export default App;
