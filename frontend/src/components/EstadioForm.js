import React, { useEffect, useState } from "react";
import { criarEstadio, atualizarEstadio } from "../utils/estadioService";

function EstadioForm({ estadio, onFechar }) {
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    pais: "",
    capacidade: "",
  });

  useEffect(() => {
    if (estadio) {
      setForm({
        nome: estadio.nome,
        cidade: estadio.cidade,
        pais: estadio.pais,
        capacidade: estadio.capacidade,
      });
    }
  }, [estadio]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (estadio) {
      await atualizarEstadio(estadio.id, form);
    } else {
      await criarEstadio(form);
    }
    onFechar();
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>{estadio ? "Editar Estádio" : "Novo Estádio"}</h2>

      <div>
        <label>Nome:</label>
        <input name="nome" value={form.nome} onChange={handleChange} />
      </div>
      <div>
        <label>Cidade:</label>
        <input name="cidade" value={form.cidade} onChange={handleChange} />
      </div>
      <div>
        <label>País:</label>
        <input name="pais" value={form.pais} onChange={handleChange} />
      </div>
      <div>
        <label>Capacidade:</label>
        <input
          name="capacidade"
          value={form.capacidade}
          onChange={handleChange}
          type="number"
        />
      </div>

      <br />
      <button onClick={handleSalvar}>Salvar</button>
      <button onClick={onFechar} style={{ marginLeft: "10px" }}>
        Cancelar
      </button>
    </div>
  );
}

export default EstadioForm;
