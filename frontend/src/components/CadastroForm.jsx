import React, { useState } from "react";
import { cadastrarUsuario } from "../utils/authService";

function CadastroForm({ onIrParaLogin }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: "" });
  };

  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!form.email.trim()) novosErros.email = "E-mail é obrigatório";
    if (!form.senha || form.senha.length < 8) {
      novosErros.senha = "Senha deve ter no mínimo 8 caracteres";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;

    try {
      await cadastrarUsuario(form);
      setSucesso(
        "Cadastro realizado com sucesso! Redirecionando para o login...",
      );
      setTimeout(() => onIrParaLogin(), 1500);
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem || "Erro ao cadastrar. Tente novamente.";
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
      style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "350px" }}
    >
      <h2>Criar Conta</h2>

      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erros.geral && <p style={{ color: "red" }}>{erros.geral}</p>}

      <div style={{ marginBottom: "12px" }}>
        <label>Nome:</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          style={estiloInput("nome")}
        />
        {erros.nome && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.nome}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>E-mail:</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={estiloInput("email")}
        />
        {erros.email && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.email}</span>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Senha:</label>
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          style={estiloInput("senha")}
        />
        {erros.senha && (
          <span style={{ color: "red", fontSize: "12px" }}>{erros.senha}</span>
        )}
      </div>

      <button onClick={handleCadastrar}>Cadastrar</button>

      <p style={{ marginTop: "12px" }}>
        Já tem conta? <button onClick={onIrParaLogin}>Fazer login</button>
      </p>
    </div>
  );
}

export default CadastroForm;
