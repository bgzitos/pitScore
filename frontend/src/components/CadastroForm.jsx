import React, { useState } from "react";
import { cadastrarUsuario } from "../utils/authService";

function CadastroForm({ onIrParaLogin }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: "" });
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    if (!form.senha || form.senha.length < 8) e.senha = "Senha deve ter no mínimo 8 caracteres";
    if (form.senha !== form.confirmarSenha) e.confirmarSenha = "As senhas não coincidem";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;
    setCarregando(true);
    try {
      await cadastrarUsuario({ nome: form.nome, email: form.email, senha: form.senha });
      onIrParaLogin();
    } catch (error) {
      setErros({ geral: error.response?.data?.mensagem || "Erro ao cadastrar. Tente novamente." });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <div className="auth-card">
          <div className="auth-logo">Pit<span className="score">Score</span></div>
          <div className="auth-subtitle">Precision Engineered Analytics</div>

          <div className="auth-title">Criar conta</div>

          {erros.geral && <div className="form-error" style={{ marginBottom: 12 }}>{erros.geral}</div>}

          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className={`form-input${erros.nome ? " error" : ""}`}
              name="nome"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={handleChange}
            />
            {erros.nome && <div className="form-error">{erros.nome}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input${erros.email ? " error" : ""}`}
              name="email"
              type="email"
              placeholder="nome@exemplo.com"
              value={form.email}
              onChange={handleChange}
            />
            {erros.email && <div className="form-error">{erros.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className={`form-input${erros.senha ? " error" : ""}`}
              name="senha"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
            />
            {erros.senha && <div className="form-error">{erros.senha}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <input
              className={`form-input${erros.confirmarSenha ? " error" : ""}`}
              name="confirmarSenha"
              type="password"
              placeholder="••••••••"
              value={form.confirmarSenha}
              onChange={handleChange}
            />
            {erros.confirmarSenha && <div className="form-error">{erros.confirmarSenha}</div>}
          </div>

          <button className="btn-primary" onClick={handleCadastrar} disabled={carregando}>
            {carregando ? "Criando conta..." : "Criar Conta →"}
          </button>

          <div className="auth-alt">
            Já tem uma conta? <button onClick={onIrParaLogin}>Entre agora</button>
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

export default CadastroForm;
