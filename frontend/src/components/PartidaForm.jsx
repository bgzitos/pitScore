import React, { useEffect, useState } from "react";
import { criarPartida, atualizarPartida } from "../utils/partidaService";
import { listarSelecoes } from "../utils/selecaoService";
import { listarEstadios } from "../utils/estadioService";
import { listarGrupos } from "../utils/grupoService";

const FASES = ["Grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
const STATUS = ["Agendada", "Em andamento", "Encerrada"];

function PartidaForm({ partida, onFechar }) {
  const [form, setForm] = useState({
    dataHora: "",
    fase: "Grupos",
    idSelecaoMandante: "",
    idSelecaoVisitante: "",
    idEstadio: "",
    idGrupo: "",
    placarMandante: "",
    placarVisitante: "",
    status: "Agendada",
  });

  const [selecoes, setSelecoes] = useState([]);
  const [estadios, setEstadios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    listarSelecoes().then((resp) => setSelecoes(resp.data));
    listarEstadios().then((resp) => setEstadios(resp.data));
    listarGrupos().then((resp) => setGrupos(resp.data));
  }, []);

  useEffect(() => {
    if (partida) {
      setForm({
        dataHora: partida.dataHora ? partida.dataHora.substring(0, 16) : "",
        fase: partida.fase,
        idSelecaoMandante: partida.idSelecaoMandante,
        idSelecaoVisitante: partida.idSelecaoVisitante,
        idEstadio: partida.idEstadio,
        idGrupo: partida.idGrupo || "",
        placarMandante: partida.placarMandante ?? "",
        placarVisitante: partida.placarVisitante ?? "",
        status: partida.status,
      });
    }
  }, [partida]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: "" });
  };

  const validar = () => {
    const novosErros = {};
    if (!form.dataHora) novosErros.dataHora = "Data e hora são obrigatórias";
    if (!form.idSelecaoMandante) novosErros.idSelecaoMandante = "Seleção mandante é obrigatória";
    if (!form.idSelecaoVisitante) novosErros.idSelecaoVisitante = "Seleção visitante é obrigatória";
    if (
      form.idSelecaoMandante &&
      form.idSelecaoVisitante &&
      String(form.idSelecaoMandante) === String(form.idSelecaoVisitante)
    ) {
      novosErros.idSelecaoVisitante = "Deve ser diferente da seleção mandante";
    }
    if (!form.idEstadio) novosErros.idEstadio = "Estádio é obrigatório";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    const dados = {
      dataHora: form.dataHora,
      fase: form.fase,
      idSelecaoMandante: Number(form.idSelecaoMandante),
      idSelecaoVisitante: Number(form.idSelecaoVisitante),
      idEstadio: Number(form.idEstadio),
      idGrupo: form.idGrupo ? Number(form.idGrupo) : null,
      placarMandante: form.placarMandante === "" ? null : Number(form.placarMandante),
      placarVisitante: form.placarVisitante === "" ? null : Number(form.placarVisitante),
      status: form.status,
    };

    try {
      if (partida) {
        await atualizarPartida(partida.id, dados);
        setSucesso("Partida alterada com sucesso!");
      } else {
        await criarPartida(dados);
        setSucesso("Partida cadastrada com sucesso!");
      }
      setTimeout(() => onFechar(), 1500);
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem ||
        "Erro ao salvar partida. Tente novamente.";
      setErros({ geral: mensagem });
    }
  };

  const estiloInput = (campo) => ({
    display: "block",
    marginBottom: "4px",
    borderColor: erros[campo] ? "red" : "#ccc",
    padding: "6px",
    width: "100%",
  });

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>{partida ? "Editar Partida" : "Nova Partida"}</h2>

      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erros.geral && <p style={{ color: "red" }}>{erros.geral}</p>}

      <div style={{ marginBottom: "12px" }}>
        <label>Data e Hora: *</label>
        <input
          name="dataHora"
          type="datetime-local"
          value={form.dataHora}
          onChange={handleChange}
          style={estiloInput("dataHora")}
        />
        {erros.dataHora && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.dataHora}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Fase: *</label>
        <select name="fase" value={form.fase} onChange={handleChange} style={estiloInput("fase")}>
          {FASES.map((fase) => (
            <option key={fase} value={fase}>{fase}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Grupo:</label>
        <select name="idGrupo" value={form.idGrupo} onChange={handleChange} style={estiloInput("idGrupo")}>
          <option value="">Nenhum</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>{g.nome}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Seleção Mandante: *</label>
        <select
          name="idSelecaoMandante"
          value={form.idSelecaoMandante}
          onChange={handleChange}
          style={estiloInput("idSelecaoMandante")}
        >
          <option value="">Selecione...</option>
          {selecoes.map((s) => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>
        {erros.idSelecaoMandante && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.idSelecaoMandante}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Seleção Visitante: *</label>
        <select
          name="idSelecaoVisitante"
          value={form.idSelecaoVisitante}
          onChange={handleChange}
          style={estiloInput("idSelecaoVisitante")}
        >
          <option value="">Selecione...</option>
          {selecoes.map((s) => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>
        {erros.idSelecaoVisitante && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.idSelecaoVisitante}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Estádio: *</label>
        <select name="idEstadio" value={form.idEstadio} onChange={handleChange} style={estiloInput("idEstadio")}>
          <option value="">Selecione...</option>
          {estadios.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
        {erros.idEstadio && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.idEstadio}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Placar Mandante:</label>
        <input
          name="placarMandante"
          type="number"
          min="0"
          value={form.placarMandante}
          onChange={handleChange}
          style={estiloInput("placarMandante")}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Placar Visitante:</label>
        <input
          name="placarVisitante"
          type="number"
          min="0"
          value={form.placarVisitante}
          onChange={handleChange}
          style={estiloInput("placarVisitante")}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Status:</label>
        <select name="status" value={form.status} onChange={handleChange} style={estiloInput("status")}>
          {STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <small style={{ color: "#888" }}>* Campos obrigatórios</small>
      <br />
      <br />

      <button onClick={handleSalvar}>Salvar</button>
      <button onClick={onFechar} style={{ marginLeft: "10px" }}>
        Cancelar
      </button>
    </div>
  );
}

export default PartidaForm;
