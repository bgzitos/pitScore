import React, { useEffect, useState, useCallback } from "react";
import {
  listarEstadios,
  criarEstadio,
  atualizarEstadio,
  deletarEstadio,
} from "../../utils/estadioService";

const FORM_VAZIO = { nome: "", cidade: "", pais: "", capacidade: "" };

function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast${tipo === "err" ? " err" : ""}`}>{msg}</div>;
}

function ModalEstadio({ estadio, onFechar, onSalvo }) {
  const [form, setForm] = useState(
    estadio
      ? { nome: estadio.nome, cidade: estadio.cidade, pais: estadio.pais || "", capacidade: String(estadio.capacidade) }
      : { ...FORM_VAZIO }
  );
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: "" });
  };

  const apenasLetras = (e) => {
    if (!/^[a-zA-ZÀ-ÿ0-9\s\-']$/.test(e.key) &&
      !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.cidade.trim()) e.cidade = "Cidade é obrigatória";
    if (!form.capacidade || Number(form.capacidade) <= 0) e.capacidade = "Capacidade é obrigatória";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;
    setSalvando(true);
    try {
      const payload = { ...form, capacidade: Number(form.capacidade) };
      if (estadio) {
        await atualizarEstadio(estadio.id, payload);
        onSalvo("Estádio alterado com sucesso!");
      } else {
        await criarEstadio(payload);
        onSalvo("Estádio cadastrado com sucesso!");
      }
      onFechar();
    } catch (err) {
      setErros({ geral: err.response?.data?.mensagem || "Erro ao salvar." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal">
        <div className="modal-head">
          <span>🏟</span>
          <h3>{estadio ? "Editar Estádio" : "Novo Estádio"}</h3>
          <button className="modal-close" onClick={onFechar}>×</button>
        </div>

        {erros.geral && <div className="form-error" style={{ marginBottom: 16 }}>{erros.geral}</div>}

        <div className="form-group">
          <label className="form-label">Nome *</label>
          <input
            className={`form-input${erros.nome ? " error" : ""}`}
            name="nome"
            placeholder="Ex: Maracanã"
            value={form.nome}
            onChange={handleChange}
            onKeyDown={apenasLetras}
          />
          {erros.nome && <div className="form-error">{erros.nome}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Cidade *</label>
            <input
              className={`form-input${erros.cidade ? " error" : ""}`}
              name="cidade"
              placeholder="Ex: Rio de Janeiro"
              value={form.cidade}
              onChange={handleChange}
              onKeyDown={apenasLetras}
            />
            {erros.cidade && <div className="form-error">{erros.cidade}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">País</label>
            <input
              className="form-input"
              name="pais"
              placeholder="Ex: Brasil"
              value={form.pais}
              onChange={handleChange}
              onKeyDown={apenasLetras}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Capacidade *</label>
          <input
            className={`form-input${erros.capacidade ? " error" : ""}`}
            name="capacidade"
            type="number"
            placeholder="Ex: 78838"
            value={form.capacidade}
            onChange={handleChange}
          />
          {erros.capacidade && <div className="form-error">{erros.capacidade}</div>}
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>
            💾 {salvando ? "Salvando..." : "Salvar Estádio"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminEstadios() {
  const [estadios, setEstadios] = useState([]);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(null); // null | "novo" | objeto
  const [toast, setToast] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const r = await listarEstadios();
      setEstadios(r.data);
    } catch {}
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const mostrarToast = useCallback((msg, tipo = "ok") => {
    setToast({ msg, tipo });
  }, []);

  const handleDeletar = async (estadio) => {
    if (!window.confirm(`Excluir "${estadio.nome}"?`)) return;
    try {
      await deletarEstadio(estadio.id);
      mostrarToast("Estádio excluído com sucesso!");
      carregar();
    } catch (err) {
      mostrarToast(err.response?.data?.mensagem || "Erro ao excluir.", "err");
    }
  };

  const filtrados = estadios.filter((e) =>
    !busca || e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    e.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <h2>Estádios</h2>
          <p>Gerencie os estádios da Copa do Mundo.</p>
        </div>
        <div className="table-toolbar-right">
          <div className="search-input-wrap" style={{ maxWidth: 220 }}>
            <span className="icon">🔍</span>
            <input
              className="search-input"
              placeholder="Busque estádios..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="btn-new" onClick={() => setModal("novo")}>+ Novo Estádio</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cidade</th>
            <th>País</th>
            <th>Capacidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="6">Nenhum estádio cadastrado.</td>
            </tr>
          ) : (
            filtrados.map((e) => (
              <tr key={e.id}>
                <td className="td-muted">#{e.id}</td>
                <td className="td-bold">{e.nome}</td>
                <td>{e.cidade}</td>
                <td className="td-muted">{e.pais || "—"}</td>
                <td>{e.capacidade?.toLocaleString("pt-BR")}</td>
                <td>
                  <button className="action-btn" title="Editar" onClick={() => setModal(e)}>✏️</button>
                  <button className="action-btn del" title="Excluir" onClick={() => handleDeletar(e)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>Mostrando {filtrados.length} de {estadios.length} estádios</span>
      </div>

      {modal && (
        <ModalEstadio
          estadio={modal === "novo" ? null : modal}
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

export default AdminEstadios;
