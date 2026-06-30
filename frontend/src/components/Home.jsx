import React, { useEffect, useState } from "react";
import { listarGrupos } from "../utils/grupoService";
import { listarSelecoes } from "../utils/selecaoService";

function initials(nome) {
  return nome.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

function Home() {
  const [grupos, setGrupos] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    listarGrupos().then((r) => setGrupos(r.data)).catch(() => {});
    listarSelecoes().then((r) => setSelecoes(r.data)).catch(() => {});
  }, []);

  const grupoBusca = busca.toLowerCase();
  const gruposFiltrados = grupos.filter((g) =>
    !busca || g.nome.toLowerCase().includes(grupoBusca)
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Grupos da Copa do Mundo</h1>
        <p className="page-sub">Seus grupos criados.</p>
      </div>

      <div className="search-filter-row">
        <div className="search-input-wrap">
          <span className="icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar seleções..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button className="filter-btn">⚙ Filtrar</button>
      </div>

      {gruposFiltrados.map((grupo) => {
        const times = selecoes.filter((s) => s.idGrupo === grupo.id);
        return (
          <div key={grupo.id} className="group-section">
            <div className="group-label">
              <div className="group-label-bar" />
              {grupo.nome}
            </div>
            <div className="group-cards">
              {times.map((t, idx) => (
                <div key={t.id} className="team-card">
                  <div className="team-card-top">
                    <div className="team-avatar">{initials(t.nome)}</div>
                    <span className="team-pos-badge">Posição #{idx + 1}</span>
                  </div>
                  <div className="team-name">{t.nome}</div>
                  <div className="team-country">📍 {t.pais}</div>
                  <div className="team-stats">
                    <div>
                      <div className="team-pts-label">Pontos</div>
                      <div className="team-pts-value">0</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="team-pts-label">Forma</div>
                      <div className="form-badges">
                        <span className="badge-e">E</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {times.length === 0 && (
                <p style={{ color: "var(--text-muted)", gridColumn: "span 4" }}>
                  Nenhuma seleção neste grupo.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {gruposFiltrados.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>Nenhum grupo encontrado.</p>
      )}
    </div>
  );
}

export default Home;
