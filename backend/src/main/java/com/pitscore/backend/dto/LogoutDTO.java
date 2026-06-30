package com.pitscore.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LogoutDTO {

    @NotBlank(message = "Token é obrigatório")
    private String token;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}