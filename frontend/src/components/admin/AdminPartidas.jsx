import React, { useEffect, useState, useCallback } from "react";
import {
  listarPartidas,
  criarPartida,
  atualizarPartida,
  deletarPartida,
} from "../../utils/partidaService";
import { listarSelecoes } from "../../utils/selecaoService";
import { listarEstadios } from "../../utils/estadioService";
import { listarGrupos } from "../../utils/grupoService";

const FASES = ["Grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
const STATUS_OPTS = ["Agendada", "Em andamento", "Encerrada"];

const FORM_VAZIO = {
  dataHora: "",
  fase: "",
  idSelecaoMandante: "",
  idSelecaoVisitante: "",
  idEstadio: "",
  idGrupo: "",
  placarMandante: "",
  placarVisitante: "",
  status: "Agendada",
};

function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast${tipo === "err" ? " err" : ""}`}>{msg}</div>;
}

function formatarData(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatarPlacar(m, v) {
  if (m == null && v == null) return "—";
  return `${m ?? "?"} – ${v ?? "?"}`;
}

function ModalPartida({ partida, selecoes, estadios, grupos, onFechar, onSalvo }) {
  const [form, setForm] = useState(() => {
    if (partida) {
      return {
        dataHora: partida.dataHora ? partida.dataHora.slice(0, 16) : "",
        fase: partida.fase || "",
        idSelecaoMandante: String(partida.idSelecaoMandante || ""),
        idSelecaoVisitante: String(partida.idSelecaoVisitante || ""),
        idEstadio: String(partida.idEstadio || ""),
        idGrupo: partida.idGrupo ? String(partida.idGrupo) : "",
        placarMandante: partida.placarMandante != null ? String(partida.placarMandante) : "",
        placarVisitante: partida.placarVisitante != null ? String(partida.placarVisitante) : "",
        status: partida.status || "Agendada",
      };
    }
    return { ...FORM_VAZIO };
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErros((e) => ({ ...e, [name]: "" }));
  };

  const handleChange = (e) => set(e.target.name, e.target.value);

  const validar = () => {
    const e = {};
    if (!form.dataHora) e.dataHora = "Data e hora são obrigatórias";
    if (!form.fase) e.fase = "Fase é obrigatória";
    if (!form.idSelecaoMandante) e.idSelecaoMandante = "Selecione o mandante";
    if (!form.idSelecaoVisitante) e.idSelecaoVisitante = "Selecione o visitante";
    if (form.idSelecaoMandante && form.idSelecaoMandante === form.idSelecaoVisitante) {
      e.idSelecaoVisitante = "Mandante e visitante devem ser diferentes";
    }
    if (!form.idEstadio) e.idEstadio = "Selecione o estádio";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;
    setSalvando(true);
    try {
      const payload = {
        dataHora: form.dataHora,
        fase: form.fase,
        idSelecaoMandante: Number(form.idSelecaoMandante),
        idSelecaoVisitante: Number(form.idSelecaoVisitante),
        idEstadio: Number(form.idEstadio),
        idGrupo: form.idGrupo ? Number(form.idGrupo) : null,
        placarMandante: form.placarMandante !== "" ? Number(form.placarMandante) : null,
        placarVisitante: form.placarVisitante !== "" ? Number(form.placarVisitante) : null,
        status: form.status || "Agendada",
      };
      if (partida) {
        await atualizarPartida(partida.id, payload);
        onSalvo("Partida atualizada com sucesso!");
      } else {
        await criarPartida(payload);
        onSalvo("Partida cadastrada com sucesso!");
      }
      onFechar();
    } catch (err) {
      setErros({ geral: err.response?.data?.mensagem || "Erro ao salvar." });
    } finally {
      setSalvando(false);
    }
  };

  const fasesGrupo = ["Grupos"];
  const grupoObrigatorio = fasesGrupo.includes(form.fase);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal">
        <div className="modal-head">
          <span>⚽</span>
          <h3>{partida ? "Editar Partida" : "Cadastrar Nova Partida"}</h3>
          <button className="modal-close" onClick={onFechar}>×</button>
        </div>

        {erros.geral && <div className="form-error" style={{ marginBottom: 16 }}>{erros.geral}</div>}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Data e Hora *</label>
            <input
              className={`form-input${erros.dataHora ? " error" : ""}`}
              name="dataHora"
              type="datetime-local"
              value={form.dataHora}
              onChange={handleChange}
            />
            {erros.dataHora && <div className="form-error">{erros.dataHora}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Fase da Competição *</label>
            <select
              className={`form-select${erros.fase ? " error" : ""}`}
              name="fase"
              value={form.fase}
              onChange={handleChange}
            >
              <option value="">Selecione a fase</option>
              {FASES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            {erros.fase && <div className="form-error">{erros.fase}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mandante (HOME) *</label>
            <select
              className={`form-select${erros.idSelecaoMandante ? " error" : ""}`}
              name="idSelecaoMandante"
              value={form.idSelecaoMandante}
              onChange={handleChange}
            >
              <option value="">Selecionar Time</option>
              {selecoes.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {erros.idSelecaoMandante && <div className="form-error">{erros.idSelecaoMandante}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Visitante (AWAY) *</label>
            <select
              className={`form-select${erros.idSelecaoVisitante ? " error" : ""}`}
              name="idSelecaoVisitante"
              value={form.idSelecaoVisitante}
              onChange={handleChange}
            >
              <option value="">Selecionar Time</option>
              {selecoes.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {erros.idSelecaoVisitante && <div className="form-error">{erros.idSelecaoVisitante}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Estádio *</label>
          <select
            className={`form-select${erros.idEstadio ? " error" : ""}`}
            name="idEstadio"
            value={form.idEstadio}
            onChange={handleChange}
          >
            <option value="">Selecionar Estádio</option>
            {estadios.map((e) => (
              <option key={e.id} value={e.id}>{e.nome} – {e.cidade}</option>
            ))}
          </select>
          {erros.idEstadio && <div className="form-error">{erros.idEstadio}</div>}
        </div>

        {grupoObrigatorio && (
          <div className="form-group">
            <label className="form-label">Grupo</label>
            <select
              className="form-select"
              name="idGrupo"
              value={form.idGrupo}
              onChange={handleChange}
            >
              <option value="">Selecionar Grupo</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nome}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Placar Mandante</label>
            <input
              className="form-input"
              name="placarMandante"
              type="number"
              min="0"
              placeholder="—"
              value={form.placarMandante}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Placar Visitante</label>
            <input
              className="form-input"
              name="placarVisitante"
              type="number"
              min="0"
              placeholder="—"
              value={form.placarVisitante}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange}>
            {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>
            💾 {salvando ? "Salvando..." : "Salvar Partida"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [estadios, setEstadios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const [rp, rs, re, rg] = await Promise.all([
        listarPartidas(),
        listarSelecoes(),
        listarEstadios(),
        listarGrupos(),
      ]);
      setPartidas(rp.data);
      setSelecoes(rs.data);
      setEstadios(re.data);
      setGrupos(rg.data);
    } catch {}
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const mostrarToast = useCallback((msg, tipo = "ok") => setToast({ msg, tipo }), []);

  const handleDeletar = async (p) => {
    if (!window.confirm(`Excluir partida ${p.nomeSelecaoMandante} × ${p.nomeSelecaoVisitante}?`)) return;
    try {
      await deletarPartida(p.id);
      mostrarToast("Partida excluída com sucesso!");
      carregar();
    } catch (err) {
      mostrarToast(err.response?.data?.mensagem || "Erro ao excluir.", "err");
    }
  };

  const filtradas = partidas.filter((p) => {
    if (!busca) return true;
    const b = busca.toLowerCase();
    return (
      (p.nomeSelecaoMandante || "").toLowerCase().includes(b) ||
      (p.nomeSelecaoVisitante || "").toLowerCase().includes(b) ||
      (p.nomeEstadio || "").toLowerCase().includes(b)
    );
  });

  return (
    <>
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <h2>Partidas</h2>
          <p>Gerencie as partidas da Copa do Mundo.</p>
        </div>
        <div className="table-toolbar-right">
          <div className="search-input-wrap" style={{ maxWidth: 220 }}>
            <span className="icon">🔍</span>
            <input
              className="search-input"
              placeholder="Busque partidas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="btn-new" onClick={() => setModal("nova")}>+ Nova Partida</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Partida</th>
            <th>Estádio</th>
            <th>Fase</th>
            <th>Placar</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="6">Nenhuma partida cadastrada.</td>
            </tr>
          ) : (
            filtradas.map((p) => (
              <tr key={p.id}>
                <td className="td-muted">{formatarData(p.dataHora)}</td>
                <td>
                  <span className="team-col-name">{p.nomeSelecaoMandante}</span>
                  <span className="vs-tag">vs</span>
                  <span className="team-col-visitor">{p.nomeSelecaoVisitante}</span>
                </td>
                <td className="td-muted">{p.nomeEstadio || "—"}</td>
                <td className="td-muted">{p.fase}</td>
                <td className="td-score">{formatarPlacar(p.placarMandante, p.placarVisitante)}</td>
                <td>
                  <button className="action-btn" title="Editar" onClick={() => setModal(p)}>✏️</button>
                  <button className="action-btn del" title="Excluir" onClick={() => handleDeletar(p)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>Mostrando {filtradas.length} de {partidas.length} partidas</span>
      </div>

      {modal && (
        <ModalPartida
          partida={modal === "nova" ? null : modal}
          selecoes={selecoes}
          estadios={estadios}
          grupos={grupos}
          onFechar={() => setModal(null)}
          onSalvo={(msg) => { mostrarToast(msg); carregar(); }}
        />
      )}

      {toast && (
        <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default AdminPartidas;
