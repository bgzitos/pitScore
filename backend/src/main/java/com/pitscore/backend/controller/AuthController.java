package com.pitscore.backend.controller;

import com.pitscore.backend.dto.LoginDTO;
import com.pitscore.backend.dto.LoginRespostaDTO;
import com.pitscore.backend.dto.LogoutDTO;
import com.pitscore.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRespostaDTO> login(@Valid @RequestBody LoginDTO dto) {
        LoginRespostaDTO resposta = service.login(dto);
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutDTO dto) {
        service.logout(dto.getToken());
        return ResponseEntity.noContent().build();
    }
}