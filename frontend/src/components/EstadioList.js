import React, { useEffect, useState } from "react";
import { listarEstadios, deletarEstadio } from "../utils/estadioService";
import EstadioForm from "./EstadioForm";

function EstadioList() {
  const [estadios, setEstadios] = useState([]);
  const [estadioEditando, setEstadioEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const carregarEstadios = async () => {
    const response = await listarEstadios();
    setEstadios(response.data);
  };

  useEffect(() => {
    carregarEstadios();
  }, []);

  const handleDeletar = async (id) => {
    if (window.confirm("Deseja deletar este estádio?")) {
      await deletarEstadio(id);
      carregarEstadios();
    }
  };

  const handleEditar = (estadio) => {
    setEstadioEditando(estadio);
    setMostrarFormulario(true);
  };

  const handleNovo = () => {
    setEstadioEditando(null);
    setMostrarFormulario(true);
  };

  const handleFechar = () => {
    setMostrarFormulario(false);
    setEstadioEditando(null);
    carregarEstadios();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estádios</h1>
      <button onClick={handleNovo}>Novo Estádio</button>

      {mostrarFormulario && (
        <EstadioForm estadio={estadioEditando} onFechar={handleFechar} />
      )}

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: "20px", width: "100%" }}
      >
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
          {estadios.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nome}</td>
              <td>{e.cidade}</td>
              <td>{e.pais}</td>
              <td>{e.capacidade}</td>
              <td>
                <button onClick={() => handleEditar(e)}>Editar</button>
                <button onClick={() => handleDeletar(e.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EstadioList;
