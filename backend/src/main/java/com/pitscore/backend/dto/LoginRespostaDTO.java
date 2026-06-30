package com.pitscore.backend.dto;

public class LoginRespostaDTO {

    private String token;
    private UsuarioRespostaDTO usuario;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UsuarioRespostaDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioRespostaDTO usuario) { this.usuario = usuario; }
}