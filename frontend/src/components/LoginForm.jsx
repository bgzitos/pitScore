import React, { useState } from "react";
import { fazerLogin } from "../utils/authService";

function LoginForm({ onLogin, onIrParaCadastro }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.senha) {
      setErro("Informe e-mail e senha");
      return;
    }

    try {
      const response = await fazerLogin(form);
      const { token, usuario } = response.data;

      // guarda o token pra usar nas próximas requisições e no logout
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      onLogin(usuario);
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem ||
        "Erro ao fazer login. Tente novamente.";
      setErro(mensagem);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "350px" }}
    >
      <h2>Login</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <div style={{ marginBottom: "12px" }}>
        <label>E-mail:</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{ display: "block", padding: "6px", width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Senha:</label>
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          style={{ display: "block", padding: "6px", width: "100%" }}
        />
      </div>

      <button onClick={handleLogin}>Entrar</button>

      <p style={{ marginTop: "12px" }}>
        Não tem conta? <button onClick={onIrParaCadastro}>Cadastre-se</button>
      </p>
    </div>
  );
}

export default LoginForm;
