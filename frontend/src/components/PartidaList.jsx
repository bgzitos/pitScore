import React, { useEffect, useState } from "react";
import { listarPartidas, deletarPartida } from "../utils/partidaService";
import PartidaForm from "./PartidaForm";

function PartidaList() {
  const [partidas, setPartidas] = useState([]);
  const [partidaEditando, setPartidaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const carregarPartidas = async () => {
    const response = await listarPartidas();
    setPartidas(response.data);
  };

  useEffect(() => {
    carregarPartidas();
  }, []);

  const handleDeletar = async (id) => {
    if (window.confirm("Deseja excluir esta partida?")) {
      try {
        await deletarPartida(id);
        setMensagem("Partida excluída com sucesso!");
        carregarPartidas();
        setTimeout(() => setMensagem(""), 3000);
      } catch (error) {
        setMensagem("Erro ao excluir partida.");
        setTimeout(() => setMensagem(""), 3000);
      }
    }
  };

  const handleEditar = (partida) => {
    setPartidaEditando(partida);
    setMostrarFormulario(true);
  };

  const handleNovo = () => {
    setPartidaEditando(null);
    setMostrarFormulario(true);
  };

  const handleFechar = () => {
    setMostrarFormulario(false);
    setPartidaEditando(null);
    carregarPartidas();
  };

  const formatarPlacar = (partida) =>
    partida.placarMandante == null || partida.placarVisitante == null
      ? "-"
      : `${partida.placarMandante} x ${partida.placarVisitante}`;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Partidas</h1>
      <button onClick={handleNovo}>Nova Partida</button>

      {mensagem && (
        <p
          style={{
            color: mensagem.includes("Erro") ? "red" : "green",
            marginTop: "10px",
          }}
        >
          {mensagem}
        </p>
      )}

      {mostrarFormulario && (
        <PartidaForm partida={partidaEditando} onFechar={handleFechar} />
      )}

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Data/Hora</th>
            <th>Fase</th>
            <th>Mandante</th>
            <th>Visitante</th>
            <th>Estádio</th>
            <th>Placar</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {partidas.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Nenhuma partida cadastrada
              </td>
            </tr>
          ) : (
            partidas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.dataHora ? p.dataHora.replace("T", " ").substring(0, 16) : "-"}</td>
                <td>{p.fase}</td>
                <td>{p.nomeSelecaoMandante}</td>
                <td>{p.nomeSelecaoVisitante}</td>
                <td>{p.nomeEstadio}</td>
                <td>{formatarPlacar(p)}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleEditar(p)}>Editar</button>
                  <button
                    onClick={() => handleDeletar(p.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PartidaList;
