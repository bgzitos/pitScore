import React, { useState } from "react";
import { fazerLogout } from "../utils/authService";
import EstadioList from "./EstadioList";

function PainelUsuario({ usuario, onLogout }) {
  const [mensagem, setMensagem] = useState("");

  const handleSair = async () => {
    const token = localStorage.getItem("token");

    try {
      await fazerLogout(token);
    } catch (error) {
      // mesmo se der erro no backend, limpamos a sessão localmente
      console.log("Erro ao encerrar sessão no servidor:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    onLogout();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Bem-vindo, {usuario.nome}!</h1>
        <button onClick={handleSair}>Sair</button>
      </div>

      <p>
        E-mail: {usuario.email} <br />
        Perfil: {usuario.perfil}
      </p>

      {mensagem && <p>{mensagem}</p>}

      <hr />

      <EstadioList />
    </div>
  );
}

export default PainelUsuario;
