import React from "react";

const NAVS = [
  { id: "home", label: "Início" },
  { id: "simulador", label: "Simulador" },
  { id: "perfil", label: "Perfil" },
  { id: "admin", label: "Admin" },
];

function Navbar({ usuario, secao, onNavegar, onLogout }) {
  const perfil = usuario?.perfil || "";

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavegar("home")}>
        <span>Pit<span className="score">Score</span></span>
        {perfil === "ADMIN" && <span className="nav-badge">ADMIN</span>}
      </div>

      <div className="navbar-nav">
        {NAVS.map((n) => (
          <button
            key={n.id}
            className={`nav-btn${secao === n.id ? " active" : ""}`}
            onClick={() => onNavegar(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="navbar-icons">
        <button className="icon-btn" title="Notificações">🔔</button>
        <button className="icon-btn" title="Sair" onClick={onLogout}>👤</button>
      </div>
    </nav>
  );
}

export default Navbar;
