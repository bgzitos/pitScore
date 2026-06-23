import React, { useEffect, useState } from "react";
import { criarEstadio, atualizarEstadio } from "../utils/estadioService";

function EstadioForm({ estadio, onFechar }) {
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    pais: "",
    capacidade: "",
  });

  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    if (estadio) {
      setForm({
        nome: estadio.nome,
        cidade: estadio.cidade,
        pais: estadio.pais || "",
        capacidade: estadio.capacidade,
      });
    }
  }, [estadio]);

  const apenasLetras = (e) => {
    const char = e.key;
    if (
      !/^[a-zA-ZÀ-ÿ\s]$/.test(char) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(char)
    ) {
      e.preventDefault();
    }
  };

  const apenasNumeros = (e) => {
    const char = e.key;
    if (
      !/^[0-9]$/.test(char) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(char)
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: "" });
  };

  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!form.cidade.trim()) novosErros.cidade = "Cidade é obrigatória";
    if (!form.capacidade) {
      novosErros.capacidade = "Capacidade é obrigatória";
    } else if (Number(form.capacidade) <= 0) {
      novosErros.capacidade = "Capacidade deve ser maior que zero";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    try {
      if (estadio) {
        await atualizarEstadio(estadio.id, form);
        setSucesso("Estádio alterado com sucesso!");
      } else {
        await criarEstadio(form);
        setSucesso("Estádio cadastrado com sucesso!");
      }
      setTimeout(() => onFechar(), 1500);
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem ||
        "Erro ao salvar estádio. Tente novamente.";
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
      <h2>{estadio ? "Editar Estádio" : "Novo Estádio"}</h2>

      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erros.geral && <p style={{ color: "red" }}>{erros.geral}</p>}

      <div style={{ marginBottom: "12px" }}>
        <label>Nome: *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          onKeyDown={apenasLetras}
          style={estiloInput("nome")}
        />
        {erros.nome && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.nome}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Cidade: *</label>
        <input
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          onKeyDown={apenasLetras}
          style={estiloInput("cidade")}
        />
        {erros.cidade && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.cidade}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>País:</label>
        <input
          name="pais"
          value={form.pais}
          onChange={handleChange}
          onKeyDown={apenasLetras}
          style={estiloInput("pais")}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Capacidade: *</label>
        <input
          name="capacidade"
          value={form.capacidade}
          onChange={handleChange}
          onKeyDown={apenasNumeros}
          style={estiloInput("capacidade")}
          type="number"
        />
        {erros.capacidade && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {erros.capacidade}
          </span>
        )}
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

export default EstadioForm;
