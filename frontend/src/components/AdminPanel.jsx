import React, { useState } from "react";
import AdminEstadios from "./admin/AdminEstadios";
import AdminPartidas from "./admin/AdminPartidas";

const ITEMS = [
  { id: "estadios", label: "Estádios", icon: "🏟" },
  { id: "partidas", label: "Partidas", icon: "⚽" },
];

function AdminPanel() {
  const [aba, setAba] = useState("estadios");

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-section">Gerenciador</div>
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-btn${aba === item.id ? " active" : ""}`}
            onClick={() => setAba(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>
      <main className="admin-content">
        {aba === "estadios" && <AdminEstadios />}
        {aba === "partidas" && <AdminPartidas />}
      </main>
    </div>
  );
}

export default AdminPanel;
