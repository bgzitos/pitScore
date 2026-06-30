package com.pitscore.backend.controller;

import com.pitscore.backend.dto.UsuarioCadastroDTO;
import com.pitscore.backend.dto.UsuarioRespostaDTO;
import com.pitscore.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UsuarioRespostaDTO> cadastrar(@Valid @RequestBody UsuarioCadastroDTO dto) {
        UsuarioRespostaDTO usuarioCriado = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }
}