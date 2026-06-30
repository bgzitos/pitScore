import React, { useState } from "react";
import { fazerLogin } from "../utils/authService";

function LoginForm({ onLogin, onIrParaCadastro }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.senha) {
      setErro("Informe e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      const response = await fazerLogin(form);
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      onLogin(usuario);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <div className="auth-card">
          <div className="auth-logo">Pit<span className="score">Score</span></div>
          <div className="auth-subtitle">Faça a Copa do Mundo do seu jeito.</div>

          <div className="auth-title">Entrar na conta</div>

          {erro && <div className="form-error" style={{ marginBottom: 12 }}>{erro}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrap">
              <span className="input-icon-l">✉</span>
              <input
                className="form-input input-with-icon"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKey}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="forgot-row">
              <label className="form-label">Senha</label>
              <button className="forgot-link">Esqueceu a senha?</button>
            </div>
            <div className="input-wrap">
              <span className="input-icon-l">🔒</span>
              <input
                className="form-input input-with-icon"
                name="senha"
                type={verSenha ? "text" : "password"}
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
                onKeyDown={handleKey}
              />
              <button className="btn-eye" onClick={() => setVerSenha(!verSenha)}>
                {verSenha ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" /> Lembrar de mim
          </label>

          <button className="btn-primary" onClick={handleLogin} disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar →"}
          </button>

          <div className="auth-divider">ou</div>

          <div className="auth-alt">
            Não tem uma conta? <button onClick={onIrParaCadastro}>Cadastre-se</button>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <div className="auth-footer-logo">Pit<span className="score">Score</span></div>
        <div>© 2026 PitScore. Todos os direitos reservados.</div>
        <div className="auth-footer-names">
          <span>Eduardo</span><span>Lucas</span><span>Vincent</span>
        </div>
      </footer>
    </div>
  );
}

export default LoginForm;
